import React, { useEffect, useState } from 'react';
import { 
  Play, Star, ArrowLeft, Heart, MessageSquare, Send, Share2, Clock, Plus, Info, X
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useComments } from '../hooks/useComments';
import { isVipActive } from '../utils/vip';
import { useAuth } from '../hooks/useAuth';
import { getFavorites, addFavorite, removeFavorite } from '../service/user_service';
import MovieCard from '../components/shared/MovieCard';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const { movie, recommendations, isLoading } = useMovieDetail(id);
  const { comments, newComment, setNewComment, addComment } = useComments();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const isVip = isVipActive(user);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    const loadFavorites = async () => {
      try {
        const response = await getFavorites();
        const favorites = response.data || [];
        setIsFavorite(favorites.some((item) => String(item.id) === String(id)));
      } catch (error) {
        console.error('Load favorites failed', error);
      }
    };

    loadFavorites();
  }, [user, id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(id);
        setIsFavorite(true);
      }
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error('Toggle favorite failed', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* Hero Section with Parallax Background */}
      <div className="relative h-[80vh] w-full flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={movie.background || movie.image} 
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000';
            }}
            className="w-full h-full object-cover scale-110 brightness-[0.4] blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface/20"></div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="fixed top-28 left-8 z-40 p-4 rounded-2xl glass hover:bg-white/10 transition-all group shadow-2xl"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative z-10 max-w-[1920px] mx-auto w-full px-8 md:px-16 pb-12 flex flex-col md:flex-row gap-12 items-end">
          {/* Main Poster */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block w-72 lg:w-96 aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-white/5 relative group"
          >
            <img 
              src={movie.image} 
              alt={movie.title}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl"></div>
          </motion.div>

          {/* Movie Info */}
          <div className="flex-1 space-y-8 pb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20">
                  {movie.quality || '4K ULTRA HD'}
                </span>
                <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="text-sm font-black text-white tracking-tighter">{movie.rating || '8.9'}</span>
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black font-manrope tracking-tighter text-white uppercase leading-[0.9] text-glow">
                {movie.title}
              </h1>
              <div className="flex items-center gap-6 text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                <span>{movie.year}</span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                <span>{movie.genre || 'Hành động, Viễn tưởng'}</span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>2h 15m</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={`/watch/${movie.id}`} className="btn-primary px-10 py-5 text-base uppercase tracking-widest shadow-[0_20px_40px_rgba(229,9,20,0.3)] min-w-[200px]">
                <Play className="w-6 h-6 fill-white" />
                Xem ngay
              </Link>
              <button 
                onClick={() => setShowTrailerModal(true)}
                className="btn-secondary px-10 py-5 text-base uppercase tracking-widest"
              >
                <Play className="w-6 h-6" />
                Xem trailer
              </button>
              <button
                disabled={favoriteLoading}
                onClick={handleToggleFavorite}
                className={`btn-secondary px-8 py-5 flex items-center gap-3 ${isFavorite ? 'bg-red-600 text-white border-red-600' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                {favoriteLoading ? 'Đang xử lý...' : isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-[1920px] mx-auto px-8 md:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Left Column: Details & Comments */}
          <div className="lg:col-span-2 space-y-20">
            {/* Synopsis */}
            <section className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                Nội dung phim
                <div className="h-px flex-grow bg-white/5"></div>
              </h3>
              <p className="text-lg text-on-surface-variant leading-relaxed font-medium">
                {movie.description || "Một hành trình xuyên không gian đầy kịch tính quy tụ dàn diễn viên tinh hoa nhất. Khám phá những bí ẩn chưa từng được tiết lộ trong vũ trụ điện ảnh kỳ vĩ này, nơi mọi ranh giới của sự tưởng tượng bị xóa nhòa."}
              </p>
            </section>

            {/* Comments Section */}
            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4 flex-grow">
                  Bình luận
                  <span className="text-primary font-manrope">{comments.length}</span>
                  <div className="h-px flex-grow bg-white/5"></div>
                </h3>
              </div>

              {/* Comment Input */}
              {user ? (
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden border border-white/5 shadow-xl shrink-0">
                    <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"} className="w-full h-full object-cover" alt={user?.name || "User"} />
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="relative group">
                      <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về phim..."
                        className="w-full bg-surface-container-low border border-white/5 rounded-2xl p-5 text-base focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none outline-none placeholder:text-on-surface-variant/40 transition-all font-medium"
                      />
                      <div className="absolute bottom-4 right-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest pointer-events-none group-focus-within:opacity-0 transition-opacity">
                        Markdown Supported
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={addComment}
                        className="btn-primary py-3 px-8 text-xs uppercase tracking-[0.2em]"
                      >
                        <Send className="w-4 h-4" />
                        Gửi bình luận
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-4 p-6 glass-dark rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center border border-white/5">
                    <MessageSquare className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-wide">Đăng nhập để bình luận</p>
                    <p className="text-[10px] text-on-surface-variant/60 font-medium mt-1">Chia sẻ cảm nhận của bạn về bộ phim này</p>
                  </div>
                </Link>
              )}

              {/* Comments List */}
              <div className="space-y-8 pl-20 relative">
                <div className="absolute left-7 top-0 bottom-0 w-px bg-white/5"></div>
                {comments.map((c, i) => (
                  <motion.div 
                    key={c.id || i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-[53px] top-2 w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                      <img src={c.avatar} className="w-full h-full object-cover" alt={c.user} />
                    </div>
                    <div className="glass-dark p-6 rounded-3xl border border-white/5 shadow-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-sm text-white racking-tight">{c.user}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">{c.time || '2 ngày trước'}</span>
                      </div>
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                        {c.content}
                      </p>
                      <div className="flex items-center gap-6 pt-2">
                        <button className="flex items-center gap-2 group text-on-surface-variant hover:text-primary transition-colors">
                          <Heart className="w-3.5 h-3.5 group-hover:fill-primary transition-all" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{c.likes || 0}</span>
                        </button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-white transition-colors">Phản hồi</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Recommendations */}
          <div className="space-y-12">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4">
              Đề xuất
              <div className="h-px flex-grow bg-white/5"></div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-10">
              {recommendations?.map((rec) => (
                <MovieCard key={rec.id} movie={rec} variant="vertical" />
              ))}
            </div>
            
            {/* Watch with AI/Friends Invite Card */}
            <div className="glass p-8 rounded-3xl border border-primary/20 bg-primary/5 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Xem chung với bạn bè</h4>
                <p className="text-xs font-medium text-on-surface-variant leading-relaxed italic">
                  Tạo phòng xem chung và cùng thưởng thức siêu phẩm này với bạn bè của bạn ngay bây giờ.
                </p>
              </div>
              <button className="w-full py-4 bg-white text-surface rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                Tạo phòng ngay
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailerModal(false)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] border border-white/10 relative group"
            >
              {movie.trailer_url ? (
                <iframe
                  src={(() => {
                    let url = movie.trailer_url;
                    // Convert watch URL to embed URL
                    if (url.includes('watch?v=')) {
                      url = url.replace('watch?v=', 'embed/');
                    }
                    // If it's just a video ID, build the embed URL
                    else if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                      url = `https://www.youtube.com/embed/${url}`;
                    }
                    // Convert youtu.be short URL to embed
                    else if (url.includes('youtu.be/')) {
                      const videoId = url.split('youtu.be/')[1];
                      url = `https://www.youtube.com/embed/${videoId}`;
                    }
                    return url;
                  })()}
                  title="Movie Trailer"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-black to-surface flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Info className="w-16 h-16 text-primary/50 mx-auto" />
                    <p className="text-white font-black uppercase tracking-widest">Trailer không khả dụng</p>
                    <p className="text-on-surface-variant text-sm">Vui lòng thử lại sau hoặc xem ngay phim</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowTrailerModal(false)}
                className="absolute top-4 right-4 z-10 p-3 rounded-2xl bg-black/60 hover:bg-primary transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieDetail;