import React from 'react';
import { Volume2, VolumeX, BookOpen, CheckSquare, Sparkles } from 'lucide-react';
import { tts } from '../utils/tts';

interface NavbarProps {
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ fontSize, setFontSize, onNavigate }) => {
  const [isPlayingAny, setIsPlayingAny] = React.useState(false);

  React.useEffect(() => {
    return tts.subscribe((activeId) => {
      setIsPlayingAny(!!activeId);
    });
  }, []);

  const handleStopAllSpeech = () => {
    tts.stop();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-base sm:text-lg font-bold text-slate-900 leading-tight">
                ส21103 สังคมศึกษา ม.1
              </span>
              <span className="block text-xs font-medium text-amber-700">
                พฤติกรรมการบริโภค
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('hero')}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            หน้าหลัก
          </button>
          <button
            onClick={() => onNavigate('lessons')}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            4 บทเรียน
          </button>
          <button
            onClick={() => onNavigate('interactive')}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            ห้องทดลองคิด
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            แบบทดสอบท้ายบท
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Font Size & Quick TTS / Quiz CTA) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* TTS Global Stop Button (when playing) */}
          {isPlayingAny && (
            <button
              onClick={handleStopAllSpeech}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-all animate-pulse"
              title="หยุดเสียงบรรยายทั้งหมด"
            >
              <VolumeX className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">หยุดเสียง</span>
            </button>
          )}

          {/* Font Size Accessibility Adjuster */}
          <div className="flex items-center bg-amber-50/80 border border-amber-200 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded transition-colors ${fontSize === 'normal' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              title="ขนาดตัวอักษรปกติ"
            >
              ก
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded transition-colors ${fontSize === 'large' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              title="ขนาดตัวอักษรใหญ่"
            >
              ก+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded transition-colors ${fontSize === 'xlarge' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              title="ขนาดตัวอักษรใหญ่พิเศษสำหรับแท็บเล็ต"
            >
              ก++
            </button>
          </div>

          {/* Quick Quiz CTA button */}
          <button
            onClick={() => onNavigate('quiz')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all shadow-xs whitespace-nowrap cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>ทำแบบทดสอบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
