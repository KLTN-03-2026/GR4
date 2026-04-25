import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function Pagination({ page, totalPages, onPageChange, className }) {
  if (!totalPages || totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)}>
      <button
        type="button"
        onClick={handlePrev}
        disabled={page <= 1}
        className={cn(
          'w-11 h-11 rounded-2xl border border-white/10 text-white transition-all',
          page <= 1 ? 'opacity-40 cursor-not-allowed bg-surface' : 'bg-surface-container-high hover:bg-white/10'
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {start > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          className="w-11 h-11 rounded-2xl border border-white/10 bg-surface-container-high text-xs font-black uppercase"
        >
          1
        </button>
      )}

      {start > 2 && <span className="text-on-surface-variant">•••</span>}

      {pages.map((pageNumber) => (
        <button
          type="button"
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={cn(
            'w-11 h-11 rounded-2xl border text-xs font-black uppercase transition-all',
            pageNumber === page
              ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30'
              : 'bg-surface-container-high text-on-surface-variant border-white/10 hover:bg-white/10 hover:text-white'
          )}
        >
          {pageNumber}
        </button>
      ))}

      {end < totalPages - 1 && <span className="text-on-surface-variant">•••</span>}

      {end < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          className="w-11 h-11 rounded-2xl border border-white/10 bg-surface-container-high text-xs font-black uppercase"
        >
          {totalPages}
        </button>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={page >= totalPages}
        className={cn(
          'w-11 h-11 rounded-2xl border border-white/10 text-white transition-all',
          page >= totalPages ? 'opacity-40 cursor-not-allowed bg-surface' : 'bg-surface-container-high hover:bg-white/10'
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
