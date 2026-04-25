import React from 'react';
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Smartphone, Globe, Lock, ShieldAlert, Key, LogOut, ChevronRight, Check, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from "../../hooks/useAuth";  

const Security = ({ showPassword, setShowPassword }) => {
  const { changePassword } = useAuth();

  // 🔥 STATE FORM
  const [form, setForm] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 HANDLE SUBMIT
  const handleChangePassword = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.oldPass || !form.newPass || !form.confirmPass) {
      setErrorMsg("Vui lòng nhập đầy đủ tất cả thông tin.");
      return;
    }

    if (form.newPass.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (form.newPass !== form.confirmPass) {
      setErrorMsg("Xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      setLoading(true);

      await changePassword(form);

      setSuccessMsg("Cập nhật mật khẩu thành công! Bạn có thể sử dụng mật khẩu mới ngay.");

      setForm({
        oldPass: "",
        newPass: "",
        confirmPass: "",
      });

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 max-w-5xl mx-auto pb-32">
      <header className="relative">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Privacy & Protection</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">
            Bảo mật <span className="text-glow text-primary">Tài khoản.</span>
          </h2>
          <div className="absolute -bottom-4 left-0 w-20 h-1 bg-primary rounded-full"></div>
        </motion.div>
      </header>
      
      {/* Password Management */}
      <motion.section 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
           <Key className="w-5 h-5 text-primary" />
           <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
             Quản lý Mật khẩu
           </h3>
        </div>

        <div className="glass-dark rounded-[3.5rem] p-10 border border-white/5 shadow-2xl space-y-8">

          {/* OLD PASSWORD */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative group">
              <input
                value={form.oldPass}
                onChange={(e) => setForm({ ...form, oldPass: e.target.value })}
                className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* NEW PASSWORD */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2">
                Mật khẩu mới
              </label>
              <input
                value={form.newPass}
                onChange={(e) => setForm({ ...form, newPass: e.target.value })}
                className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Min. 8 characters"
                type="password"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2">
                Xác nhận mật khẩu
              </label>
              <input
                value={form.confirmPass}
                onChange={(e) => setForm({ ...form, confirmPass: e.target.value })}
                className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Repeat new password"
                type="password"
              />
            </div>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(239,68,68,0.1)]"
              >
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-red-400 text-sm font-bold tracking-wide">{errorMsg}</p>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <p className="text-emerald-400 text-sm font-bold tracking-wide">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BUTTON */}
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group"
          >
            {loading ? "Đang xử lý..." : "Cập nhật bảo mật"}
            <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </motion.section>

      {/* Privacy Alert */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-start gap-6"
      >
         <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
         <div className="space-y-2">
            <h4 className="text-lg font-black text-white italic uppercase tracking-tight">
              Vùng riêng tư quan trọng
            </h4>
            <p className="text-on-surface-variant/60 text-sm font-medium leading-relaxed">
              Nếu bạn nhận thấy bất kỳ hoạt động đáng ngờ nào, hãy lập tức thay đổi mật khẩu và đăng xuất khỏi mọi thiết bị.
            </p>
         </div>
      </motion.div>
    </div>
  );
};

export default Security;