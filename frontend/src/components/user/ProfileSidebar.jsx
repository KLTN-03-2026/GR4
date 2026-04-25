import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Heart,
  History,
  Bell,
  Crown,
  Monitor,
  Shield,
  Settings,
  Edit2,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';

const ProfileSidebar = ({ onEditProfile }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/profile', icon: User, label: 'Thông tin tài khoản', color: 'text-blue-400' },
    { path: '/profile/favorites', icon: Heart, label: 'Phim yêu thích', color: 'text-red-400' },
    { path: '/profile/notifications', icon: Bell, label: 'Thông báo', color: 'text-amber-400' },
    { path: '/profile/billing', icon: Crown, label: 'Gói VIP', color: 'text-yellow-400' },
    { path: '/profile/security', icon: Shield, label: 'Bảo mật', color: 'text-cyan-400' },
    { path: '/profile/history', icon: History, label: 'Lịch sử xem', color: 'text-emerald-400' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-80 glass-dark border-r border-white/5 z-40 lg:flex hidden flex-col pt-32 pb-10 px-6">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 blur-[100px] -z-10"></div>

      {/* User info section */}
      <div className="mb-12 px-2">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary to-primary-container shadow-2xl">
              <img
                alt={user?.name || "User"}
                className="w-24 h-24 rounded-full object-cover border-4 border-surface"
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random`
                }
                referrerPolicy="no-referrer"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onEditProfile}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-2xl flex items-center justify-center border-4 border-surface shadow-xl hover:bg-primary-container transition-colors"
                title="Chỉnh sửa ảnh đại diện"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white italic tracking-tight">{user?.name || "User"}</h3>
            <div className="flex items-center justify-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${user?.is_vip ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-primary/10 border-primary/20'}`}>
                <Crown className={`w-3 h-3 ${user?.is_vip ? 'text-yellow-400' : 'text-primary'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${user?.is_vip ? 'text-yellow-400' : 'text-primary'}`}>
                  {user?.is_vip ? 'VIP MEMBER' : 'STANDARD'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
        <p className="px-4 mb-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em]">Hệ thống tài khoản</p>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${isActive
                  ? 'bg-primary text-white shadow-xl shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container -z-10"
                />
              )}

              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : item.color}`} />
                <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              </div>

              {isActive ? (
                <Sparkles className="w-4 h-4 text-white/50" />
              ) : (
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout section */}
      <div className="mt-8 pt-8 border-t border-white/5 px-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;