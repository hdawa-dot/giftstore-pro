interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

export function StarRating({ rating, count, size = 'sm' }: StarRatingProps) {
  const sz = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <div className={`flex items-center gap-1 ${sz}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={star <= Math.round(rating) ? 'text-gold-400' : 'text-dark-600'}
        >
          ★
        </span>
      ))}
      {count !== undefined && (
        <span className="text-dark-400 ms-1">({count})</span>
      )}
    </div>
  );
}
