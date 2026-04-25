import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PricingCard from '../components/user/Pricing/PricingCard.jsx';
import ComparisonTable from '../components/user/Pricing/ComparisonTable.jsx';
import Benefits from '../components/user/Pricing/Benefits.jsx';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export default function VIPSelection() {
  const { user } = useAuth();
  const [vipPlan, setVipPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVip = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/vip');
        if (res.data.success && res.data.vip) {
          setVipPlan(res.data.vip);
        }
      } catch (err) {
        console.error('Lỗi khi tải gói VIP:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVip();
  }, []);

  const plans = vipPlan ? [
    {
      title: vipPlan.title,
      description: 'Trải nghiệm linh hoạt và cao cấp nhất dành cho tín đồ điện ảnh thực thụ.',
      price: `${parseInt(vipPlan.price).toLocaleString('vi-VN')}₫`,
      period: 'tháng',
      features: [
        'Tất cả quyền lợi VIP không giới hạn', 
        'Đặc quyền xem trước phim mới nhất', 
        'Chất lượng 4K Ultra HD + Dolby Atmos'
        
      ],
      isFeatured: true,
      badge: 'Đáng mua Nhất'
    }
  ] : [];

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-32 overflow-x-hidden">
      {/* Hero Section - High Impact */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a] z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(220,38,38,0.2),transparent_70%)] z-10"></div>
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2 }}
            className="w-full h-full object-cover grayscale-[30%]" 
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2070" 
            alt="Cinema background"
          />
        </div>

        <div className="relative z-20 text-center max-w-5xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full border border-red-500/30 text-red-500 text-[10px] font-black tracking-[0.3em] uppercase mb-10 bg-red-500/5 backdrop-blur-xl">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              Cinema+ Premium 
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-10 leading-[0.95] italic uppercase">
              Định nghĩa lại <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-500 animate-gradient-x">Giải trí đỉnh cao.</span>
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium italic">
              Đắm chìm trong không gian điện ảnh không giới hạn. Xem phim bom tấn sớm nhất, chất lượng tuyệt đỉnh và hoàn toàn không quảng cáo.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
             <span className="text-[10px] font-black uppercase tracking-widest text-white">Khám phá gói cước</span>
             <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 relative z-30 -mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.4em] mb-4">Lựa chọn của bạn</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Gói VIP <span className="text-glow">Đặc quyền.</span></h3>
        </motion.div>

        <div className="max-w-xl mx-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Đang khởi tạo cấu hình...</p>
             </div>
          ) : plans.length > 0 ? (
            plans.map((plan, index) => (
              <PricingCard key={index} {...plan} isVip={user?.is_vip} vipExpiry={user?.vip_expired_at} />
            ))
          ) : (
             <div className="text-neutral-400 text-center py-20 glass-dark rounded-[2rem] border border-white/5">
                <p className="font-black uppercase text-[10px] tracking-widest">Hiện chưa có gói VIP khả dụng.</p>
             </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-6xl mx-auto px-6 py-40">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-4">Minh bạch & Rõ ràng</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Giá trị <span className="text-glow">vượt trội.</span></h3>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <ComparisonTable />
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-4">Trải nghiệm đỉnh cao</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Đặc quyền <span className="text-glow">Vô hạn.</span></h3>
        </motion.div>
        <Benefits />
      </section>
    </div>
  );
}
