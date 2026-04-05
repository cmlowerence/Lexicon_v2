import { Volume2 } from 'lucide-react';
import { useRef } from 'react';

export default function PronunciationPlayer({ audioUrl }) {
  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Audio playback failed:", err));
    }
  };

  if (!audioUrl) return null;

  return (
    <button 
      onClick={playAudio}
      className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-full transition-colors flex items-center justify-center"
      aria-label="Play pronunciation"
    >
      <Volume2 size={20} />
      <audio ref={audioRef} src={audioUrl} className="hidden" />
    </button>
  );
}