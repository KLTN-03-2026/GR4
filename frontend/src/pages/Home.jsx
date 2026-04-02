import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronRight, PlayCircle, Star, Clock, Trophy, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { GENRES } from '../constants';
import MovieCard from '../components/shared/MovieCard';
import GenreCard from '../components/shared/GenreCard';
import { usePublicMovies } from '../hooks/usePublicMovies';

const Home = () => {
  const { movies: dbMovies } = usePublicMovies();
  const [activeBackground, setActiveBackground] = useState(0);
  const [showAll, setShowAll] = useState(false);


  // Transform backend data to frontend format
  const transformMovie = (movie) => ({
    id: movie.id,
    title: movie.title,
    description: movie.description,
    image: movie.avatar_url || movie.background_url || movie.hero || movie.hero_url,
    background: movie.background_url || movie.hero || movie.hero_url || movie.avatar_url,
    rating: parseFloat(movie.rating) || 0,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
    genre: movie.genres ? movie.genres.split(',')[0].trim() : 'Phim',
    required_vip_level: movie.required_vip_level,
    tag: movie.required_vip_level > 0 ? 'VIP' : 'Miễn phí',
  });

  const movies = dbMovies && dbMovies.length > 0 
    ? dbMovies.map(transformMovie) 
    : [];

  const featuredMovies = movies.length > 0 ? movies : [];
  const newUpdates = movies.length > 0 ? [...movies].reverse() : [];
  const trendingMovies = movies.length > 0 ? movies : [];

  // Auto-slide background carousel
  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setActiveBackground((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies]);

  const backgroundMovie = movies.length > 0 ? movies[activeBackground] : {
    id: 1,
    title: 'Cinema',
    description: 'Hãy khám phá kho phim',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000',
    rating: 0,
    year: 2024,
    genre: 'PHIM',
  };

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* Immersive Background Section */}
      <section className="relative h-[95vh] w-full flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBackground}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={backgroundMovie.background || backgroundMovie.image}
              alt={backgroundMovie.title}
              className="w-full h-full object-cover scale-105 brightness-[0.4]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-surface to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface/40"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 px-8 md:px-20 max-w-[1920px] mx-auto w-full pt-20">
          <div className="max-w-4xl space-y-8">
            <motion.div
              key={`meta-${activeBackground}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-lg shadow-lg shadow-primary/20">
                #1 Phổ biến tuần này
              </span>
              {/* <div className="flex items-center gap-2 glass px-3 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                <span className="text-sm font-black text-white">{backgroundMovie.rating ?? '0.0'}</span>
              </div> */}
              <span className="text-on-surface-variant text-xs font-black uppercase tracking-[0.2em] opacity-60">
                {backgroundMovie.year} • {backgroundMovie.genre || 'HÀNH ĐỘNG'}
              </span>
            </motion.div>

            <motion.h1
              key={`title-${activeBackground}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-7xl md:text-9xl font-black font-manrope tracking-tighter leading-[0.85] text-white uppercase text-glow"
            >
              {backgroundMovie.title}
            </motion.h1>

            <motion.p
              key={`desc-${activeBackground}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-on-surface-variant/80 text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
            >
              {backgroundMovie.description || "Một hành trình xuyên không gian đầy kịch tính, khám phá những bí ẩn chưa từng được tiết lộ của vũ trụ. Trải nghiệm kịch tính đến nghẹt thở với dàn diễn viên huyền thoại."}
            </motion.p>

            <motion.div
              key={`btns-${activeBackground}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-5 pt-4"
            >
              <Link to={`/watch/${backgroundMovie.id}`} className="btn-primary px-12 py-5 text-base uppercase tracking-widest shadow-[0_20px_40px_rgba(229,9,20,0.3)]">
                <Play className="w-6 h-6 fill-white" />
                Xem ngay
              </Link>
              <Link to={`/movie/${backgroundMovie.id}`} className="btn-secondary px-10 py-5 text-base uppercase tracking-widest bg-white/5 hover:bg-white/10">
                <Info className="w-6 h-6" />
                Chi tiết
              </Link>
            </motion.div>

            {/* Carousel Indicators */}
            <div className="flex gap-3 pt-12">
              {movies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBackground(i)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${i === activeBackground ? 'w-12 bg-primary' : 'w-6 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 -mt-24 space-y-32 pb-40">
        <AnimatePresence mode="wait">
          {!showAll ? (
            <motion.div
              key="sections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-32"
            >
              <div className="flex gap-1">
              </div>
              {[
                { title: "Phim Nổi Bật", data: featuredMovies, variant: "default" },
                { title: "Mới Cập Nhật", data: newUpdates, variant: "horizontal" },
              ].map((section, idx) => (
                <section key={idx} className="pl-8 md:pl-20">
                  <div className="flex justify-between items-end mb-12 pr-8 md:pr-20">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">{section.title}</h2>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setShowAll(true);
                        window.scrollTo({ top: 600, behavior: 'smooth' });
                      }}
                      className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors flex items-center gap-2"
                    >
                      Xem tất cả <ChevronRight className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                  <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-10 snap-x">
                    {section.data.map(movie => (
                      <MovieCard key={movie.id} movie={movie} variant={section.variant} />
                    ))}
                  </div>
                </section>
              ))}

              {/* Genres Grid */}
              <section className="px-8 md:px-20">
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">Khám Phá Thể Loại</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {GENRES.map(genre => (
                    <GenreCard key={genre.id} genre={genre} />
                  ))}
                </div>
              </section>

              {/* Top 10 Redesign */}
              <section className="pl-8 md:pl-20">
                <div className="flex items-center gap-5 mb-16">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none">Top 10 Phim Hot Trong Tuần</h2>
                </div>
                <div className="flex gap-20 overflow-x-auto hide-scrollbar pb-12 snap-x px-4">
                  {trendingMovies.slice(0, 10).map((movie, index) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`} className="shrink-0 flex items-end group cursor-pointer snap-start relative">
                      <span className="text-[240px] font-black font-manrope leading-[0.7] text-transparent stroke-white/20 -mr-16 z-0 transition-all duration-700 group-hover:text-white/5 group-hover:stroke-primary/40 pointer-events-none italic" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.08)' }}>
                        {index + 1}
                      </span>
                      <div className="w-56 h-80 rounded-4xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-white/5 relative z-10 group-hover:-translate-y-6 transition-all duration-700 ease-out group-hover:shadow-primary/20">
                        <img src={movie.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={movie.title} referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                          <div className="flex items-center gap-2 mb-2">
                            {movie.required_vip_level > 0 ? <Gem className="w-3.5 h-3.5 text-yellow-500" /> : <Clock className="w-3.5 h-3.5 text-primary" />}
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{movie.tag}</span>
                          </div>
                          <h4 className="text-white font-black text-base uppercase leading-tight tracking-tight line-clamp-2">{movie.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="all-movies"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-8 md:px-20 space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-12">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowAll(false)}
                    className="p-3 bg-white/5 hover:bg-primary hover:text-white rounded-2xl transition-all group"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <div className="space-y-1">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight">Tất Cả Phim</h2>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-60">Khám phá {movies.length} bộ phim trong thư viện</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-12 gap-x-6 justify-items-center">
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} variant="compact" />
                ))}
              </div>

              <div className="flex justify-center pt-20">
                <button 
                  onClick={() => {
                    setShowAll(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-secondary px-12 py-4 bg-white/5 hover:bg-white/10 uppercase tracking-widest text-xs"
                >
                  Quay lại trang chủ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* VIP Section Call-to-action */}
        <section className="px-8 md:px-20 pb-20">
          <motion.div
            whileHover={{ y: -10 }}
            className="w-full relative h-[500px] rounded-[4rem] overflow-hidden group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000"
              className="w-full h-full object-cover brightness-[0.3] group-hover:scale-105 transition-transform duration-[3s]"
              alt="VIP"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent mix-blend-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
              <div className="px-5 py-2 glass-dark border border-primary/30 rounded-2xl">
                <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Phân hạng đặc quyền</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">
                Nâng cấp <br /> <span className="text-glow text-primary">Gói VIP</span>
              </h2>
              <p className="text-xl text-white/60 font-medium max-w-xl">
                Trải nghiệm không giới hạn kho phim khổng lồ với chất lượng 4K chuẩn rạp phim ngay tại nhà của bạn.
              </p>
              <Link to="/vip" className="btn-primary py-5 px-16 text-lg tracking-[0.2em] uppercase shadow-[0_32px_64px_rgba(229,9,20,0.4)]">
                Bắt đầu ngay
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Home;
