import { Heart } from 'lucide-react';
import { useState } from 'react';

interface LoveButtonProps {
  loved: boolean;
  onClick?: () => void;
  size?: number;
  showLabel?: boolean;
  variant?: 'pill' | 'icon';
}

export default function LoveButton({
  loved,
  onClick,
  size = 20,
  showLabel = false,
  variant = 'pill',
}: LoveButtonProps) {
  const [bouncing, setBouncing] = useState(false);

  const handleClick = () => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
    onClick?.();
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`group p-2.5 rounded-full transition-all duration-300 focus:outline-none ${
          loved
            ? 'bg-[#E50914]/15 text-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.3)] border border-[#E50914]/30'
            : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
        }`}
        title={loved ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        <Heart
          size={size}
          className={`transition-transform duration-300 ${
            bouncing ? 'scale-130' : 'group-hover:scale-110'
          } ${loved ? 'fill-[#E50914] text-[#E50914]' : ''}`}
          strokeWidth={loved ? 0 : 2}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full font-medium transition-all duration-300 focus:outline-none ${
        loved
          ? 'bg-gradient-to-r from-[#E50914] to-[#B20710] text-white shadow-[0_0_25px_rgba(229,9,20,0.4)] border border-[#E50914]/50'
          : 'bg-white/8 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 backdrop-blur-md'
      }`}
    >
      <Heart
        size={size}
        className={`transition-transform duration-300 ${
          bouncing ? 'scale-135' : 'group-hover:scale-110'
        } ${loved ? 'fill-white text-white' : ''}`}
        strokeWidth={loved ? 0 : 2}
      />
      {showLabel && (
        <span className="text-xs font-semibold tracking-wide">
          {loved ? 'Loved Game' : 'Love this'}
        </span>
      )}
    </button>
  );
}
