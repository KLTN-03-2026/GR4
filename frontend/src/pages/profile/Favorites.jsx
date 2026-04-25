import React, { useEffect, useState } from 'react';
import { Star, X, Play, Heart, Film, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getFavorites, removeFavorite as removeFavoriteAPI } from '../../service/user_service';

const Favorites = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      setFetchError(null);
      return;
    }

    if (isInitialLoad) setIsLoading(true);
    setFetchError(null);

    try {
      const response = await getFavorites();
      let data = [];
      if (Array.isArray(response)) data = response;
      else if (Array.isArray(response?.data)) data = response.data;
      else if (Array.isArray(response?.data?.data)) data = response.data.data;

      // Đảm bảo không có ID trùng lặp có thể gây lỗi key
      const uniqueData = Array.from(new Map(data.map(item => [item.id, item])).values());
      setFavorites(uniqueData);
    } catch (error) {
      console.error('Load favorites failed', error);
      if (favorites.length === 0) {
         setFavorites([]);
         setFetchError('Không thể tải danh sách yêu thích. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (!location.pathname.includes('/favorites')) return;
    fetchFavorites();
  }, [user, location.pathname]);

  useEffect(() => {
    const handleFavoritesUpdated = () => {
      if (!location.pathname.includes('/favorites')) return;
      fetchFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
  }, [location.pathname]);

  const removeFavorite = async (id) => {
    try {
      await removeFavoriteAPI(id);
      await fetchFavorites();
    } catch (error) {
      console.error('Remove favorite failed', error);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Your Collection</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Danh sách <span className="text-glow text-primary">Yêu thích.</span></h2>
        </motion.div>
        
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
              {favorites.length} Tác phẩm
           </div>
        </div>
      </header>

      <AnimatePresence mode="popLayout">
        {isLoading && isInitialLoad ? (
          <motion.div
            key="loading-spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4 text-center text-on-surface-variant">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm font-black uppercase tracking-[0.2em]">Đang tải danh sách yêu thích...</p>
            </div>
          </motion.div>
        ) : fetchError && favorites.length === 0 ? (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh] flex items-center justify-center"
          >
            <div className="max-w-md p-8 rounded-3xl bg-white/5 border border-red-500/20 text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-red-400 mb-4">{fetchError}</p>
              <button
                onClick={fetchFavorites}
                className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em]"
              >
                Thử lại
              </button>
            </div>
          </motion.div>
        ) : favorites.length > 0 ? (
          <motion.div 
            key="favorites-grid"
            layout
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {favorites.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} // Removed blur(10px) to prevent "mờ câm" issue
                whileHover={{ y: -10 }}
                className="relative group aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-white/5 bg-surface-container-low"
              >
                {movie.required_vip_level > 0 && (
                   <div className="absolute top-6 left-6 px-3 py-1 bg-yellow-500 rounded-xl flex items-center gap-1 border border-white/10 z-20 shadow-xl pointer-events-none">
                      <Gem className="w-3 h-3 text-white" />
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">VIP</span>
                   </div>
                )}

                <img
                  src={movie.avatar_url || movie.background_url || movie.img || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400'}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 brightness-105"
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                />
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                   <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    className="space-y-4"
                   >
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-white italic leading-tight uppercase tracking-tight">{movie.title}</h4>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-primary fill-primary" />
                              <span className="text-[10px] font-black text-white">{movie.rating || '—'}</span>
                           </div>
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{movie.release_date ? new Date(movie.release_date).getFullYear() : movie.year || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link to={`/watch/${movie.id}`} className="flex-1 bg-white text-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/btn">
                           <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Xem</span>
                        </Link>
                        <button 
                          onClick={() => removeFavorite(movie.id)}
                          className="w-12 h-12 glass-dark rounded-2xl flex items-center justify-center hover:bg-red-500 transition-colors group/remove"
                          title="Xóa khỏi yêu thích"
                        >
                           <X className="w-5 h-5 text-white transition-transform group-hover/remove:rotate-90" />
                        </button>
                      </div>
                   </motion.div>
                </div>
                
                {/* Static indicator */}
                <div className="absolute top-6 right-6 w-10 h-10 glass-dark rounded-2xl flex items-center justify-center border border-white/10 group-hover:opacity-0 transition-opacity">
                   <Heart className="w-5 h-5 text-primary fill-primary" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center space-y-8"
          >
            <div className="w-40 h-40 glass-dark rounded-[3rem] flex items-center justify-center border border-white/5 relative">
               <Film className="w-16 h-16 text-white/10" />
               <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter text-glow">Danh sách của bạn đang trống</h3>
              <p className="text-on-surface-variant/40 text-xs font-black uppercase tracking-[0.2em] max-w-sm mx-auto">Hãy bắt đầu hành trình điện ảnh bằng cách khám phá kho phim khổng lồ của Cinema+</p>
            </div>
            <Link to="/" className="btn-primary px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
               Khám phá ngay
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;
