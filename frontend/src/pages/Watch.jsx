import React, { useEffect, useState, useRef } from 'react';
import {
  Play,
  Pause,
  ArrowLeft,
  Volume2,
  Settings,
  Maximize,
  MessageSquare,
  Send,
  Star,
  Heart,
  Share2,
  ChevronRight,
  Monitor,
  Cpu,
  Zap,
  SkipForward
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PlyrPlayer from '../components/PlyrPlayer';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useAuth } from '../hooks/useAuth';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { movie, recommendations, isLoading } = useMovieDetail(id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeServer, setActiveServer] = useState(0);
  const [comment, setComment] = useState('');
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Initialize Plyr with HLS support
  useEffect(() => {
    if (!videoRef.current || !movie?.movie_url) {
      console.warn('Video ref or movie URL not available');
      return;
    }

    const video = videoRef.current;
    let hls = null;
    let plyr = null;

    try {
      plyr = new Plyr(video, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'settings',
          'fullscreen'
        ],
        settings: ['quality', 'speed'],
        speed: {
          selected: 1,
          options: [0.5, 0.75, 1, 1.25, 1.5, 2]
        }
      });

      console.log('VIDEO URL:', movie.movie_url);

      // ✅ FIX autoplay bị chặn
      video.muted = true;

      // ✅ HLS
      if (movie.movie_url.includes('.m3u8')) {
        if (Hls.isSupported()) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(movie.movie_url);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS loaded');

            // ✅ QUAN TRỌNG
            plyr.play().catch(() => { });
            setIsPlaying(true);
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
          });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = movie.movie_url;

          video.onloadedmetadata = () => {
            video.play().catch(() => { });
            setIsPlaying(true);
          };
        }
      }
      // ✅ MP4
      else {
        video.src = movie.movie_url;

        video.onloadedmetadata = () => {
          video.play().catch(() => { });
          setIsPlaying(true);
        };
      }

      // Sync trạng thái
      plyr.on('play', () => setIsPlaying(true));
      plyr.on('pause', () => setIsPlaying(false));

    } catch (error) {
      console.error('Player error:', error);
    }

    return () => {
      if (hls) hls.destroy();
      if (plyr) plyr.destroy();
    };
  }, [movie?.movie_url]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };



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
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              {/* Video Player - Plyr with HLS Support */}
              {movie.movie_url ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain bg-black plyr-player"
                    controls
                    crossOrigin="anonymous"
                    poster={movie.image}
                  />

                  {/* Fallback Play Overlay - Only shown if video hasn't started yet */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-6 bg-black/40 pointer-events-none"
                      >
                        <div className="text-center">
                          <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white/90">{movie.title}</h2>
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-2">Đã sẵn sàng khởi chiếu</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
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
                    <div className="text-center">
                      <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white/90">Video không khả dụng</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-2">Vui lòng thử lại sau</p>
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
                <button className="w-14 h-14 rounded-2xl glass-dark border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all group">
                  <Heart className="w-6 h-6 group-hover:fill-primary group-hover:text-primary transition-all scale-95 group-active:scale-125" />
                </button>
                {/* <Link to="/vip" className="btn-primary py-4 px-10 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                   Gói VIP
                </Link> */}
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
                      Bình luận
                    </h3>
                  </div>
                </div>
              </div>

              {user ? (
                <div className="flex gap-8">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-surface overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                    <img src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random`
                    } className="w-full h-full object-cover" alt="User" />
                  </div>
                  <div className="flex-grow space-y-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/5 rounded-[2rem] p-8 text-sm focus:ring-2 focus:ring-primary/20 min-h-[160px] resize-none outline-none placeholder:text-white/10 transition-all font-medium text-white shadow-inner"
                      placeholder="Cùng thảo luận về siêu phẩm này..."
                    ></textarea>
                    <div className="flex justify-end gap-6 items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Tuân thủ quy tắc cộng đồng CINEMA+</span>
                      <button className="btn-primary py-4 px-12 text-xs uppercase tracking-[0.3em] font-black group">
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Gửi bình luận
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-6 p-8 glass-dark rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-surface-container flex items-center justify-center border border-white/10 shrink-0">
                    <MessageSquare className="w-7 h-7 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-base font-black text-white uppercase tracking-wide">Đăng nhập để bình luận</p>
                    <p className="text-xs text-on-surface-variant/60 font-medium mt-1">Chia sẻ cảm nhận của bạn về bộ phim này cùng cộng đồng Cinema+</p>
                  </div>
                </Link>
              )}
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
