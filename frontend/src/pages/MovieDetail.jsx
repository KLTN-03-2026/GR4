import React, { useEffect, useState } from 'react';
import {
  Play, Star, ArrowLeft, Heart, MessageSquare, Share2, Clock, Plus, Info, X, Gem
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useComments } from '../hooks/useComments';
import { useRating } from '../hooks/useRating';
import { isVipActive } from '../utils/vip';
import { useAuth } from '../hooks/useAuth';
import { getFavorites, addFavorite, removeFavorite } from '../service/user_service';
import MovieCard from '../components/shared/MovieCard';
import CommentSection from '../components/shared/CommentSection';
import CommentForm from '../components/shared/CommentForm';
import StarRating from '../components/shared/StarRating';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const { movie, recommendations, isLoading, error: movieError } = useMovieDetail(id);
  const {
    comments,
    newComment,
    setNewComment,
    addComment,
    loading: commentLoading,
    error: commentError,
    page,
    setPage,
    pagination,
  } = useComments(id);
  const { user } = useAuth();
  const {
    userRating,
    averageRating,
    ratingCount,
    loading: ratingLoading,
    error: ratingError,
    updateRating,
  } = useRating(id);
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="max-w-xl w-full glass rounded-3xl border border-outline-variant/10 p-12 text-center">
          <h2 className="text-3xl font-black text-on-surface mb-4">Phim không tồn tại</h2>
          <p className="text-sm text-on-surface-variant mb-8">
            {movieError || 'Xin lỗi, phim bạn tìm kiếm không có trong hệ thống hoặc đã bị xóa.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-10 py-4 uppercase tracking-widest"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* Hero Section with Parallax Background */}
      <div className="relative min-h-[90vh] w-full flex items-end pt-32 md:pt-40">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={movie.background || movie.image}
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000';
            }}
            className="w-full h-full object-cover scale-110 brightness-[0.5] blur-[2px]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent"></div>
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-r from-surface via-transparent to-surface/30"></div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-28 left-8 z-40 p-3 md:p-4 rounded-2xl glass hover:bg-primary hover:text-white transition-all group shadow-2xl"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative z-10 max-w-[1920px] mx-auto w-full px-6 md:px-16 pb-16 flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-end">
          {/* Main Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-48 md:w-72 lg:w-96 aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(229,9,20,0.25)] border border-white/10 relative group shrink-0"
          >
            <img
              src={movie.image}
              alt={movie.title}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl group-hover:ring-primary/40 transition-all"></div>
          </motion.div>

          {/* Movie Info */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-6"
            >
              {movie.required_vip_level > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                >
                  <Gem className="w-4 h-4 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Nội Dung Đặc quyền VIP</span>
                </motion.div>
              )}

              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-manrope tracking-tighter text-on-surface uppercase leading-[0.85] text-glow drop-shadow-2xl">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-xs md:text-sm font-black text-on-surface-variant/90 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2 bg-surface-container/50 px-3 py-1.5 rounded-xl border border-outline-variant/10">
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container/50 px-3 py-1.5 rounded-xl border border-outline-variant/10">
                  <span>{movie.genre || 'Hành động'}</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/20 text-on-surface">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>2h 15m</span>
                </div>
                <div className="flex items-center gap-2 bg-primary px-3 py-1.5 rounded-xl shadow-lg shadow-primary/20 text-white">
                  <Star className="w-4 h-4 fill-white" />
                  <span>{(averageRating ?? movie.average_rating ?? movie.rating ?? 0).toFixed(1)}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-4"
            >
              <Link to={`/watch/${movie.id}`} className="btn-primary group px-12 py-5 text-base uppercase tracking-widest shadow-[0_20px_50px_rgba(229,9,20,0.45)] hover:shadow-primary/60 min-w-[220px]">
                <Play className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
                <span className="relative">Xem ngay</span>
              </Link>
              <button
                onClick={() => setShowTrailerModal(true)}
                className="btn-primary group px-12 py-5 text-base uppercase tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.05)] bg-surface-container border border-outline-variant/20 min-w-[200px] hover:bg-surface-container-high"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="relative text-on-surface">Xem trailer</span>
              </button>
              <button
                disabled={favoriteLoading}
                onClick={handleToggleFavorite}
                className={`btn-secondary px-8 py-5 text-base uppercase tracking-widest flex items-center gap-3 rounded-2xl transition-all shadow-xl ${isFavorite ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-surface-container border-outline-variant/10 hover:border-primary/40'}`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-white animate-bounce' : 'group-hover:text-primary'}`} />
                <span className="relative text-on-surface">{favoriteLoading ? 'Đang xử lý...' : isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-[1920px] mx-auto px-6 md:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-24">
          {/* Left Column: Details & Comments */}
          <div className="lg:col-span-3 space-y-24">
            {/* Synopsis */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-primary rounded-full"></div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-on-surface italic">Nội dung phim</h3>
              </div>
              <p className="text-xl text-on-surface-variant leading-relaxed font-medium max-w-5xl">
                {movie.description || "Một hành trình xuyên không gian đầy kịch tính quy tụ dàn diễn viên tinh hoa nhất. Khám phá những bí ẩn chưa từng được tiết lộ trong vũ trụ điện ảnh kỳ vĩ này, nơi mọi ranh giới của sự tưởng tượng bị xóa nhòa."}
              </p>
            </section>

            {/* Comments Section */}
            <section className="space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-on-surface italic">
                    Bình luận <span className="ml-2 text-primary font-manrope not-italic">{pagination?.total || 0}</span>
                  </h3>
                </div>
              </div>

              {user ? (
                <div className=" p-6 md:p-8 rounded-4xl ">
                  <CommentForm
                    user={user}
                    value={newComment}
                    setValue={setNewComment}
                    onSubmit={addComment}
                    loading={commentLoading}
                  />
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-6 p-8 glass rounded-4xl border border-outline-variant/10 hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/10 group-hover:bg-primary/20 transition-all">
                    <MessageSquare className="w-7 h-7 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-on-surface uppercase tracking-wider">Đăng nhập để bình luận</p>
                    <p className="text-sm text-on-surface-variant/60 font-medium mt-1">Chia sẻ cảm nhận của bạn về bộ phim này</p>
                  </div>
                </Link>
              )}

              {commentError && (
                <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3">
                  <Info className="w-5 h-5" />
                  {commentError}
                </div>
              )}

              <div className="">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.4em] text-primary font-black">Cảm nhận của bạn</p>
                    <p className="text-on-surface-variant font-medium">Đánh giá để giúp cộng đồng tìm được phim hay</p>
                  </div>
                  <div className="flex items-center gap-6  px-6 py-4 rounded-2xl ">
                    <StarRating value={userRating || 0} editable onChange={async (value) => {
                      if (!user) {
                        navigate('/login');
                        return;
                      }
                      await updateRating(value);
                    }} />
                    <div className="h-4 w-px "></div>
                    <span className="text-sm font-black text-on-surface  tracking-widest min-w-[120px]">
                      <p>{userRating ? `Bạn đã đánh giá ${userRating} Sao` : 'Chưa đánh giá'}</p>
                    </span>
                  </div>
                </div>
              </div>

              <CommentSection
                comments={comments}
                averageRating={averageRating ?? movie.average_rating ?? movie.rating ?? 0}
                ratingCount={ratingCount}
                page={page}
                setPage={setPage}
                pagination={pagination}
              />
            </section>
          </div>

          {/* Right Column: Sidebar Recommendations */}
          <div className="space-y-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-black uppercase tracking-tight text-on-surface italic">Đề xuất phim</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-x-4 gap-y-8 justify-items-center">
                {recommendations?.map((rec) => (
                  <MovieCard key={rec.id} movie={rec} variant="compact" />
                ))}
              </div>
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