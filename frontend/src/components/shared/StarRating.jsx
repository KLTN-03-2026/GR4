import { Star } from 'lucide-react';

const StarRating = ({ value, onChange, editable = false }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type={editable ? 'button' : 'button'}
          onClick={() => editable && onChange?.(star)}
          className={`transition-all duration-200 ${editable ? 'hover:scale-110' : ''}`}
          aria-label={`${star} sao`}
        >
          <Star
            className={`w-4 h-4 ${star <= value ? 'text-primary fill-primary' : 'text-on-surface-variant'}`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
