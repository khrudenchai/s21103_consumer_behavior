/**
 * Text-to-Speech (TTS) Service for Thai Language (th-TH)
 * Supports:
 * 1. Native SpeechSynthesis with strict Thai voice detection
 * 2. Automatic Fallback to Google Translate TTS Audio (100% natural Thai voice on any device)
 * 3. Text Chunking for long passages to avoid browser audio cutoffs
 * 4. Immediate cancellation & responsive state management
 */

class TTSManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private activeId: string | null = null;
  private listeners: Set<(activeId: string | null, isLoading: boolean) => void> = new Set();
  private isLoading = false;
  private voices: SpeechSynthesisVoice[] = [];
  private sessionId = 0; // Incremented on stop to invalidate pending chunk callbacks

  constructor() {
    this.initVoiceListener();
  }

  /**
   * รองรับการโหลดเสียงของเบราว์เซอร์: ดึงรายการเสียงทันทีและดักฟัง onvoiceschanged
   */
  private initVoiceListener() {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      this.loadVoices();

      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };

      if (window.speechSynthesis.addEventListener) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          this.loadVoices();
        });
      }
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
    } catch {
      this.voices = [];
    }
  }

  /**
   * ค้นหา Voice ภาษาไทยอย่างเคร่งครัด (lang เริ่มต้นด้วย 'th' หรือชื่อมีระบุ Thai)
   * หากไม่มี จะคืนค่า null เพื่อให้ระบบ Fallback ไปใช้ Google TTS Audio ทันที
   */
  public getThaiVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    if (!this.voices || this.voices.length === 0) return null;

    // 1. ค้นหารหัสภาษา 'th-TH' ตรงตัว
    const exactThai = this.voices.find((v) => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      return l === 'th-th' || l === 'th';
    });
    if (exactThai) return exactThai;

    // 2. ค้นหาภาษาที่ขึ้นต้นด้วย 'th'
    const startsWithTh = this.voices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      return l.startsWith('th-') || l.startsWith('th');
    });
    if (startsWithTh) return startsWithTh;

    // 3. ค้นหาจากชื่อเสียงที่มีคำว่า Thai หรือ ไทย
    const namedThai = this.voices.find((v) => {
      const n = (v.name || '').toLowerCase();
      return n.includes('thai') || n.includes('ไทย') || n.includes('kanya') || n.includes('narisa');
    });
    if (namedThai) return namedThai;

    return null;
  }

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

  /**
   * เมื่อกดปุ่มอ่านเสียงใหม่ ให้หยุดเสียงเก่าทันที (speechSynthesis.cancel() หรือหยุด Audio เดิม)
   */
  public stop() {
    this.sessionId++; // ยกเลิกคิวข้อความที่ค้างอยู่ทั้งหมด

    // หยุด HTMLAudioElement
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.onplay = null;
        this.currentAudio.removeAttribute('src');
        this.currentAudio.load();
      } catch (e) {
        console.warn('Error stopping audio:', e);
      }
      this.currentAudio = null;
    }

    // หยุด SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
      this.currentUtterance = null;
    }

    this.activeId = null;
    this.isLoading = false;
    this.notify();
  }

  /**
   * ตัดแบ่งข้อความยาวๆ (Text Chunking) ตามเครื่องหมายวรรคตอนและช่องว่าง
   * ไม่ให้เกิน ~140 ตัวอักษร เพื่อรองรับทั้ง Google TTS URL และแก้บั๊ก Web Speech API ตัดเสียง
   */
  private splitTextIntoChunks(text: string, maxLen = 140): string[] {
    const cleaned = text
      .replace(/[#*`_~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) return [];
    if (cleaned.length <= maxLen) return [cleaned];

    // แบ่งตามเครื่องหมายวรรคตอน หรือช่องว่าง
    const sentences = cleaned.split(/([.\n!?؛;,:]|\s{2,}|\sและ\s|\sหรือ\s)/g).filter(Boolean);
    const chunks: string[] = [];
    let current = '';

    for (const part of sentences) {
      if ((current + ' ' + part).trim().length <= maxLen) {
        current = (current + ' ' + part).trim();
      } else {
        if (current) chunks.push(current);
        // ถ้าท่อนนี้ยาวเกิน maxLen ให้ตัดด้วยช่องว่าง
        if (part.length > maxLen) {
          const words = part.split(' ').filter(Boolean);
          let subCurrent = '';
          for (const w of words) {
            if ((subCurrent + ' ' + w).trim().length <= maxLen) {
              subCurrent = (subCurrent + ' ' + w).trim();
            } else {
              if (subCurrent) chunks.push(subCurrent);
              if (w.length > maxLen) {
                // ซอยย่อยตามความยาว
                for (let i = 0; i < w.length; i += maxLen) {
                  chunks.push(w.slice(i, i + maxLen));
                }
                subCurrent = '';
              } else {
                subCurrent = w;
              }
            }
          }
          if (subCurrent) chunks.push(subCurrent);
          current = '';
        } else {
          current = part;
        }
      }
    }

    if (current) chunks.push(current);
    return chunks.filter((c) => c.trim().length > 0);
  }

  /**
   * ฟังก์ชันหลักสำหรับอ่านเสียงบรรยาย
   */
  public speak(id: string, text?: string | null) {
    // หากกดปุ่มเดิมที่กำลังอ่านอยู่ ให้หยุดเสียง (Toggle Stop)
    if (this.activeId === id) {
      this.stop();
      return;
    }

    // หยุดเสียงเก่าทันทีก่อนเริ่มอ่านเสียงใหม่
    this.stop();

    const currentSession = this.sessionId;
    this.activeId = id;
    this.isLoading = true;
    this.notify();

    // ตรวจสอบว่าปุ่มส่งข้อความเข้ามา ไม่ให้เป็นข้อความว่างเปล่า
    let validText = (text || '')
      .replace(/[#*`_~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!validText) {
      validText = 'บทเรียนวิชาสังคมศึกษา รหัส ส 21103 เรื่อง พฤติกรรมการบริโภค สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 1';
    }

    // ตัดแบ่งข้อความเป็นท่อนสั้นๆ
    const chunks = this.splitTextIntoChunks(validText, 140);
    if (chunks.length === 0) {
      this.stop();
      return;
    }

    // ตรวจสอบว่าเบราว์เซอร์มี Native Voice ภาษาไทยหรือไม่
    const thaiVoice = this.getThaiVoice();

    if (thaiVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // มีเสียงภาษาไทยแท้ในระบบ -> ใช้งาน SpeechSynthesis
      this.playSpeechSynthesisChunks(id, chunks, thaiVoice, currentSession);
    } else {
      // เครื่องไม่มีเสียงภาษาไทย -> Fallback ไปใช้ Google Translate TTS Audio 100% ภาษาไทยชัดเจน
      this.playGoogleTTSAudioChunks(id, chunks, currentSession);
    }
  }

  /**
   * เล่นข้อความด้วย SpeechSynthesis (Native Web Speech API)
   */
  private playSpeechSynthesisChunks(
    id: string,
    chunks: string[],
    voice: SpeechSynthesisVoice,
    session: number
  ) {
    let index = 0;

    const playNext = () => {
      if (this.sessionId !== session || this.activeId !== id) return;

      if (index >= chunks.length) {
        // เล่นจบครบทุกท่อน
        this.stop();
        return;
      }

      const chunkText = chunks[index];
      index++;

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = 'th-TH';
        utterance.voice = voice;
        utterance.rate = 0.95; // จังหวะชัดเจนสำหรับนักเรียน
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          if (this.sessionId === session && this.activeId === id) {
            this.isLoading = false;
            this.notify();
          }
        };

        utterance.onend = () => {
          if (this.sessionId === session && this.activeId === id) {
            playNext();
          }
        };

        utterance.onerror = (e) => {
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.warn('SpeechSynthesis chunk error, falling back to Google TTS:', e);
            // สลับไปเล่น Google TTS Audio แทนเพื่อความต่อเนื่อง
            const remaining = chunks.slice(index - 1);
            this.playGoogleTTSAudioChunks(id, remaining, session);
          }
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Error in speechSynthesis.speak, falling back to audio:', err);
        const remaining = chunks.slice(index - 1);
        this.playGoogleTTSAudioChunks(id, remaining, session);
      }
    };

    playNext();
  }

  /**
   * Fallback: เล่นเสียงภาษาไทยผ่าน Google Translate TTS URL
   * เล่นผ่าน new Audio() ให้เสียงภาษาไทยคมชัด 100% ทุกเครื่องโดยไม่ต้องติดตั้ง voice pack
   */
  private playGoogleTTSAudioChunks(id: string, chunks: string[], session: number) {
    let index = 0;

    const playNextAudio = () => {
      if (this.sessionId !== session || this.activeId !== id) return;

      if (index >= chunks.length) {
        // เล่นจบครบทุกท่อน
        this.stop();
        return;
      }

      const chunkText = chunks[index];
      index++;

      try {
        // Google Translate TTS URL (ภาษาไทย tl=th)
        const encodedText = encodeURIComponent(chunkText);
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=${encodedText}`;

        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onplay = () => {
          if (this.sessionId === session && this.activeId === id) {
            this.isLoading = false;
            this.notify();
          }
        };

        audio.onended = () => {
          if (this.sessionId === session && this.activeId === id) {
            playNextAudio();
          }
        };

        audio.onerror = (err) => {
          console.warn('Audio chunk error:', err);
          // หากท่อนนี้โหลดไม่ได้ ให้พยายามเล่นท่อนถัดไป
          if (this.sessionId === session && this.activeId === id) {
            if (index < chunks.length) {
              playNextAudio();
            } else {
              this.stop();
            }
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Playback error (e.g. autoplay restriction):', err);
            this.stop();
          });
        }
      } catch (err) {
        console.error('Failed to play TTS audio chunk:', err);
        this.stop();
      }
    };

    playNextAudio();
  }

  public getActiveId(): string | null {
    return this.activeId;
  }
}

export const tts = new TTSManager();
