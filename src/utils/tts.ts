/**
 * Google Cloud / Gemini TTS Service with Browser Web Speech API Fallback
 * Provides reliable, high-accessibility voice narration for Thai learners.
 */

class TTSManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeId: string | null = null;
  private listeners: Set<(activeId: string | null, isLoading: boolean) => void> = new Set();
  private isLoading = false;

  public subscribe(callback: (activeId: string | null, isLoading: boolean) => void) {
    this.listeners.add(callback);
    callback(this.activeId, this.isLoading);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.activeId, this.isLoading));
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
    this.activeId = null;
    this.isLoading = false;
    this.notify();
  }

  public async speak(id: string, text: string) {
    // If the same item is already playing, toggle stop
    if (this.activeId === id) {
      this.stop();
      return;
    }

    this.stop();
    this.activeId = id;
    this.isLoading = true;
    this.notify();

    // Clean text for speech (remove markdown symbols)
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    try {
      // 1. Try server-side Gemini 3.8 Flash-Lite TTS (Google Cloud audio)
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!res.ok) {
        throw new Error(`Server TTS response not OK: ${res.status}`);
      }

      const data = await res.json();
      if (!data.audio) {
        throw new Error('No audio returned');
      }

      this.isLoading = false;
      this.notify();

      const audio = new Audio(data.audio);
      this.currentAudio = audio;

      audio.onended = () => {
        if (this.activeId === id) {
          this.activeId = null;
          this.currentAudio = null;
          this.notify();
        }
      };

      audio.onerror = () => {
        console.warn('Audio playback error, falling back to Web Speech API');
        this.fallbackWebSpeech(id, cleanText);
      };

      await audio.play();
    } catch (err) {
      console.warn('Google Cloud Gemini TTS failed or unavailable, using Web Speech API fallback:', err);
      this.fallbackWebSpeech(id, cleanText);
    }
  }

  private fallbackWebSpeech(id: string, text: string) {
    this.isLoading = false;
    this.notify();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.activeId = null;
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = 0.95; // Slightly slower, very clear for students
    utterance.pitch = 1.0;

    // Pick a Thai voice if available
    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find((v) => v.lang.includes('th') || v.lang.includes('TH'));
    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    utterance.onend = () => {
      if (this.activeId === id) {
        this.activeId = null;
        this.currentUtterance = null;
        this.notify();
      }
    };

    utterance.onerror = () => {
      this.activeId = null;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public getActiveId(): string | null {
    return this.activeId;
  }
}

export const tts = new TTSManager();
