import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, X, History, Clock, TrendingUp, Star, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchMovies } from '../../service/movie_service';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const SEARCH_HISTORY_KEY = 'cinema_search_history';
  const MAX_HISTORY_ITEMS = 6;

  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      addSearchHistory(trimmedQuery);
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setIsSearchFocused(false);
    }
  };

  const saveSearchHistory = (history) => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  };

  const addSearchHistory = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setSearchHistory((prev) => {
      const next = [trimmedQuery, ...prev.filter((item) => item !== trimmedQuery)];
      const limited = next.slice(0, MAX_HISTORY_ITEMS);
      saveSearchHistory(limited);
      return limited;
    });
  };

  const clearSearchHistory = () => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setSearchHistory([]);
  };

  const handleHistoryItemClick = (term) => {
    setSearchQuery(term);
    addSearchHistory(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setIsSearchFocused(false);
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory));
      } catch (e) {
        setSearchHistory([]);
      }
    }
  }, []);

  // Mock trending searches
  const trendingSearches = [
    "Avatar 3",
    "Wednesday Season 2",
    "Dune: Part Two"
  ];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const movies = await searchMovies(searchQuery);
        const mappedMovies = movies.map((movie) => ({
          ...movie,
          image: movie.avatar_url || movie.image,
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : '',
          genre: movie.genres ? movie.genres.split(',')[0] : '',
        }));
        setSearchResults(mappedMovies.slice(0, 5));
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthPage) {
    return (
      <nav className="fixed top-0 w-full z-50 px-8 py-8">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary-container font-manrope">
            CINEMA+
          </Link>
          <Link to="#" className="text-on-surface-variant hover:text-white transition-colors text-sm font-medium tracking-wide">
            Trợ giúp?
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Blurred Overlay */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface/60 backdrop-blur-md z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isSearchFocused ? 'bg-black/40 backdrop-blur-3xl border-b border-white/5' : 'bg-surface/40 premium-blur border-b border-white/5'}`}>
        <div className="flex justify-between items-center px-8 py-3 max-w-[1920px] mx-auto h-20">
          <div className="flex items-center gap-4 md:gap-12">
            <button className="md:hidden text-white hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter text-primary uppercase font-manrope hover:scale-105 transition-transform active:scale-95 text-glow">
              CINEMA+
            </Link>
            <div className={`hidden md:flex items-center gap-10 font-manrope tracking-tight text-sm font-black uppercase transition-all duration-500 ${isSearchFocused ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>
              <Link
                to="/"
                className={`transition-all duration-300 hover:text-white ${location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                Trang chủ
              </Link>
              <Link
                to="/filter"
                className={`transition-all duration-300 hover:text-white ${location.pathname === '/filter' ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                Lọc Phim
              </Link>
              <Link
                to="/vip"
                className={`transition-all duration-300 hover:text-white ${location.pathname === '/vip' ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                Gói VIP
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div ref={searchRef} className="relative hidden lg:block">
              <form onSubmit={handleSearchSubmit} className={`flex items-center bg-white/5 rounded-2xl px-5 py-3 transition-all duration-500 border group ${isSearchFocused ? 'w-[500px] border-primary/50 bg-black/60 shadow-[0_0_30px_rgba(229,9,20,0.1)]' : 'w-72 border-white/10 hover:border-white/20'}`}>
                <Search className={`w-4 h-4 mr-4 transition-colors duration-300 ${isSearchFocused ? 'text-primary shadow-primary' : 'text-on-surface-variant group-hover:text-white'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Tìm kiếm phim, diễn viên..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface placeholder:text-on-surface-variant/40 outline-none font-medium"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-on-surface-variant hover:text-white transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>

              {/* Search Dropdown - glass-dark */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    className="absolute top-full mt-5 right-0 w-[500px] glass-dark rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden z-50"
                  >
                    {searchQuery.trim() ? (
                      <div className="flex flex-col">
                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant/60">Kết quả tìm kiếm</span>
                          <Link to="/filter" className="text-[11px] text-primary font-black uppercase tracking-widest hover:underline decoration-primary/30">Xem tất cả</Link>
                        </div>
                        <div className="max-h-[450px] overflow-y-auto hide-scrollbar py-2">
                          {isSearching ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center opacity-40">
                              <Search className="text-on-surface-variant w-12 h-12 mb-6 animate-spin" />
                              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Đang tìm kiếm...</p>
                            </div>
                          ) : searchResults.length > 0 ? (
                            searchResults.map((movie) => (
                              <Link
                                key={movie.id}
                                to={`/movie/${movie.id}`}
                                onClick={() => setIsSearchFocused(false)}
                                className="flex gap-5 px-5 py-4 hover:bg-white/5 transition-all group"
                              >
                                <div className="w-16 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-2xl border border-white/5">
                                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex flex-col justify-center py-1">
                                  <h4 className="text-on-surface font-black text-base leading-tight group-hover:text-primary transition-colors tracking-tight">{movie.title}</h4>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs font-bold text-on-surface-variant">{movie.year}</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">
                                      <Star className="w-3 h-3 text-primary fill-primary" />
                                      <span className="text-[10px] font-black text-primary">{movie.rating || '8.5'}</span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-on-surface-variant/60 mt-3 font-medium tracking-wide">
                                    {movie.genre || 'Hành động, Giật gân'}
                                  </p>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="p-16 flex flex-col items-center justify-center text-center opacity-40">
                              <Search className="text-on-surface-variant w-12 h-12 mb-6" />
                              <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Không có kết quả</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3">
                            <History className="w-5 h-5 text-primary" />
                            Lịch sử tìm kiếm
                          </h3>
                          <button onClick={clearSearchHistory} className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-red-500 transition-colors">Xóa sạch</button>
                        </div>
                        <div className="space-y-3">
                          {searchHistory.length > 0 ? (
                            searchHistory.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleHistoryItemClick(item)}
                                className="w-full text-left group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/5"
                              >
                                <div className="flex items-center gap-4">
                                  <Clock className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                                  <span className="text-sm font-bold text-on-surface/80 group-hover:text-white">{item}</span>
                                </div>
                                <X className="w-4 h-4 text-on-surface-variant/20 group-hover:text-red-500 transition-colors" />
                              </button>
                            ))
                          ) : (
                            <div className="p-8 rounded-3xl bg-white/5 text-center opacity-70">
                              <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">Chưa có lịch sử tìm kiếm</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`flex items-center gap-6 transition-all duration-500 ${isSearchFocused ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>
              {user ? (
                <>
                  <Link to="/profile/notifications" className="text-on-surface-variant hover:text-primary transition-colors p-2 relative group">
                    <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface animate-pulse"></span>
                  </Link>

                  <Link to="/profile" className="flex items-center gap-4 group cursor-pointer bg-white/5 pl-2 pr-5 py-2 rounded-2xl border border-white/5 hover:border-primary/30 transition-all shadow-xl">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all shadow-lg transform group-hover:scale-95">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random`
                        }
                        className="w-full h-full object-cover"
                        alt="User"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="hidden xl:block">
                      <p className="text-xs font-black text-white group-hover:text-primary transition-colors uppercase tracking-widest">{user?.name || "Người dùng"}</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80">{user?.vipStatus || "STANDARD"}</p>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <Link
                    to="/login"
                    className="text-sm font-black text-white uppercase tracking-widest hover:text-primary transition-colors px-4 py-2"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-full shadow-[0_10px_20px_rgba(229,9,20,0.3)] hover:scale-105 active:scale-95 transition-all"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/10 z-40 md:hidden flex flex-col p-6 gap-6 shadow-2xl"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-white hover:text-primary transition-colors uppercase tracking-widest border-b border-white/5 pb-4">Trang chủ</Link>
            <Link to="/filter" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-white hover:text-primary transition-colors uppercase tracking-widest border-b border-white/5 pb-4">Lọc Phim</Link>
            <Link to="/vip" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-white hover:text-primary transition-colors uppercase tracking-widest border-b border-white/5 pb-4">Gói VIP</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;