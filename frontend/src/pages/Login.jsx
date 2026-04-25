import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 LOGIN
  const handleLogin = async (e) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);
  setError('');

  // ✅ validate input
  if (!email || !password) {
    setError('Vui lòng nhập đầy đủ email và mật khẩu');
    setLoading(false);
    return;
  }

  try {
    // ✅ normalize email
    const normalizedEmail = email.trim().toLowerCase();

    const res = await axios.post(
      'http://localhost:3000/api/users/login',
      {
        email: normalizedEmail,
        password,
      }
    );

    const { token, user } = res.data;

    // ✅ map BE → FE
    const mappedUser = {
      id: user.id,
      name: user.username,
      email: user.email,
      role_id: user.role_id,
      role: user.role_id === 1 ? 'admin' : 'user',
      is_vip: !!user.is_vip,
      vip_expired_at: user.vip_expired_at,
    };


    // ✅ lưu vào context và chọn storage dựa trên remember
    login(token, mappedUser, remember);

    // ✅ redirect theo role
    if (mappedUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }

  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.message ||
      'Đăng nhập thất bại. Kiểm tra backend hoặc API.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-black">
      {/* Immersive Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover"
          alt="Login Background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[500px]"
      >
        <div className="glass-dark p-10 md:p-14 rounded-[3.5rem] shadow-[0_48px_96px_rgba(0,0_0,0.8)] border border-white/5 relative overflow-hidden group">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] -z-10 group-hover:bg-primary/30 transition-colors duration-700"></div>
          
          <div className="mb-12 text-center space-y-4">
            <Link to="/"> 
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto border border-primary/20 shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </motion.div>
            </Link>

            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter text-glow italic">Cinema+</h1>
              <p className="text-on-surface-variant/60 text-[10px] font-black uppercase tracking-[0.3em]">Cổng vào thế giới điện ảnh</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-8 flex items-center gap-3 overflow-hidden"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                <span className="text-xs font-black text-primary uppercase tracking-widest">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-8" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black tracking-[0.3em] text-on-surface-variant uppercase ml-2">
                Tài khoản truy cập
              </label>
              <div className="relative group/input">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email hoặc số điện thoại"
                  className="w-full bg-surface border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-on-surface-variant/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none text-xs font-black uppercase tracking-widest shadow-2xl"
                />
                <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors w-5 h-5" />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black tracking-[0.3em] text-on-surface-variant uppercase ml-2">
                Mật mã bảo mật
              </label>
              <div className="relative group/input">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-on-surface-variant/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none text-xs font-black uppercase tracking-widest shadow-2xl"
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center space-x-3 cursor-pointer group/check">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="peer h-6 w-6 rounded-xl border-white/10 bg-surface text-primary focus:ring-0 checked:bg-primary transition-all appearance-none border shadow-2xl"
                  />
                  <Check className="absolute opacity-0 peer-checked:opacity-100 text-white w-3 h-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                </div>
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest group-hover/check:text-white transition-colors">Ghi nhớ</span>
              </label>
              <Link to="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xs uppercase tracking-[0.3em] shadow-[0_24px_48px_rgba(229,9,20,0.4)] relative group group-hover:scale-[1.02] active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? 'Hệ thống đang xử lý...' : 'Đăng nhập ngay'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
              </span>
            </button>
          </form>
          
          <div className="mt-12 flex items-center gap-4">
             <div className="h-px flex-grow bg-white/5"></div>
             <ShieldCheck className="w-4 h-4 text-white/10" />
             <div className="h-px flex-grow bg-white/5"></div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-center"
        >
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
            Bạn là thành viên mới?
            <Link to="/register" className="text-primary hover:text-white ml-2 transition-all underline underline-offset-8 decoration-primary/30 hover:decoration-white">
              Khởi tạo tài khoản
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;