import React, { useState } from 'react';
import { Filter as FilterIcon, Globe, Calendar, ChevronLeft, ChevronRight, X, LayoutGrid, List, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFilter } from '../hooks/useFilter';
import MovieCard from '../components/shared/MovieCard';

const Filter = () => {
  const { activeFilters, filteredMovies, updateFilter, page, setPage, pagination } = useFilter();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const genres = [
    'Tất cả', 'Hành động', 'Hài hước', 'Kinh dị', 'Tình cảm', 'Khoa học viễn tưởng', 'Tài liệu', 'Anime'
  ];

  const years = ['Tất cả', '2024', '2023', '2022', 'Trước 2022'];
  const countries = ['Tất cả quốc gia', 'Việt Nam', 'Hoa Kỳ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Thái Lan'];
  const sortOptions = ['Mới nhất', 'Cũ nhất', 'Đánh giá cao', 'Xem nhiều nhất'];

  const clearFilters = () => {
    updateFilter('genre', 'Tất cả');
    updateFilter('year', 'Tất cả');
    updateFilter('country', 'Tất cả quốc gia');
    updateFilter('sort', 'Mới nhất');
  };

  const isFiltered = activeFilters.genre !== 'Tất cả' ||
    activeFilters.year !== 'Tất cả' ||
    activeFilters.country !== 'Tất cả quốc gia' ||
    activeFilters.sort !== 'Mới nhất';

  // Scroll to top when page or filters change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, activeFilters]);

  return (
    <div className="min-h-screen bg-surface pt-32 pb-40 px-6 lg:px-12 max-w-[1920px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters - Glass Design */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-32 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter text-glow">Khám phá</h1>
              </div>
              <p className="text-on-surface-variant/60 text-xs font-black uppercase tracking-[0.2em]">Lọc theo sở thích của bạn</p>
            </div>

            <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10 group-hover:bg-primary/20 transition-colors"></div>

              {/* Sắp xếp */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" /> Sắp xếp theo
                </span>
                <div className="relative">
                  <div
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`bg-surface px-5 py-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all border ${isSortOpen ? 'border-primary' : 'border-white/5'} text-white shadow-xl`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{activeFilters.sort}</span>
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSortOpen ? 'rotate-90 text-primary' : '-rotate-90 text-white/40'}`} />
                  </div>
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-surface-container-high rounded-2xl border border-white/5 shadow-2xl z-40 overflow-hidden backdrop-blur-3xl"
                      >
                        {sortOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              updateFilter('sort', option);
                              setIsSortOpen(false);
                            }}
                            className={`px-5 py-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary/10 transition-colors ${activeFilters.sort === option ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:text-white'}`}
                          >
                            {option}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Thể loại */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FilterIcon className="text-primary w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Thể loại</span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      className={`flex items-center gap-4 p-3 rounded-2xl transition-all group ${activeFilters.genre === genre ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-on-surface-variant'}`}
                      onClick={() => updateFilter('genre', genre)}
                    >
                      <div className={`w-2 h-2 rounded-full transition-all ${activeFilters.genre === genre ? 'bg-primary scale-125 shadow-[0_0_10px_rgba(229,9,20,0.8)]' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
                      <span className="text-[11px] font-black uppercase tracking-widest">{genre}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quốc gia */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="text-primary w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Quốc gia</span>
                </div>
                <div className="relative group/sel">
                  <select
                    value={activeFilters.country}
                    onChange={(e) => updateFilter('country', e.target.value)}
                    className="w-full bg-surface border border-white/5 rounded-2xl py-4 px-5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 appearance-none outline-none cursor-pointer hover:bg-white/5 transition-all text-white shadow-xl"
                  >
                    {countries.map(c => <option key={c} value={c} className="bg-surface-container-high">{c}</option>)}
                  </select>
                  <ChevronLeft className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 -rotate-90 pointer-events-none text-white/40 group-hover/sel:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Movie Grid */}
        <div className="flex-1 space-y-12">
          <div className="flex items-center justify-between pb-8 border-b border-white/5 overflow-x-auto gap-12">
            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">
                  Tìm thấy <span className="text-white">{filteredMovies.length}</span> kết quả
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3">

                {activeFilters.genre !== 'Tất cả' && (
                  <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    {activeFilters.genre}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => updateFilter('genre', 'Tất cả')}
                    />
                  </div>
                )}

                {activeFilters.country !== 'Tất cả quốc gia' && (
                  <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    {activeFilters.country}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => updateFilter('country', 'Tất cả quốc gia')}
                    />
                  </div>
                )}

                {activeFilters.sort !== 'Mới nhất' && (
                  <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    {activeFilters.sort}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => updateFilter('sort', 'Mới nhất')}
                    />
                  </div>
                )}

                {isFiltered && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={clearFilters}
                    className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all group"
                    title="Xóa tất cả bộ lọc"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}

              </div>
            </div>
          </div>

          <motion.div
            layout
            className={`grid gap-x-8 gap-y-16 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
          >
            <AnimatePresence mode="popLayout">
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MovieCard movie={movie} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination - Premium Design */}
          {pagination && pagination.totalPages > 1 && (
            <nav className="pt-24 flex justify-center items-center gap-4">
              <button 
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="w-14 h-14 flex items-center justify-center rounded-2xl glass hover:bg-white/10 text-white transition-all group border border-white/5 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3">
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                  // Hiển thị max 7 trang để tránh vỡ UI nếu data quá lớn
                  // Tạm thời hiển thị các trang đầu do ko có logic spread phức tạp theo yêu cầu
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black text-xs transition-all border ${p === page ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-110' : 'glass border-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white'}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="w-14 h-14 flex items-center justify-center rounded-2xl glass hover:bg-white/10 text-white transition-all group border border-white/5 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;