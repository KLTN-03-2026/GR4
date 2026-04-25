import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const GenreCard = ({ genre }) => {
  const Icon = genre.icon;
  
  return (
    <Link to={`/filter?genre=${genre.name}`} className="block">
      <motion.div 
        whileHover={{ 
          y: -5,
          backgroundColor: "rgba(229, 9, 20, 1)",
          boxShadow: "0 20px 40px rgba(229, 9, 20, 0.3)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group glass-dark p-8 rounded-3xl cursor-pointer flex flex-col items-center gap-5 border border-white/5 transition-colors"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <Icon className="w-8 h-8 text-primary group-hover:text-white transition-all duration-300" />
        </div>
        <span className="font-black text-xs uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-white transition-colors">
          {genre.name}
        </span>
      </motion.div>
    </Link>
  );
};

export default GenreCard;
