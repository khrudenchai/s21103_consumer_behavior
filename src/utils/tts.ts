/**
 * Text-to-Speech (TTS) Service using Web Speech API (SpeechSynthesis)
 * Focused on Thai language (th-TH) support for middle school students
 */

class TTSManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private activeId: string | null = null;
  private listeners: Set<(activeId: string | null, isLoading: boolean) => void> = new Set();
  private isLoading = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initVoiceListener();
  }

  /**
   * รองรับการโหลดเสียงของเบราว์เซอร์: เพิ่ม Event Listener window.speechSynthesis.onvoiceschanged
   * เพื่อดึงรายการเสียงให้พร้อมใช้งานเสมอ
   */
  private initVoiceListener() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // โหลดเสียงครั้งแรก
    this.loadVoices();

    // ตรวจจับเมื่อเบราว์เซอร์โหลดรายการเสียงเสร็จสิ้น
    window.speechSynthesis.onvoiceschanged = () => {
      this.loadVoices();
    };

    if (window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  /**
   * ค้นหาเสียงภาษาไทยจาก window.speechSynthesis.getVoices()
   * โดยมองหา voice ที่มี lang.includes('th') หรือ lang === 'th-TH'
   */
  public getThaiVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (!this.voices || this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }

    // 1. ลำดับแรก: หาภาษา th-TH ตรงตัว
    const exactThai = this.voices.find(
      (v) =>
        v.lang === 'th-TH' ||
        v.lang.toLowerCase() === 'th-th' ||
        v.lang.replace('_', '-').toLowerCase() === 'th-th'
    );
    if (exactThai) return exactThai;

    // 2. ลำดับสอง: หาเสียงที่มีรหัสภาษาประกอบด้วย 'th'
    const partialThai = this.voices.find(
      (v) =>
        v.lang.toLowerCase().includes('th') ||
        v.lang.toLowerCase().startsWith('th')
    );
    if (partialThai) return partialThai;

    // 3. ลำดับสาม: ค้นหาจากชื่อเสียงที่มีคำว่า thai หรือ ไทย
    const nameThai = this.voices.find(
      (v) =>
        v.name.toLowerCase().includes('thai') ||
        v.name.includes('ไทย')
    );
    if (nameThai) return nameThai;

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
   * สั่งหยุดเสียงบรรยายทั้งหมดและยกเลิกคิว
   */
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

  /**
   * ฟังก์ชันอ่านเสียงบรรยายภาษาไทย
   */
  public speak(id: string, text?: string | null) {
    // หากกดปุ่มเดิมที่กำลังเล่นอยู่ ให้หยุดเสียง (Toggle Stop)
    if (this.activeId === id) {
      this.stop();
      return;
    }

    // ก่อนเริ่มอ่านทุกครั้ง ให้สั่ง window.speechSynthesis.cancel() เพื่อล้างคิวเสียงเก่าก่อน
    this.stop();

    this.activeId = id;
    this.isLoading = true;
    this.notify();

    // ตรวจสอบข้อความก่อนอ่าน หากข้อความว่างเปล่าหรือเป็น null ให้มีข้อความสำรองอ่านแทน
    let cleanText = (text || '')
      .replace(/[#*`_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      cleanText = 'บทเรียนวิชาสังคมศึกษา รหัส ส 21103 เรื่อง พฤติกรรมการบริโภค สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 1';
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('เบราว์เซอร์ไม่รองรับ Web Speech API');
      this.activeId = null;
      this.isLoading = false;
      this.notify();
      return;
    }

    try {
      // ล้างคิวเสียงเก่าก่อนทุกครั้ง
      window.speechSynthesis.cancel();

      // ปลดสถานะค้าง (paused) หากมี
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // บังคับใช้เสียงภาษาไทย (th-TH)
      utterance.lang = 'th-TH';
      utterance.rate = 0.95; // ความเร็วพอเหมาะ ชัดถ้อยชัดคำสำหรับนักเรียน
      utterance.pitch = 1.0;

      // ค้นหาเสียงภาษาไทยจาก window.speechSynthesis.getVoices()
      const thaiVoice = this.getThaiVoice();
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      utterance.onstart = () => {
        if (this.activeId === id) {
          this.isLoading = false;
          this.notify();
        }
      };

      utterance.onend = () => {
        if (this.activeId === id) {
          this.activeId = null;
          this.currentUtterance = null;
          this.isLoading = false;
          this.notify();
        }
      };

      utterance.onerror = (event) => {
        // ไม่แจ้งเตือน error หากเกิดจากการกดยกเลิกหรือเปลี่ยนข้อความ
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', event);
        }
        if (this.activeId === id) {
          this.activeId = null;
          this.currentUtterance = null;
          this.isLoading = false;
          this.notify();
        }
      };

      // เก็บ utterance ไว้ใน property เพื่อป้องกันการถูก Garbage Collector ลบทิ้งกลางคันใน Chrome
      this.currentUtterance = utterance;

      this.isLoading = false;
      this.notify();

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error starting SpeechSynthesis:', err);
      this.activeId = null;
      this.isLoading = false;
      this.notify();
    }
  }

  public getActiveId(): string | null {
    return this.activeId;
  }
}

export const tts = new TTSManager();
