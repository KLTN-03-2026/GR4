import { Ban, Zap, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Benefits() {
  const benefits = [
    {
      title: 'Không quảng cáo',
      description: 'Tận hưởng trọn vẹn từng khoảnh khắc cảm xúc mà không bị ngắt quãng bởi bất kỳ nội dung quảng cáo nào.',
      icon: Ban,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    {
      title: 'Chất lượng 4K',
      description: 'Hình ảnh sắc nét đến từng chi tiết với độ phân giải 4K Ultra HD kết hợp cùng công nghệ âm thanh vòm sống động.',
      icon: Zap,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'Xem phim độc quyền',
      description: 'Truy cập kho phim Original đặc sắc và các bộ phim bom tấn mới nhất chỉ dành riêng cho hội viên VIP.',
      icon: Star,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {benefits.map((benefit, index) => (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -10 }}
          className="p-10 rounded-[2.5rem] bg-neutral-900/50 backdrop-blur-3xl border border-white/5 hover:border-red-500/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
          
          <div className={`w-16 h-16 rounded-2xl ${benefit.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
            <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
          </div>
          <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter">{benefit.title}</h3>
          <p className="text-neutral-400 leading-relaxed font-medium text-sm italic">{benefit.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
