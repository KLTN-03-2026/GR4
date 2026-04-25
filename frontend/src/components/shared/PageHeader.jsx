import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function PageHeader({ title, description, badge, children, className }) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", className)}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-[10px] font-black uppercase tracking-widest text-primary-container mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface uppercase italic">
          {title}
        </h2>
        {description && (
          <p className="text-on-surface-variant font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex shrink-0 gap-3"
      >
        {children}
      </motion.div>
    </div>
  );
}
