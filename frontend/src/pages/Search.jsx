import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, Play, ArrowLeft, Loader2, Sparkles, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRENDING_MOVIES } from '../constants';
import { searchMovies } from '../service/movie_service';
import MovieCard from '../components/shared/MovieCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Scroll to top when query or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [query, page]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const loadResults = async () => {
      try {
        const response = await searchMovies(query, { page, limit: 12 });
        const movies = response.data || [];
        const mappedMovies = movies.map((movie) => ({
          ...movie,
          image: movie.avatar_url || movie.image,
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : '',
        }));
        setResults(mappedMovies);
        setPagination(response.pagination);
      } catch (error) {
        setResults([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [query, page]);

  const totalResults = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-surface pt-32 pb-40 px-6 lg:px-12 max-w-[1920px] mx-auto overflow-x-hidden">
      <div className="flex flex-col gap-12">
        {/* Search Header - Cinematic Design */}
        <header className="relative py-16 px-10 glass-dark rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[80px] -z-10 -translate-x-1/4 translate-y-1/4"></div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div className="space-y-6">
              <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant hover:text-primary transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Quay lại trang chủ
              </Link>
              <div className="space-y-4">
                <h1 className="text-sm font-black text-primary uppercase tracking-[0.4em]">Kết quả tìm kiếm</h1>
                <div className="flex items-center gap-6">
                  <span className="text-5xl md:text-7xl font-black font-manrope text-white tracking-tighter text-glow italic">"{query}"</span>
                  <div className="px-5 py-2 glass-dark rounded-2xl border border-white/10 shadow-xl self-center">
                    <span className="text-xs font-black text-white uppercase tracking-widest">
                      {totalResults} bộ phim
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Link to="/filter" className="btn-secondary px-8 py-5 text-xs tracking-[0.2em] font-black uppercase shadow-2xl group border border-white/10 hover:bg-white/5">
              <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform text-primary" />
              Bộ lọc nâng cao
            </Link>
          </div>
        </header>

        <section className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-40 space-y-8"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                  <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                   <p className="text-xs font-black text-white uppercase tracking-[0.3em] animate-pulse">Đang quét kho lưu trữ Cinema+</p>
                   <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Vui lòng đợi trong giây lát</p>
                </div>
              </motion.div>
            ) : results.length > 0 ? (
              <div className="space-y-24">
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-16"
                >
                  {results.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <MovieCard movie={movie} variant="default" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination Logic */}
                {pagination && pagination.totalPages > 1 && (
                  <nav className="flex justify-center items-center gap-4">
                    <button 
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl glass hover:bg-white/10 text-white transition-all group border border-white/5 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                    >
                      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-3">
                      {Array.from({ length: pagination.totalPages }, (_, i) => {
                        const p = i + 1;
                        // Basic pager logic
                        if (pagination.totalPages > 7) {
                          if (p !== 1 && p !== pagination.totalPages && Math.abs(p - page) > 1) {
                            if (p === 2 || p === pagination.totalPages - 1) return <span key={p} className="text-white/20">...</span>;
                            return null;
                          }
                        }

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
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-40 text-center"
              >
                <div className="w-32 h-32 glass-dark rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/5 shadow-2xl relative group">
                   <div className="absolute inset-0 bg-primary/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <SearchIcon className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors duration-500" />
                </div>
                <div className="space-y-4 max-w-lg mx-auto mb-16">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Không tìm thấy phim</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">
                    Chúng tôi không thể tìm thấy kết quả cho <span className="text-white">"{query}"</span>. Hãy thử kiểm tra lại chính tả hoặc tìm kiếm với từ khóa phổ quát hơn.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-5">
                  <Link to="/" className="btn-primary py-4 px-10 text-[10px] uppercase tracking-[0.2em] shadow-xl">
                    Về trang chủ
                  </Link>
                  <Link to="/filter" className="btn-secondary py-4 px-10 text-[10px] uppercase tracking-[0.2em] bg-white/5">
                    Khám phá kho phim
                  </Link>
                </div>

                <div className="pt-32 w-full max-w-6xl">
                  <div className="flex items-center gap-4 mb-12">
                     <TrendingUp className="w-5 h-5 text-primary" />
                     <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Có thể bạn quan tâm (Xu hướng)</h4>
                     <div className="h-px flex-grow bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-left">
                    {TRENDING_MOVIES.slice(0, 6).map(movie => (
                      <Link key={movie.id} to={`/movie/${movie.id}`} className="group space-y-4">
                        <div className="aspect-[2/3] rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
                          <img src={movie.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={movie.title} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl">
                               <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 glass-dark px-2 py-1 rounded-lg border border-white/10">
                             <span className="text-[10px] font-black text-primary">HOT</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                           <h5 className="font-black text-xs text-white group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">{movie.title}</h5>
                           <div className="flex items-center gap-2 opacity-40">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span className="text-[9px] font-black text-white uppercase tracking-tighter">Gợi ý top đầu</span>
                           </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default Search;
