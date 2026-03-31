import React from 'react';
import { Share2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-white/5 w-full">
      <div className="max-w-[1920px] mx-auto px-8 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black tracking-tighter text-primary uppercase font-manrope text-glow">
              CINEMA+
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs font-medium">
              Trải nghiệm điện ảnh đỉnh cao với chất lượng 4K, âm thanh vòm và kho phim khổng lồ được cập nhật mỗi ngày.
            </p>
            {/* <div className="flex gap-4">
              {['Facebook', 'Instagram', 'Twitter', 'Youtube'].map((social) => (
                <button key={social} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary transition-all group border border-white/5">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 rounded-sm bg-on-surface-variant group-hover:bg-white transition-colors"></div>
                </button>
              ))}
            </div> */}
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Khám phá</h4>
            <ul className="space-y-4 text-sm font-bold text-on-surface-variant">
              <li><Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
              <li><Link to="/filter" className="hover:text-primary transition-colors">Phim mới</Link></li>
              <li><Link to="/filter" className="hover:text-primary transition-colors">Phim bộ</Link></li>
              <li><Link to="/filter" className="hover:text-primary transition-colors">Phim lẻ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm font-bold text-on-surface-variant">
              <li><Link to="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Đăng ký nhận tin</h4>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email của bạn"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium outline-none focus:border-primary/50 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                Gửi
              </button>
            </div>
          </div> */}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            © 2024 CINEMA+. Đã đăng ký bản quyền.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            <Link to="#" className="hover:text-on-surface-variant transition-colors">Quốc gia: Việt Nam</Link>
            <Link to="#" className="hover:text-on-surface-variant transition-colors">Ngôn ngữ: Tiếng Việt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
