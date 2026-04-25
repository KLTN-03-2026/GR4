import { BadgeCheck, Monitor, Volume2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/shared/MovieCard.jsx';

export default function Success() {
  const navigate = useNavigate();

  const suggestedMovies = [
    { title: 'Cyberpunk 2077', category: 'Sci-fi', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4KuVOsJZNPoka-lLfavzby1slOyzeu7ce5K66Pk9FmUSZ0tWtgJTsGqQXcrzKgu4RfkHvbZiQSyuH2YVpquK_NyZW-JIqaLxu7Brvlx6G6JYEspbAuYCfJZ_AdG_ErsaSWhgN1jsBWhaI50eJ8pct_4ncvx0g5zcYem277plCO8jbiZifYu45nGeLwSJ7kTkQuCOgUg_w62kovxRmWC-kZqpIriShnslNQSg3f3NE9bXikeCsIDX9HnXkW81GKAjAZiwSb2M8VTU' },
    { title: 'Mars Horizon', category: 'Adventure', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZRzKXEJe9DbmEjV-5Mcer_HUAhwshc1OJeGF07wJsCINjpTyYj8ZN_D3_v87VrpmfYOq5c2bPZPE_QxG4cGtUoxfItLJa552KZtbf-DhqBDxRdZ_ukkNetluZiPzI5o0FRiX8jlTfMjW_bueYEBVXURw_Tgore12_dZnwGFtHjmmsIAxwhuKb9yfOBOmRGn99x4YZ0JJY5XocM2jVEKDu7FgzQgdMRKHqHZqAf5HLYuQP_eY6p1MQcyPr71sOpzqzz7xMcbDQ7Vo' },
    { title: 'The Last Night', category: 'Thriller', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu_lVGTspy43poubshZ2xnZZe8KrK3jeevPU8w93VixAVxhfqe_vHb570bRZyVGqhH-vNv7GyPwlz_5IcAXoJM4uXPSt7eZyMDBok3ahBJ_MSfF4TYi76VAjDifPA9azxPbI76kjks-HElkcWdYh2RPRq-KzZJqcuAYztiOO1B-NBT2E1LqxPQsuDopw8Szospq8hlGKOm9g7ocf46SgZpUYVbe-l2kWHLXQZLjcXaFc_lfmw7r369OIk-yMTuftDKRV1_oN-emnM' },
    { title: 'Multiverse', category: 'Cosmic', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJsL7rPJ0Et7oBS4lcBJeK3sY-n0r7A42mahysPb8D7wrsE4DwJxXiCVwktNEWFPpJg0AkmnkiSIxE__9ka0-tL_m7AMmz2GZXG9EJ2aUGLpkYJlvcZ1CNUeOT8ctY83_GO60T4wQ447nTVAiMW0UfJsSr_W9dp61Gqi4H8EsqhAH6eAimMYEIv1g4OiMSWR_5w_K9KjnT4QKL3vaBs4EFDg1KWhiy-Dcqxn4HZGsltU1hJQh_gS2BgSRPeX4IJy8ZebCGiMx3PL4' },
    { title: 'Vương Quốc Cuối Cùng', category: 'Action', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFD_TfXw3eBpoCZCSoS8W-5w8SUEeHPNgxMlADL8ceBVN6fYAqe1kRTMnsCKxlrnHzWCHDPB5ZmUwEnO5vIrVWH29nve9TwnhjbJ7NYzQ_526S_3LLEwi9l9E_CWwwFrR82Rf7ST7C-w72QpQstl_hIUZK0U8lL1D-WKveXtj5cNGU08l3aywPAbbJhm4f_tZxP7NmMRKog33SKENOLYIzNwalOsY2COG_rt_8S9FKNF9vCwGqVHDaBT1-EC_4MLrtV8B5XxFBjI' },
    { title: 'Trí Tuệ Nhân Tạo', category: 'AI Sci-fi', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMGYfvCBNg-gL79j7W6OTyUAhGiTVtVrgD2w31OnuKD6rj7hEN6UqOm1eJRdpxnBieV-dyPZiGGiioc_snbk-pNNvgr-GNy1G0ereGf1-S6-0Iu7fadOCJfgUaPLubyZSQWy-Ud6ImxCXcdVakk8CxHxpzv4i952BhwoqLe2Bkdq0gv39_Ujm6WGWwhZgbl4D56VqSiZp-Bb-e_q0TX2ugbuXAcyXA28jd-sa1-eppJOPy064W9j2UyTFVJSO3Wy9XQFAi15Xpf1I' }
  ];

  return (
    <div className="min-h-screen flex flex-col animate-in slide-in-from-bottom-10 duration-1000">
      <div className="flex-grow flex flex-col relative pt-20 overflow-hidden">
        {/* Background Cinema Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-radial-gradient from-black/40 to-black"></div>
          <img 
            className="w-full h-full object-cover opacity-20" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnaVuC5Xf7YR_42JsRjHAfHx-M4DDLMzRtPd20RZNeEungPta9PDBigc4PsSniQj9pGkmLwSESV4BElk4UROxc12X_FzpZAC5v0O-9GVT2HfJBfWPrrsARcH_s21P3zZQhAo4pSzonheRxep992g6vi7JS8CA-m5N4Ct-d6vF3r4C0FKedosGnnW_Ehr_s2mfQk8Q0iH9yaz6Sig3ByaOVzQXh812R99pTww9t65Jnsn5wIaxXUorGb9kWkHZ47Lgy1B51GDfVQdA" 
            alt="Cinema hall"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
          <div className="max-w-4xl w-full text-center">
            {/* Success Icon */}
            <div className="relative mb-12 inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/30 blur-[80px] rounded-full scale-150 animate-pulse"></div>
              <div className="w-32 h-32 rounded-full border-2 border-red-500/50 flex items-center justify-center relative z-10 bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(229,9,20,0.6)]">
                <BadgeCheck className="w-16 h-16 text-red-500" />
              </div>
            </div>

            {/* Messaging */}
            <div className="space-y-6 mb-12">
              <h2 className="text-red-500 text-xs font-bold tracking-[0.4em] uppercase opacity-80 mb-2">Đăng ký thành công</h2>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
                CHÀO MỪNG ĐẾN VỚI <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-white">ĐẶC QUYỀN VIP</span>
              </h1>
              <p className="text-neutral-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
                Trải nghiệm thế giới điện ảnh không giới hạn với chất lượng 4K HDR và âm thanh vòm Dolby Atmos. Hành trình đẳng cấp của bạn bắt đầu ngay lúc này.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_40px_rgba(229,9,20,0.3)]"
              >
                Khám phá kho phim
              </button>
              <button className="w-full sm:w-auto px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
                Thông tin tài khoản
              </button>
            </div>

            {/* Benefit Icons */}
            <div className="mt-20 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
              <div className="flex flex-col items-center gap-3">
                <Monitor className="w-10 h-10 text-white" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-white">4K HDR</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-white" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-white">No Ads</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Volume2 className="w-10 h-10 text-white" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-white">Dolby Atmos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Content */}
        <div className="bg-gradient-to-t from-[#131313] to-transparent pt-12 pb-24 px-6 md:px-16 relative z-10">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm uppercase tracking-[0.3em] text-neutral-500">Đề xuất cho bạn</h3>
                <div className="h-1 w-8 bg-red-600 mt-2 rounded-full"></div>
              </div>
              <a className="text-xs font-bold text-neutral-400 hover:text-white transition-colors" href="#">Xem thêm</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {suggestedMovies.map((movie, index) => (
                <MovieCard key={index} {...movie} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
