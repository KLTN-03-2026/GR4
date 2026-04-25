import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, ChevronRight, Zap, Download, Calendar, ArrowUpRight, ShieldCheck, History, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { cancelVip } from '../../service/vip_service';
import { isVipActive } from '../../utils/vip';


const Billing = () => {
  const { user, token, refreshProfile } = useAuth();
  const [vipPlan, setVipPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const processCancelVip = async () => {
    try {
      setIsCancelling(true);
      const res = await cancelVip();
      if (res.data.success) {
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
        await refreshProfile();
      }
    } catch (err) {
      console.error('Lỗi khi hủy VIP:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi hủy gói VIP.');
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    const fetchVip = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/vip');
        if (res.data.success && res.data.vip) {
          setVipPlan(res.data.vip);
        }
      } catch (err) {
        console.error('Lỗi khi tải gói VIP:', err);
      }
    };

    const fetchHistory = async () => {
      if (!token) return;
      try {
        setLoadingHistory(true);
        const res = await axios.get('http://localhost:3000/api/vip/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setHistory(res.data.history);
        }
      } catch (err) {
        console.error('Lỗi khi tải lịch sử thanh toán:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchVip();
    fetchHistory();
  }, [token]);

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Subscription & Billing</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Thanh toán & <span className="text-glow text-primary">Dịch vụ.</span></h2>
        </motion.div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Tài khoản Đã Xác Thực
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Current Plan - High Impact */}
        <div className="xl:col-span-12">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative rounded-[3.5rem] p-12 text-white overflow-hidden shadow-2xl min-h-[350px] flex flex-col md:flex-row justify-between items-center group shadow-primary/20"
          >
            {/* Background Layer with Premium Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isVipActive(user) ? 'from-purple-900 via-indigo-950 to-black' : 'from-primary via-primary-container to-black'} -z-10 transition-transform duration-700 group-hover:scale-110`}></div>

            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1)_0%,transparent_70%)] -z-10"></div>
            
            <div className="relative z-10 space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`inline-block px-5 py-2 ${isVipActive(user) ? 'bg-amber-400/20 text-amber-400 border-amber-400/30' : 'bg-white/10 text-white/80 border-white/10'} backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border`}
                >
                  {isVipActive(user) ? '⭐ Current Premium VIP' : 'Recommended Premium Plan'}

                </motion.div>
                <h3 className={`text-6xl md:text-7xl font-black italic truncate uppercase tracking-tighter leading-none ${isVipActive(user) ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-pulse-slow' : 'text-white'}`}>

                  {vipPlan ? vipPlan.title : 'Loading...'}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4K Ultra HD + Atmos
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Phim VIP Độc quyền
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 pt-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Phí dịch vụ hàng tháng</p>
                   <p className="text-3xl font-black italic">
                      {vipPlan ? `${parseInt(vipPlan.price).toLocaleString('vi-VN')}₫` : '...'} 
                      <span className="text-sm font-medium not-italic opacity-40"> / Tháng</span>
                   </p>
                </div>
                {isVipActive(user) && user?.vip_expired_at && (

                  <>
                    <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Kỳ hạn thanh toán tiếp theo</p>
                       <div className="flex items-center gap-2 text-xl font-black italic">
                          <Calendar className="w-5 h-5 text-primary" /> {new Date(user.vip_expired_at).toLocaleDateString('vi-VN')}
                       </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto mt-12 md:mt-0">
               {isVipActive(user) ? (

                 <>
                   <div className="w-full md:w-64 py-6 rounded-[1.5rem] bg-green-500/20 text-green-400 border border-green-500/50 font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 cursor-default shadow-[0_10px_30px_rgba(34,197,94,0.15)]">
                      <CheckCircle2 className="w-5 h-5" /> Kích Hoạt Thành Công
                   </div>
                   <button 
                     onClick={() => setIsConfirmModalOpen(true)}
                     className="w-full md:w-64 py-5 bg-white/5 backdrop-blur-3xl hover:bg-white/10 border border-white/5 text-white/60 hover:text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all"
                   >
                     Hủy gói VIP
                   </button>
                 </>
               ) : (
                  <Link to="/vip" className="btn-primary w-full md:w-64 py-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl hover:bg-white hover:text-black transition-all group/btn">
                     Đăng ký ngay <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Link>
                )}
             </div>
             
              <Zap className={`absolute -bottom-12 -left-12 w-64 h-64 ${isVipActive(user) ? 'text-amber-400/10' : 'text-white/5'} -rotate-12 group-hover:scale-110 transition-transform duration-1000`} />

           </motion.div>
         </div>

         {/* Payment Method Section - Hidden for VIPs */}
         {/* {!user?.is_vip && (
           <div className="xl:col-span-5 space-y-8">
             <div className="glass-dark p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -z-10"></div>
               
               <div className="flex items-center justify-between">
                 <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                   <CreditCard className="w-4 h-4 text-primary" /> Phương thức hiện tại
                 </h4>
                 <button className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors">Cập nhật</button>
               </div>

               <motion.div 
                 whileHover={{ y: -5 }}
                 className="p-8 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/10 relative overflow-hidden shadow-xl"
               >
                 <div className="absolute top-0 right-0 p-6 opacity-20">
                    <div className="w-16 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-xs">VISA</div>
                 </div>
                 
                 <div className="space-y-6">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Card Number</p>
                     <p className="text-2xl font-black text-white tracking-[0.2em] italic">•••• •••• •••• 4242</p>
                   </div>
                   
                   <div className="flex justify-between items-end">
                     <div className="space-y-1">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Expiry Date</p>
                       <p className="text-lg font-black text-white italic">12 / 28</p>
                     </div>
                     <div className="space-y-1 text-right">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Card Holder</p>
                       <p className="text-sm font-black text-white uppercase tracking-widest">NGUYEN VAN A</p>
                     </div>
                   </div>
                 </div>
               </motion.div>

               <button className="w-full py-5 border border-dashed border-white/20 hover:border-primary/40 rounded-2xl text-on-surface-variant/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/5 transition-all">
                 + Thêm phương thức mới
               </button>
             </div>
           </div>
         )} */}

         {/* Billing History Section */}
         <div className={user?.is_vip ? "xl:col-span-12 space-y-8" : "xl:col-span-7 space-y-8"}>
           <div className="glass-dark rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="p-10 pb-4 flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <History className="w-4 h-4 text-primary" /> Lịch sử giao dịch
                </h3>
                <button className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                   <Download className="w-4 h-4" />
                </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-white/5">
                     <th className="px-10 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">Hóa đơn</th>
                     <th className="px-6 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">Ngày thực hiện</th>
                     <th className="px-6 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">Số tiền</th>
                     <th className="px-10 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em] text-right">Trạng thái</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {loadingHistory ? (
                     <tr>
                       <td colSpan="4" className="px-10 py-12 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Đang tải lịch sử...</td>
                     </tr>
                   ) : history.length > 0 ? (
                     history.map((row, i) => (
                       <motion.tr 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.1 }}
                         key={row.id} 
                         className="hover:bg-white/[0.02] transition-colors group/row cursor-default"
                       >
                         <td className="px-10 py-6 font-black text-sm text-white italic tracking-widest uppercase">INV-{row.id.toString().padStart(3, '0')}</td>
                         <td className="px-6 py-6 text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">{new Date(row.start_date).toLocaleDateString('vi-VN')}</td>
                         <td className="px-6 py-6 text-sm font-black text-white italic">{parseInt(row.price_paid).toLocaleString('vi-VN')}₫</td>
                         <td className="px-10 py-6 text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Success</span>
                            </div>
                         </td>
                       </motion.tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan="4" className="px-10 py-12 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Chưa có giao dịch nào</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
             
             <div className="p-8 border-t border-white/5 flex justify-center">
                <button className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] hover:text-white transition-colors">Xem toàn bộ lịch sử</button>
             </div>
           </div>
         </div>
       </div>

       {/* Confirm Cancel VIP Modal */}
       <AnimatePresence>
         {isConfirmModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsConfirmModalOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-xl"
             />
             
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-surface-container-high glass-dark max-w-lg w-full rounded-[3.5rem] border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden relative group z-10"
             >
               <button 
                 onClick={() => setIsConfirmModalOpen(false)}
                 className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="p-12 md:p-16 flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-10 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-pulse">
                   <AlertTriangle className="w-10 h-10 text-red-500" />
                 </div>
                 
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-6">Xác nhận hủy <span className="text-red-500">gói VIP?</span></h3>
                 
                 <p className="text-sm font-bold text-on-surface-variant/70 leading-relaxed uppercase tracking-widest mb-12">
                   Bạn sẽ mất toàn bộ quyền truy cập vào các bộ phim độc quyền, chất lượng <span className="text-white">4K Ultra HD</span>, âm thanh <span className="text-white">Atmos</span> và không còn được xem phim không quảng cáo ngay lập tức.
                 </p>
                 
                 <div className="flex flex-col w-full gap-4">
                   <button
                     onClick={() => setIsConfirmModalOpen(false)}
                     className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                   >
                     Giữ lại gói VIP
                   </button>
                   <button
                     onClick={processCancelVip}
                     disabled={isCancelling}
                     className="w-full py-6 bg-transparent text-red-500/60 hover:text-red-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all disabled:opacity-30"
                   >
                     {isCancelling ? 'Đang xử lý...' : 'Xác nhận hủy dịch vụ'}
                   </button>
                 </div>
               </div>
               
               {/* Decorative glows */}
               <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-red-600/10 blur-[100px] -z-10"></div>
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] -z-10"></div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

       {/* Success Modal */}
       <AnimatePresence>
         {isSuccessModalOpen && (
           <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsSuccessModalOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-xl"
             />
             
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-surface-container-high glass-dark max-w-lg w-full rounded-[3.5rem] border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden relative group z-10"
             >
               <div className="p-12 md:p-16 flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-10 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                   <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                 </div>
                 
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-6">Hủy VIP <span className="text-emerald-500">Thành công!</span></h3>
                 
                 <p className="text-sm font-bold text-on-surface-variant/70 leading-relaxed uppercase tracking-widest mb-12">
                   Chúng tôi rất tiếc khi bạn dừng trải nghiệm VIP. Gói dịch vụ của bạn đã được chuyển về mức <span className="text-white">TIÊU CHUẨN</span>. Bạn luôn có thể nâng cấp lại bất cứ lúc nào!
                 </p>
                 
                 <button
                   onClick={() => setIsSuccessModalOpen(false)}
                   className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-emerald-500/30"
                 >
                   Xác nhận & Quay lại
                 </button>
               </div>
               
               {/* Decorative glows */}
               <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/10 blur-[100px] -z-10"></div>
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] -z-10"></div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
     </div>
   );
};

export default Billing;
