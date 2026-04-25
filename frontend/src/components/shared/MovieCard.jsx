import React from 'react';
import { Star, Gem } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, variant = 'vertical' }) => {
  const isVip = movie.required_vip_level > 0 || movie.tag === 'VIP';

  if (variant === 'horizontal') {
    return (
      <Link to={`/movie/${movie.id}`}>
        <div className="flex-none w-72 md:w-[450px] snap-start group cursor-pointer relative">
          {isVip && (
            <div className="absolute top-4 left-4 z-20 bg-yellow-500 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
              <Gem className="w-3 h-3" /> VIP
            </div>
          )}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5 bg-surface-container-low shadow-2xl">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
            
            {movie.isNew && (
              <div className={`absolute ${isVip ? 'top-12' : 'top-4'} left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg shadow-primary/20`}>
                Mới nhất
              </div>
            )}
            
            {movie.quality && (
              <div className="absolute top-4 right-4 glass px-2 py-1 rounded text-[10px] font-black text-white">
                {movie.quality}
              </div>
            )}
          </div>
          <div className="px-1">
            <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
              {movie.title}
            </h3>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">{movie.tag}</p>
          </div>
          </motion.div>
        </div>
      </Link>
    );
  }

  return (
  <Link to={`/movie/${movie.id}`}>
    <div className={`group cursor-pointer flex-none ${variant === 'compact' ? 'w-32 md:w-44' : 'w-48 md:w-64'} snap-start relative`}>
      {isVip && (
        <div className={`absolute ${variant === 'compact' ? 'top-2 left-2' : 'top-3 left-3'} z-20 px-2 py-1 rounded bg-yellow-500/90 text-[10px] font-black text-white backdrop-blur-md flex items-center gap-1 pointer-events-none`}>
          <Gem className={`${variant === 'compact' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
          VIP
        </div>
      )}
      <motion.div 
        whileHover={{ y: -12, scale: 1.05 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
      <div className={`relative aspect-[2/3] rounded-2xl overflow-hidden ${variant === 'compact' ? 'mb-2' : 'mb-4'} border border-white/5 bg-surface-container-low shadow-xl transition-shadow group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}>
        
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <div className={`w-full ${variant === 'compact' ? 'py-1.5' : 'py-2.5'} bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center`}>
            Chi tiết
          </div>
        </div>

        {movie.quality && (
          <div className={`absolute ${variant === 'compact' ? 'top-2 right-2' : 'top-3 right-3'} px-2 py-1 rounded bg-black/40 text-[10px] font-black text-white backdrop-blur-md`}>
            {movie.quality}
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className={`font-bold text-on-surface group-hover:text-primary ${variant === 'compact' ? 'text-xs md:text-sm' : 'text-base md:text-lg'} line-clamp-1`}>
          {movie.title}
        </h3>
        <div className={`flex items-center gap-2 ${variant === 'compact' ? 'mt-0.5' : 'mt-1.5'} opacity-60`}>
          <span className="text-[10px] md:text-xs font-bold text-on-surface-variant">{movie.year}</span>
        </div>
      </div>
      </motion.div>
    </div>

  </Link>
);
};

export default MovieCard;
