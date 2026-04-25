import React from 'react';
import { Edit2, Shield, Smartphone, Star, History as HistoryIcon, CheckCircle2, ChevronRight, Zap, Trophy, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { isVipActive } from '../../utils/vip';


const ProfileOverview = ({ user, setIsEditing }) => {
  return (
    <div className="space-y-12 pb-20">
      <header className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Account Dashboard</p>
          <h1 className="text-6xl font-black text-white tracking-tighter italic leading-tight uppercase">
            Chào trở lại, <span className="text-glow text-primary">{(user?.name || "").split(" ")}.</span>
          </h1>
        </motion.div>

        {/* Decorative line */}
        <div className="absolute -bottom-6 left-0 w-24 h-1 bg-primary rounded-full"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
        {/* Profile Card & Stats */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-dark rounded-[3.5rem] p-10 md:p-14 relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors duration-700"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random`
                  }
                  className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white/5 relative z-10"
                  alt="Profile"
                  referrerPolicy="no-referrer"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="absolute -bottom-3 -right-3 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-[0_12px_24px_rgba(229,9,20,0.4)] border-4 border-surface z-20 hover:bg-primary-container transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40 font-black">Họ và tên</label>
                    <p className="text-2xl font-black text-white italic">{user?.name || "User"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40 font-black">Địa chỉ Email</label>
                    <p className="text-2xl font-black text-white italic truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity */}
            <motion.div
              whileHover={{ y: -5 }}
              className="glass-dark rounded-[2.5rem] p-8 border border-white/5 group hover:border-primary/20 transition-all shadow-xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-blue-500/10 rounded-[1.25rem] flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Shield className="w-7 h-7 text-blue-400" />
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">An toàn</span>
                </div>
              </div>
              <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tight">Cấu hình Bảo mật</h4>
              <p className="text-on-surface-variant/60 text-xs font-medium leading-relaxed mb-6">Tài khoản của bạn đã được kích hoạt lớp bảo mật. Đảm bảo mọi trải nghiệm đều riêng tư và an toàn.</p>
              <Link to="/profile/security" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors group/link">
                Nâng cấp bảo mật <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
        </div>

        {/* VIP Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl shadow-primary/30 min-h-[400px] flex flex-col justify-between"
          >
            {/* Background Layer */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isVipActive(user) ? 'from-yellow-600 via-yellow-700 to-black' : 'from-primary via-primary-container to-black'} -z-10`}></div>

            <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-1/4 -translate-y-1/4">
              <Star className="w-64 h-64 fill-white animate-spin-slow" />
            </div>

            <div className="relative z-10">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/10">
                Premium Status
              </div>
              <h3 className={`text-5xl font-black italic tracking-tighter mb-2 uppercase leading-none ${isVipActive(user) ? 'text-yellow-400' : 'text-white'}`}>
                {isVipActive(user) ? 'VIP MEMBER' : 'STANDARD'}
              </h3>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                {isVipActive(user) && user?.vip_expired_at 
                  ? `Hiệu lực đến ${new Date(user.vip_expired_at).toLocaleDateString('vi-VN')}` 
                  : 'Tài khoản miễn phí'
                }
              </p>


              <ul className="space-y-4 mb-10">
                <li className={`flex items-center gap-3 text-xs font-black uppercase tracking-widest ${isVipActive(user) ? 'text-white' : 'text-white/40'}`}>
                  <div className={`w-6 h-6 rounded-lg ${isVipActive(user) ? 'bg-yellow-500/20' : 'bg-white/10'} flex items-center justify-center`}>
                    <CheckCircle2 className={`w-3 h-3 ${isVipActive(user) ? 'text-yellow-400' : 'text-white/40'}`} />
                  </div>

                  Kho phim VIP Độc Quyền
                </li>
                <li className={`flex items-center gap-3 text-xs font-black uppercase tracking-widest ${isVipActive(user) ? 'text-white' : 'text-white/40'}`}>
                  <div className={`w-6 h-6 rounded-lg ${isVipActive(user) ? 'bg-yellow-500/20' : 'bg-white/10'} flex items-center justify-center`}>
                    <CheckCircle2 className={`w-3 h-3 ${isVipActive(user) ? 'text-yellow-400' : 'text-white/40'}`} />
                  </div>

                  Zero Ads Experience
                </li>
                <li className={`flex items-center gap-3 text-xs font-black uppercase tracking-widest ${isVipActive(user) ? 'text-white' : 'text-white/40'}`}>
                  <div className={`w-6 h-6 rounded-lg ${isVipActive(user) ? 'bg-yellow-500/20' : 'bg-white/10'} flex items-center justify-center`}>
                    <CheckCircle2 className={`w-3 h-3 ${isVipActive(user) ? 'text-yellow-400' : 'text-white/40'}`} />
                  </div>

                  4K / Dolby Atmos
                </li>
              </ul>
            </div>

            {isVipActive(user) ? (
              <div className="relative w-full py-5 bg-green-500/20 text-green-400 border border-green-500/50 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_10px_30px_rgba(34,197,94,0.1)] flex items-center justify-center gap-3 cursor-default">
                <CheckCircle2 className="w-4 h-4" /> Kích Hoạt Thành Công
              </div>
            ) : (

              <Link to="/profile/billing" className="relative w-full py-5 bg-white text-black hover:bg-black hover:text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] group flex items-center justify-center gap-3">
                Nâng cấp trải nghiệm
                <CreditCard className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;