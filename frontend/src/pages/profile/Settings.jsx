import React from 'react';
import { ToggleLeft, ToggleRight, ChevronRight, Monitor, PlayCircle, Mail, Languages, RotateCcw, Save, Shield, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

const Settings = () => {
//   const [settings, setSettings] = React.useState({
//     autoplay: true,
//     emailNotif: false,
//     quality: '1080p (Full HD)',
//     language: 'Tiếng Việt',
//     dataServer: 'Singapore',
//   });

//   const toggleSetting = (key) => {
//     setSettings(prev => ({ ...prev, [key]: !prev[key] }));
//   };

  return (
    <div className="space-y-16 max-w-5xl mx-auto pb-32">
      <header className="relative">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">System Preferences</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Cấu hình <span className="text-glow text-primary">Hệ thống.</span></h2>
          <div className="absolute -bottom-4 left-0 w-20 h-1 bg-primary rounded-full"></div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* Category: Experience */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
             <Monitor className="w-5 h-5 text-primary" />
             <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Trải nghiệm Người dùng</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => toggleSetting('autoplay')}
              className="glass-dark p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 italic">
                  Tự động phát tập tiếp theo
                </h4>
                <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-widest leading-relaxed">Tiết kiệm thời gian khi xem Series</p>
              </div>
              <div className="transition-transform duration-300 group-hover:scale-110">
                {settings.autoplay ? (
                  <ToggleRight className="w-10 h-10 text-primary" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-white/20" />
                )}
              </div>
            </div>

            <div 
              onClick={() => toggleSetting('emailNotif')}
              className="glass-dark p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 italic">
                  Thông báo qua thư điện tử
                </h4>
                <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-widest leading-relaxed">Cập nhật phim mới và ưu đãi</p>
              </div>
              <div className="transition-transform duration-300 group-hover:scale-110">
                {settings.emailNotif ? (
                  <ToggleRight className="w-10 h-10 text-primary" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-white/20" />
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Category: Streaming & Content */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
             <PlayCircle className="w-5 h-5 text-primary" />
             <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Truyền tải & Nội dung</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Chất lượng mặc định', value: settings.quality, icon: <HardDrive className="w-4 h-4" />, desc: 'Tự động chọn độ phân giải khi bắt đầu xem' },
              { label: 'Ngôn ngữ hiển thị', value: settings.language, icon: <Languages className="w-4 h-4" />, desc: 'Ngôn ngữ giao diện người dùng' },
              { label: 'Server Truyền tải', value: settings.dataServer, icon: <Shield className="w-4 h-4" />, desc: 'Vị trí máy chủ dữ liệu hiện tại' },
            ].map((item, i) => (
              <div key={i} className="glass-dark p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest italic">{item.label}</h4>
                    <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.value}</span>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:translate-x-1 group-hover:text-white transition-all" />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="pt-12 flex flex-col md:flex-row justify-end gap-6">
        <button className="px-12 py-5 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-3">
          <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
        </button>
        <button className="btn-primary px-16 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(229,9,20,0.3)] hover:scale-105 active:scale-95 transition-all">
          <Save className="w-4 h-4" /> Lưu cấu hình
        </button>
      </div>
    </div>
  );
};

export default Settings;