import { Check, CheckCircle2, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PricingCard({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  isFeatured, 
  badge, 
  subPrice,
  isVip,
  vipExpiry
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isVip) return; 
    navigate('/checkout', {
      state: {
        plan: {
          name: title,
          price: price,
          period: period
        }
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={cn(
        "p-10 rounded-[2.5rem] flex flex-col h-full transition-all duration-500 relative overflow-hidden group",
        isFeatured 
          ? `bg-[#1a1a1a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10` 
          : "bg-neutral-900 border border-neutral-800"
      )}
    >
      {/* Decorative Glow Background */}
      {isFeatured && !isVip && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full group-hover:bg-red-600/20 transition-all duration-700"></div>
      )}
      {isVip && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full"></div>
      )}

      {/* Floating Badge */}
      {isVip ? (
        <div className="absolute top-6 right-8 bg-green-500/20 text-green-400 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-500/30 backdrop-blur-3xl shadow-lg shadow-green-500/10">
          <CheckCircle2 className="w-3.5 h-3.5" /> Gói Đã Kích Hoạt
        </div>
      ) : badge && (
        <div className="absolute top-6 right-8 bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 animate-pulse-slow">
          {badge}
        </div>
      )}
      
      <div className="relative z-10 space-y-6">
        <div className="space-y-2">
          <h4 className={`font-black text-3xl italic uppercase tracking-tighter ${isVip ? 'text-green-400' : 'text-white'}`}>
            {title}
          </h4>
          <p className="text-neutral-400 text-xs font-medium max-w-[200px] leading-relaxed italic">{description}</p>
        </div>
        
        <div className="py-8 border-y border-white/5 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-black italic tracking-tighter ${isVip ? 'text-green-400' : 'text-white'}`}>
              {price}
            </span>
            <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">/ {period}</span>
          </div>
          {subPrice && !isVip && (
            <p className="text-red-500/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" /> {subPrice}
            </p>
          )}
          {isVip && vipExpiry && (
            <p className="text-green-500/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Star className="w-3 h-3" /> Hiệu lực đến: {new Date(vipExpiry).toLocaleDateString('vi-VN')}
            </p>
          )}
        </div>
        
        <ul className="space-y-5 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-4 group/item">
              <div className={cn(
                "mt-0.5 p-1 rounded-lg transition-colors",
                isVip ? "bg-green-500/10" : "bg-red-500/10 group-hover/item:bg-red-500/20"
              )}>
                {isVip ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-red-500" />
                )}
              </div>
              <span className="text-neutral-300 text-[13px] font-medium leading-normal">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={handleClick}
          disabled={isVip}
          className={cn(
            "w-full py-6 rounded-[1.5rem] font-black transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 relative overflow-hidden group/btn",
            isVip
              ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-not-allowed"
              : "bg-white text-black hover:bg-red-600 hover:text-white shadow-2xl shadow-white/5 hover:shadow-red-600/20"
          )}
        >
          {isVip ? (
            <>
              <CheckCircle2 className="w-5 h-5 animate-bounce-slow" /> GÓI HIỆN TẠI
            </>
          ) : (
            <>
              NÂNG CẤP NGAY <Zap className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Background Icon Decoration */}
      <Zap className={cn(
        "absolute -bottom-16 -left-16 w-48 h-48 -rotate-12 transition-all duration-1000",
        isVip ? "text-green-500/5" : "text-white/5 opacity-20 group-hover:scale-125 group-hover:text-red-500/10"
      )} />
    </motion.div>
  );
}