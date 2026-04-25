import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

export function MultiSelectGenre({ genres, selectedIds = [], onChange, label = "Thể loại" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ensure selectedIds is always an array of numbers
  const normalizedSelectedIds = Array.isArray(selectedIds) 
    ? selectedIds.map(id => parseInt(id)).filter(id => !isNaN(id))
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedGenres = genres.filter(g => normalizedSelectedIds.includes(g.id));

  const toggleGenre = (genreId) => {
    const newIds = normalizedSelectedIds.includes(genreId)
      ? normalizedSelectedIds.filter(id => id !== genreId)
      : [...normalizedSelectedIds, genreId];
    onChange(newIds);
  };

  const removeGenre = (genreId, e) => {
    e.stopPropagation();
    onChange(normalizedSelectedIds.filter(id => id !== genreId));
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-container transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {selectedGenres.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedGenres.map((genre) => (
                  <div
                    key={genre.id}
                    className="inline-flex items-center gap-2 bg-primary-container/15 text-primary-container rounded-lg px-3 py-1 text-xs font-bold"
                  >
                    {genre.name}
                    <span
                    onClick={(e) => removeGenre(genre.id, e)}
                    className="hover:text-primary-container/70 transition-colors cursor-pointer"
                      >
                    <X className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-on-surface-variant/60">Chọn thể loại...</span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-on-surface-variant transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high rounded-2xl border border-outline-variant/20 shadow-lg z-50 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {genres.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant text-sm">
                  Không có thể loại nào
                </div>
              ) : (
                genres.map((genre) => {
                  const isSelected = normalizedSelectedIds.includes(genre.id);
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => toggleGenre(genre.id)}
                      className={`w-full px-5 py-3 text-left text-sm font-bold transition-all flex items-center justify-between hover:bg-surface-container-highest ${
                        isSelected ? 'bg-primary-container/10 text-primary-container' : 'text-on-surface'
                      }`}
                    >
                      <span>{genre.name}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary-container" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
