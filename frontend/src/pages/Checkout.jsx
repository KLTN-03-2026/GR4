import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Wallet,
  Smartphone,
  Check,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { upgradeVip } from '../service/vip_service';
import { useAuth } from '../hooks/useAuth';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { refreshProfile } = useAuth();

  const plan = location.state?.plan;

  // Fallback if accessed directly without selecting a plan
  if (!plan) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-white relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full"></div>
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center justify-center p-12 glass-dark rounded-[3rem] border border-white/5 text-center shadow-2xl">
            <AlertCircle className="w-16 h-16 text-yellow-500 mb-6" />
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">Chưa chọn Gói dịch vụ</h1>
            <p className="text-on-surface-variant text-sm font-medium mb-10 max-w-sm leading-relaxed">Vui lòng quay lại danh sách các gói VIP để lựa chọn một gói phù hợp với nhu cầu giải trí của bạn.</p>
            <button onClick={() => navigate('/vip')} className="btn-primary px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
              <ArrowLeft className="w-4 h-4" /> Quay lại Gói VIP
            </button>
         </motion.div>
      </div>
    );
  }

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    try {
      await upgradeVip();
      await refreshProfile();
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Lỗi nâng cấp VIP:', err);
      // Removed noisy raw alert, handle via smooth toast later if necessary
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center">
           <div className="w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        </div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="relative z-10 flex flex-col items-center glass-dark p-16 rounded-[4rem] border border-emerald-500/30 shadow-[0_20px_60px_rgba(16,185,129,0.2)] text-center max-w-md w-full mx-4"
        >
          <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }} 
             transition={{ type: "spring", delay: 0.2 }}
             className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/50"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-glow text-white">Thanh toán hoàn tất!</h1>
          <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-10">
            Tuyệt vời! Gói <span className="text-emerald-400 font-bold">{plan.name}</span> đã được kích hoạt thành công. Hệ thống đang tự động chuyển hướng về trang chủ...
          </p>
          <div className="flex gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  // Payment Methods Map
  const methods = [
    { id: 'card', name: 'Thẻ Ghi nợ / Tín dụng', icon: <CreditCard className="w-6 h-6" /> },
    { id: 'momo', name: 'Ví MoMo', icon: <Smartphone className="w-6 h-6" /> },
    { id: 'vnpay', name: 'VNPAY', icon: <Wallet className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-surface pt-32 pb-24 px-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-14 h-14 flex items-center justify-center glass-dark rounded-[1.5rem] border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all group shadow-xl">
            <ArrowLeft className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Secure Checkout</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Thanh toán an toàn</h1>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Payment Form */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-white/20 block"></span> Phương thức thanh toán
               </h2>
               <div className="grid sm:grid-cols-3 gap-4">
                 {methods.map((method) => (
                   <button
                     key={method.id}
                     onClick={() => setPaymentMethod(method.id)}
                     className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-300 ${
                       paymentMethod === method.id 
                         ? 'border-primary bg-primary/10 shadow-[0_10px_30px_rgba(229,9,20,0.15)] scale-[1.02]' 
                         : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                     }`}
                   >
                     <div className={`mb-3 ${paymentMethod === method.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                       {method.icon}
                     </div>
                     <span className={`text-[11px] font-black uppercase tracking-wide text-center leading-tight ${paymentMethod === method.id ? 'text-white' : 'text-on-surface-variant'}`}>
                       {method.name}
                     </span>
                   </button>
                 ))}
               </div>
            </section>

            <AnimatePresence mode="wait">
              <motion.section 
                 key={paymentMethod}
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -15 }}
                 transition={{ duration: 0.3 }}
                 className="glass-dark rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors pointer-events-none"></div>

                {paymentMethod === 'card' && (
                  <form onSubmit={handlePayment} className="space-y-6 relative z-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2">Tên in trên thẻ</label>
                      <input placeholder="VD: NGUYEN VAN A" required className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none uppercase shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2">Số thẻ định danh</label>
                      <div className="relative">
                        <input placeholder="0000 0000 0000 0000" type="text" maxLength={19} required className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 pl-14 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-inner" />
                        <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2">Hết hạn (MM/YY)</label>
                        <input placeholder="MM/YY" maxLength={5} required className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-inner text-center" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2">Mã CVC/CVV</label>
                        <div className="relative">
                           <input placeholder="123" required type="password" maxLength={4} className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-inner text-center" />
                           <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <button disabled={isProcessing} className="btn-primary w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex justify-center items-center gap-3 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(229,9,20,0.3)] group-hover:shadow-[0_20px_40px_rgba(229,9,20,0.4)]">
                        {isProcessing ? (
                          <>Đang mã hóa & xử lý giao dịch...</>
                        ) : (
                          <>Thanh toán {plan.price} <ChevronRight className="w-4 h-4" /></>
                        )}
                      </button>
                      <p className="mt-6 text-center flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/40 font-black">
                         <ShieldCheck className="w-4 h-4" /> Thanh toán được mã hoá 256-bit an toàn
                      </p>
                    </div>
                  </form>
                )}

                {paymentMethod !== 'card' && (
                  <div className="flex flex-col items-center justify-center py-6 relative z-10">
                    <div className="w-64 h-64 bg-white p-4 rounded-[2.5rem] mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('cinema-vip-' + plan.name)}`} alt="QR Code" className="w-full h-full rounded-2xl" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter mb-2 uppercase text-white">Quét mã thanh toán</h3>
                    <p className="text-on-surface-variant/60 text-sm font-medium mb-10 w-3/4 text-center leading-relaxed">Mở ứng dụng {paymentMethod === 'momo' ? 'MoMo' : 'ngân hàng quét mã VNPAY'} của bạn để quét mã trên màn hình và hoàn tất mua vé.</p>
                    <button onClick={handlePayment} disabled={isProcessing} className="btn-primary px-12 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] w-full shadow-[0_15px_30px_rgba(229,9,20,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                      {isProcessing ? 'Đang chờ xác nhận từ đối tác...' : 'Tôi đã chuyển khoản thành công'}
                    </button>
                  </div>
                )}
              </motion.section>
            </AnimatePresence>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 relative">
             <div className="sticky top-32 glass-dark p-10 md:p-12 rounded-[3.5rem] border border-white/5 overflow-hidden group shadow-2xl">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none"></div>
                
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-10 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-primary" /> Tóm tắt Đơn hàng
                </h2>
                
                <div className="flex items-end justify-between pb-8 border-b border-white/10 mb-8">
                  <div>
                    <p className="text-on-surface-variant font-black text-[9px] uppercase tracking-[0.4em] mb-2">Gói dịch vụ chọn lọc</p>
                    <h3 className="text-4xl font-black italic text-white uppercase mt-1">{plan.name}</h3>
                  </div>
                </div>

                <ul className="space-y-6 mb-10">
                  {plan.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                         <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-white/80 flex-1 leading-snug">{feat}</span>
                    </li>
                  ))}
                  {(!plan.features || plan.features.length === 0) && (
                    <>
                      <li className="flex items-start gap-4"><div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-primary" /></div><span className="text-sm font-medium text-white/80 flex-1 leading-snug">Toàn quyền truy cập kho phim đặc quyền.</span></li>
                      <li className="flex items-start gap-4"><div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-primary" /></div><span className="text-sm font-medium text-white/80 flex-1 leading-snug">Chất lượng 4K HDR & Âm thanh vòm Atmos.</span></li>
                      <li className="flex items-start gap-4"><div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-primary" /></div><span className="text-sm font-medium text-white/80 flex-1 leading-snug">Trải nghiệm thuần khiết không quảng cáo.</span></li>
                    </>
                  )}
                </ul>

                <div className="pt-8 border-t border-white/10 flex items-end justify-between mt-auto">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Thành tiền</span>
                      <p className="text-xs font-bold text-white/50 italic">Đã bao gồm VAT</p>
                   </div>
                   <span className="text-[2.5rem] font-black italic tracking-tighter text-glow text-primary">{plan.price}</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}