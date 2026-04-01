import React, { useEffect, useState, useRef } from 'react';
import {
  MessageSquare,
  Star,
  Heart,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { useMovieDetail } from '../hooks/useMovieDetail';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import { useRating } from '../hooks/useRating';
import CommentSection from '../components/shared/CommentSection';
import CommentForm from '../components/shared/CommentForm';
import StarRating from '../components/shared/StarRating';
import { canWatchMovie } from '../utils/vip';
import { obfuscate } from '../utils/obfuscate';
import PlyrPlayer from '../components/PlyrPlayer';


const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { movie, recommendations, isLoading, error: movieError } = useMovieDetail(id);
  const {
    comments,
    newComment,
    setNewComment,
    addComment,
    loading: commentLoading,
    error: commentError,
  } = useComments(id);
  const {
    userRating,
    averageRating,
    ratingCount,
    loading: ratingLoading,
    error: ratingError,
    updateRating,
  } = useRating(id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const canWatch = canWatchMovie(user, movie);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-10">
        <h2 className="text-4xl font-black uppercase tracking-widest text-white/90 mb-6">Không tìm thấy phim</h2>
        <p className="text-white/40 max-w-md mb-10 leading-relaxed italic">{movieError || 'Phim này không tồn tại hoặc đã bị gỡ bỏ.'}</p>
        <Link to="/" className="px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-primary/20">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const movieRecommendations = recommendations && recommendations.length > 0
    ? recommendations
    : [];

  return (
    <div className="min-h-screen bg-surface text-white pt-24 pb-32">
      {/* Immersive Theater Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-12 relative z-20">

            {/* Premium Video Player Container */}
            <section
              className="relative z-40 aspect-video rounded-[3rem] overflow-hidden bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 group"
              onMouseMove={canWatch ? handleMouseMove : undefined}
              onMouseLeave={() => canWatch && isPlaying && setShowControls(false)}
            >
              {/* Video Player - Plyr with HLS Support */}
              {!canWatch ? (
                <div className="absolute inset-0 z-0 group/vip">
                  <img
                    src={movie.image}
                    className="w-full h-full object-cover brightness-[0.2] scale-110 blur-sm transition-all duration-1000 group-hover/vip:scale-100 group-hover/vip:blur-0"
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-8 p-8 text-center max-w-2xl mx-auto">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-yellow-600 to-yellow-400 shadow-[0_0_60px_rgba(202,138,4,0.3)] flex items-center justify-center mb-2 rotate-12"
                    >
                      <Star className="w-12 h-12 text-black fill-black" />
                    </motion.div>
                    <div className="space-y-4">
                      <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-[0.1em] text-white leading-tight">
                        Trải nghiệm <span className="text-yellow-500">Đẳng Cấp VIP</span>
                      </h2>
                      <p className="text-sm lg:text-base font-medium text-white/60 leading-relaxed">
                        Phim <strong>{movie.title}</strong> dành riêng cho thành viên VIP. Nâng cấp ngay để tận hưởng chất lượng 4K, không quảng cáo và âm thanh vòm Dolby Atmos.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <Link to="/vip" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95">
                        Nâng cấp VIP ngay
                      </Link>
                      <Link to="/" className="inline-flex items-center justify-center gap-3 bg-white/5 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 active:scale-95">
                        Về trang chủ
                      </Link>
                    </div>
                  </div>
                </div>
              ) : movie.movie_url ? (
                <PlyrPlayer 
                  url={obfuscate(movie.movie_url)} 
                  poster={movie.image} 
                  title={movie.title}
                  onPlayStateChange={setIsPlaying}
                />
              ) : (
                // Fallback if no movie URL
                <div className="absolute inset-0 z-0">
                  <img
                    src={movie.image}
                    className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'brightness-[0.8] scale-100' : 'brightness-[0.4] scale-105'}`}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-6"
                  >
                    <div className="text-center p-10 glass-dark rounded-[3rem]">
                      <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white/90">Video không khả dụng</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-4">Vui lòng thử lại sau hoặc đổi máy chủ</p>
                    </div>
                  </motion.div>
                </div>
              )}
            </section>

            {/* Content Info & Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 px-4">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-glow italic leading-none">{movie.title}</h1>
                <p className="text-white/60 font-medium max-w-3xl leading-relaxed italic border-l-2 border-primary/30 pl-6">
                  {movie.description || "Trải nghiệm hành trình điện ảnh đỉnh cao với chất lượng hình ảnh và âm thanh sống động chưa từng có. Một siêu phẩm không thể bỏ lỡ trong mùa hè này."}
                </p>
              </div>

              <div className="flex gap-4 shrink-0">
                <button 
                  onClick={() => {
                    const shareData = {
                      title: movie.title,
                      text: movie.description,
                      url: window.location.href,
                    };
                    if (navigator.share) {
                      navigator.share(shareData);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Đã sao chép liên kết phim!');
                    }
                  }}
                  className="w-14 h-14 rounded-2xl glass-dark border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all group"
                >
                  <Share2 className="w-6 h-6 group-hover:text-primary transition-all scale-95 group-active:scale-125" />
                </button>
                <button className="w-14 h-14 rounded-2xl glass-dark border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all group">
                  <Heart className="w-6 h-6 group-hover:fill-primary group-hover:text-primary transition-all scale-95 group-active:scale-125" />
                </button>
              </div>
            </div>

            {/* Advanced Section: Comments */}
            <div className="px-4 space-y-12 pb-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-10 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                      <MessageSquare className="w-7 h-7 text-primary" />
                      Bình luận & Đánh giá
                      <span className="text-primary font-manrope text-2xl">{comments.length}</span>
                    </h3>
                  </div>
                </div>
              </div>

              {user ? (
                <CommentForm
                  value={newComment}
                  setValue={setNewComment}
                  onSubmit={addComment}
                  loading={commentLoading}
                />
              ) : (
                <Link to="/login" className="flex items-center gap-6 p-8 glass-dark rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-surface-container flex items-center justify-center border border-white/10 shrink-0">
                    <MessageSquare className="w-7 h-7 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-base font-black text-white uppercase tracking-wide">Đăng nhập để bình luận & đánh giá</p>
                    <p className="text-xs text-on-surface-variant/60 font-medium mt-1">Chia sẻ cảm nhận của bạn về bộ phim này cùng cộng đồng Cinema+</p>
                  </div>
                </Link>
              )}

              {commentError && (
                <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                  {commentError}
                </div>
              )}

              {ratingError && (
                <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                  {ratingError}
                </div>
              )}

              <div className="glass p-6 rounded-3xl border border-white/10 mb-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-primary font-black mb-2">Đánh giá của bạn</p>
                    <p className="text-xs text-on-surface-variant">Chọn số sao để đánh giá phim này</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StarRating value={userRating || 0} editable onChange={async (value) => {
                      if (!user) {
                        navigate('/login');
                        return;
                      }
                      await updateRating(value);
                    }} />
                    <span className="text-sm font-black text-white">
                      {userRating ? `Bạn đã đánh giá ${userRating} sao` : 'Chưa đánh giá'}
                    </span>
                  </div>
                </div>
              </div>

              <CommentSection
                comments={comments}
                averageRating={averageRating ?? movie.average_rating ?? movie.rating ?? 0}
                ratingCount={ratingCount}
              />


            </div>
          </div>

          {/* Sidebar Area: Up Next */}
          <aside className="xl:col-span-3 space-y-10 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]"></div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Khám phá thêm</h2>
              </div>
            </div>

            <div className="space-y-4 max-h-[1800px] overflow-y-auto pr-3 hide-scrollbar custom-scrollbar">
              {movieRecommendations.map((rec, i) => (
                <Link
                  key={rec.id}
                  to={`/watch/${rec.id}`}
                  className={`group flex gap-4 p-3 rounded-[1.75rem] border border-transparent transition-all duration-500 relative overflow-hidden hover:bg-white/5 hover:border-white/5 ${String(rec.id) === id ? 'bg-white/10 border-white/10 ring-1 ring-primary/30' : ''}`}
                >
                  <div className="w-32 aspect-[3/4] sm:aspect-video xl:aspect-square shrink-0 rounded-2xl overflow-hidden relative border border-white/5 shadow-xl group-hover:shadow-primary/20">
                    <img src={rec.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={rec.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-[8px] font-black text-white uppercase">{rec.tag || 'HD'}</div>
                  </div>
                  <div className="flex flex-col justify-center flex-1 py-1 min-w-0">
                    <h4 className="font-black text-xs text-white group-hover:text-primary transition-colors line-clamp-2 tracking-wide uppercase leading-[1.4]">{rec.title}</h4>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-lg">
                        <Star className="w-2.5 h-2.5 text-primary fill-primary" />
                        <span className="text-[9px] font-black text-white/80">{rec.rating ?? '0'}</span>
                      </div>
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{rec.year}</span>
                    </div>
                  </div>
                  {String(rec.id) === id && (
                    <div className="absolute top-4 right-4 animate-pulse">
                      <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,1)]"></div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Watch;