interface StarRatingProps {
  rating: number;
  reviewCount?: number;
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="text-rose-500">★</span>
      <span className="font-semibold">{rating.toFixed(2)}</span>
      {reviewCount !== undefined && (
        <span className="text-gray-400 text-xs">({reviewCount})</span>
      )}
    </span>
  );
}
