import { Heart } from 'lucide-react';

interface LoveButtonProps {
  loved: boolean;
  onClick?: () => void;
  size?: number;
  showLabel?: boolean;
}

export default function LoveButton({
  loved,
  onClick,
  size = 22,
  showLabel = false,
}: LoveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-2 transition-all duration-200 ${
        loved
          ? 'text-accent'
          : 'text-text-muted hover:text-accent'
      }`}
      title={loved ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={size}
        className={`transition-all duration-200 ${
          loved
            ? 'fill-accent scale-110'
            : 'group-hover:scale-110'
        }`}
        strokeWidth={loved ? 0 : 1.5}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {loved ? 'Loved' : 'Love this'}
        </span>
      )}
    </button>
  );
}
