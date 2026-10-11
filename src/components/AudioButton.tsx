import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { tts } from '../utils/tts';

interface AudioButtonProps {
  id: string;
  textToRead: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'compact';
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  id,
  textToRead,
  label = 'ฟังเสียงบรรยาย',
  variant = 'primary',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    return tts.subscribe((activeId, loading) => {
      setIsPlaying(activeId === id);
      setIsLoading(activeId === id && loading);
    });
  }, [id]);

  const handleToggle = () => {
    tts.speak(id, textToRead);
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'หยุดเสียงบรรยาย' : `ฟังเสียงบรรยาย: ${label}`}
        title={isPlaying ? 'กดเพื่อหยุดฟัง' : 'กดเพื่อฟังเสียงบรรยาย'}
        className={`inline-flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 ${
          isPlaying
            ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
            : isLoading
            ? 'bg-amber-100 text-amber-700 border-amber-300 animate-pulse'
            : 'bg-white text-amber-700 hover:bg-amber-50 border-amber-200 shadow-xs'
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    );
  }

  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? 'หยุดเสียงบรรยาย' : `ฟังเสียงบรรยาย: ${label}`}
      className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isPlaying
          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md ring-2 ring-amber-400'
          : isLoading
          ? 'bg-amber-100 text-amber-800 border border-amber-300'
          : isPrimary
          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm border border-amber-600'
          : 'bg-white hover:bg-amber-50/80 text-amber-800 border border-amber-300 shadow-xs'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-current shrink-0" />
      ) : isPlaying ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="flex h-3 w-1 bg-white animate-[pulse_0.6s_ease-in-out_infinite] rounded-full" />
          <span className="flex h-4 w-1 bg-white animate-[pulse_0.4s_ease-in-out_infinite] rounded-full" />
          <span className="flex h-2.5 w-1 bg-white animate-[pulse_0.8s_ease-in-out_infinite] rounded-full" />
        </div>
      ) : (
        <Volume2 className="w-5 h-5 text-current shrink-0" />
      )}

      <span className="whitespace-nowrap">
        {isLoading ? 'กำลังโหลดเสียง...' : isPlaying ? 'หยุดฟังเสียง' : label}
      </span>
    </button>
  );
};
