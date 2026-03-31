import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, Check, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    // ✅ validate input
    if (!username || !email || !password || !confirm) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    // ✅ normalize data
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    // ✅ validate password match
    if (password !== confirm) {
      setError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }

    // ✅ validate password length (backend chưa check)
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    // ✅ validate username
    if (trimmedUsername.length < 3) {
      setError('Tên người dùng tối thiểu 3 ký tự');
      setLoading(false);
      return;
    }

    // ✅ check agree
    if (!agree) {
      setError('Bạn cần đồng ý với các điều khoản');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/api/users/register',
        {
          username: trimmedUsername,
          email: normalizedEmail,
          password
        }
      );

      // ✅ optional: show success message (nếu bạn có UI)
      // setSuccess('Đăng ký thành công');

      // ✅ redirect về login
      navigate('/login');

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        'Đăng ký thất bại. Vui lòng thử lại sau.'
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
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover"
          alt="Register Background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[600px] my-10"
      >
        <div className="glass-dark p-10 md:p-14 rounded-[3.5rem] shadow-[0_48px_96px_rgba(0,0,0,0.8)] border border-white/5 relative overflow-hidden group">
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
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter text-glow italic">Gia nhập Cinema+</h2>
              <p className="text-on-surface-variant/60 text-[10px] font-black uppercase tracking-[0.3em]">Bắt đầu hành trình điện ảnh của bạn</p>
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

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* USERNAME */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black tracking-[0.3em] text-on-surface-variant uppercase ml-2">Họ và tên thành viên</label>
              <div className="relative group/input">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="w-full bg-surface border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-on-surface-variant/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none text-[11px] font-black uppercase tracking-widest shadow-2xl"
                />
                <User className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors w-5 h-5" />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black tracking-[0.3em] text-on-surface-variant uppercase ml-2">Địa chỉ Email</label>
              <div className="relative group/input">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@cinema.plus"
                  className="w-full bg-surface border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-on-surface-variant/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none text-[11px] font-black uppercase tracking-widest shadow-2xl"
                />
                <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors w-5 h-5" />
              </div>
            </div>

            {/* PASSWORDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-black tracking-[0.3em] text-on-surface-variant uppercase ml-2">Mật mã</label>
                <div className="relative group/input">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-on-surface-variant/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none text-[11px] font-black uppercase tracking-widest shadow-2xl"
                  />
                  <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black tracking-[0.3em] text-on-surface-variant uppercase ml-2">Xác nhận</label>
                <div className="relative group/input">
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-on-surface-variant/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none text-[11px] font-black uppercase tracking-widest shadow-2xl"
                  />
                  <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors w-5 h-5" />
                </div>
              </div>
            </div>

            {/* AGREEMENT */}
            <div className="flex items-start space-x-4 pt-4 px-2">
              <div className="relative flex items-center h-6">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="peer h-6 w-6 rounded-xl border-white/10 bg-surface text-primary focus:ring-0 appearance-none border checked:bg-primary transition-all shadow-2xl"
                />
                <Check className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3 h-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
              </div>

              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-relaxed cursor-pointer group/label">
                Tôi chấp nhận <Link to="#" className="text-primary group-hover/label:text-white transition-colors">Điều khoản dịch vụ</Link> và <Link to="#" className="text-primary group-hover/label:text-white transition-colors">Chính sách bảo mật</Link> của Cinema+.
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xs uppercase tracking-[0.3em] shadow-[0_24px_48px_rgba(229,9,20,0.4)] relative group hover:scale-[1.02] active:scale-95 mt-4"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? 'Hệ thống đang khởi tạo...' : 'Tạo tài khoản ngay'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-px flex-grow bg-white/5"></div>
            <Sparkles className="w-4 h-4 text-white/10" />
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
            Đã là thành viên của chúng tôi?
            <Link to="/login" className="text-primary hover:text-white ml-2 transition-all underline underline-offset-8 decoration-primary/30 hover:decoration-white">
              Đăng nhập tại đây
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;