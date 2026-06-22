'use client';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
      className="absolute top-3 right-3 p-1 hover:scale-110 transition-transform"
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      <span className="text-2xl drop-shadow-md">{isFavorite ? '❤️' : '🤍'}</span>
    </button>
  );
}
