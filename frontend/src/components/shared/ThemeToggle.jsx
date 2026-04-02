import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl glass border border-white/5 hover:bg-white/10 transition-all group flex items-center justify-center relative overflow-hidden"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
          ) : (
            <Sun className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-container transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
