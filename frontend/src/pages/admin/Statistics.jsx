import {
  BarChart3,
  TrendingUp,
  Smartphone,
  Laptop,
  Tv,
  ArrowRight,
  Star,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useStatistics } from '../../hooks/useStatistics.js';
import { PageHeader } from '../../components/shared/PageHeader.jsx';

export default function Statistics() {
  const {
    revenueData,
    genres,
    topMovies,
    userStats,
    vipTrend,
    timeRange,
    handleTimeRangeChange,
    loading,
    error
  } = useStatistics();

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
        <p className="text-on-surface-variant font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 text-center p-8">
        <div className="bg-primary/10 p-6 rounded-full">
          <TrendingUp className="w-12 h-12 text-primary rotate-180" />
        </div>
        <h2 className="text-2xl font-bold font-headline">Có lỗi xảy ra</h2>
        <p className="text-on-surface-variant max-w-md">Không thể kết nối với máy chủ để lấy dữ liệu thống kê. Vui lòng thử lại sau.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-primary-container text-white rounded-xl shadow-lg hover:shadow-primary-container/20 transition-all font-bold"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const quickStats = [
    { label: 'Tổng người dùng', value: userStats.total, icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Thành viên VIP', value: userStats.vip, sub: userStats.vipPercentage, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Người dùng mới (30 ngày)', value: userStats.new, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="Báo cáo & Thống kê"
        description="Dữ liệu phân tích chi tiết cho chu kỳ kinh doanh hiện tại."
        badge="Analytics Engine"
      >
        <div className="flex bg-surface-container p-1 rounded-xl shadow-inner border border-outline-variant/10">
          {['Tháng', 'Quý', 'Năm'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={cn(
                "px-6 py-2 text-sm font-semibold transition-all rounded-lg",
                timeRange === range ? "bg-primary-container text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary-container/30 transition-all">
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black font-headline text-on-surface">{stat.value.toLocaleString()}</h4>
                {stat.sub && <span className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-1.5 py-0.5 rounded">{stat.sub}</span>}
              </div>
            </div>
            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-6 shadow-2xl relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute top-0 right-0 p-4">
            <BarChart3 className="w-24 h-24 text-primary-container opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold font-headline mb-1">Doanh thu tổng hợp</h3>
              <p className="text-sm text-on-surface-variant">{revenueData.growth} so với kỳ trước</p>
            </div>
            <div className="flex items-center gap-2 text-primary-container font-bold text-2xl">
              <span>{revenueData.total}</span>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 px-4">
            {revenueData.heights.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-full rounded-t-lg transition-all relative group/bar",
                  i === revenueData.heights.length - 1 ? "bg-primary-container shadow-[0_0_20px_rgba(229,9,20,0.3)]" : "bg-surface-container-highest hover:bg-primary-container"
                )}
                style={{ height: `${Math.max(10, h)}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold border border-outline-variant/10">
                  ${Math.floor(h * 1.5)}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-4">
            {revenueData.labels.map(label => <span key={label}>{label}</span>)}
          </div>
        </div>

        {/* Genre Trends */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between border border-outline-variant/10">
          <div>
            <h3 className="text-xl font-bold font-headline mb-1">Xu hướng thể loại</h3>
            <p className="text-sm text-on-surface-variant mb-6">Tỷ lệ xem theo danh mục phim</p>
          </div>
          <div className="relative flex items-center justify-center py-6">
            <svg className="w-48 h-48 -rotate-90">
              <circle cx="96" cy="96" fill="transparent" r="80" stroke="var(--md-sys-color-surface-container-highest)" strokeWidth="24"></circle>
              {/* Dynamic doughnut chart logic - simplification for UI beauty */}
              <circle 
                cx="96" cy="96" fill="transparent" r="80" 
                stroke="var(--md-sys-color-primary-container)" 
                strokeDasharray="502.6" 
                strokeDashoffset={502.6 * (1 - parseInt(genres[0]?.value || 0) / 100)} 
                strokeWidth="24"
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              ></circle>
              <circle 
                cx="96" cy="96" fill="transparent" r="80" 
                stroke="var(--md-sys-color-primary)" 
                strokeDasharray="502.6" 
                strokeDashoffset={502.6 * (1 - (parseInt(genres[0]?.value || 0) + parseInt(genres[1]?.value || 0)) / 100)} 
                strokeWidth="24"
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black">{genres[0]?.value || '0%'}</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">{genres[0]?.label || 'Dữ liệu'}</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {genres.map(g => (
              <div key={g.label} className="flex items-center justify-between text-sm group cursor-default">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full shadow-sm", g.color)}></div>
                  <span className="group-hover:text-primary-container transition-colors font-medium">{g.label}</span>
                </div>
                <span className="font-black text-on-surface">{g.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Visibility VIP Trends Chart (Bar Chart) */}
        <div className="col-span-12 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Star className="w-48 h-48 text-primary" />
          </div>
          
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <h3 className="text-2xl font-black font-headline flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                Tăng trưởng Thành viên VIP
              </h3>
              <p className="text-on-surface-variant max-w-lg">Số lượng người dùng nâng cấp gói Premium qua từng giai đoạn ({timeRange}).</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary-container/20">
                <Star className="w-5 h-5 fill-white" />
                <span className="text-sm font-black uppercase tracking-widest">{userStats.vip} VIP Hiện tại</span>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant italic uppercase tracking-tighter">Cập nhật ngay bây giờ</span>
            </div>
          </div>

          <div className="relative h-72 w-full mt-4 flex items-end justify-between gap-4 px-2">
            {/* Background Grid Lines (Horizontal) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-t border-dashed border-outline-variant" />
              ))}
            </div>

            {vipTrend.counts.map((val, i) => {
              const max = Math.max(...vipTrend.counts, 5);
              const heightPercent = (val / max) * 100;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end relative group/bar z-10 h-full">
                  {/* Value Label */}
                  <div className="mb-3 text-sm font-black text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {val > 0 ? val : ''}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className={cn(
                      "w-full max-w-[80px] rounded-t-2xl transition-all duration-700 ease-out relative shadow-lg",
                      val > 0 ? "bg-primary" : "bg-surface-container-highest",
                      "group-hover/bar:bg-primary-container group-hover/bar:scale-105"
                    )}
                    style={{ height: `${Math.max(5, heightPercent)}%` }}
                  >
                    {/* Glossy Effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-t-2xl opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Label */}
                  <div className="mt-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {vipTrend.labels[i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Movies Table */}
      <section className="bg-surface-container-low rounded-xl overflow-hidden shadow-xl border border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
          <div>
            <h3 className="text-xl font-bold font-headline mb-1">Phim xem nhiều nhất</h3>
            <p className="text-sm text-on-surface-variant">Top xu hướng trong khoảng thời gian đã chọn</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-container hover:bg-primary-container/10 px-4 py-2 rounded-xl transition-all">
            <span>Chi tiết</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-[10px] uppercase font-bold text-on-surface-variant tracking-[0.2em]">
                <th className="px-6 py-4">Hạng</th>
                <th className="px-6 py-4">Phim</th>
                <th className="px-6 py-4">Lượt Xem</th>
                <th className="px-6 py-4">Đánh Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {topMovies.map((movie, i) => (
                <tr key={i} className="hover:bg-surface-container/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg font-black",
                      i === 0 ? "bg-yellow-400/20 text-yellow-500" : 
                      i === 1 ? "bg-slate-400/20 text-slate-500" :
                      i === 2 ? "bg-orange-400/20 text-orange-500" :
                      "bg-surface-container-highest text-on-surface-variant"
                    )}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg bg-surface-container-highest shrink-0 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                        <img 
                          className="w-full h-full object-cover" 
                          src={movie.image} 
                          alt={movie.title}
                          referrerPolicy="no-referrer" 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x225?text=No+Poster';
                          }}
                        />
                      </div>
                      <div>
                        <span className="block font-bold text-on-surface group-hover:text-primary-container transition-colors">{movie.title}</span>
                        <span className="text-[10px] text-on-surface-variant font-medium uppercase">{movie.genre}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">{movie.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 bg-primary-container/10 w-fit px-2 py-1 rounded-lg border border-primary-container/20">
                      <Star className="w-3 h-3 fill-primary-container text-primary-container" />
                      <span className="text-sm font-black text-primary-container">{movie.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-auto py-12 border-t border-outline-variant/10 text-on-surface-variant text-xs flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-medium">© 2026 CINEMA+ Premium Streaming Administration System.</p>
        <div className="flex gap-8 font-bold uppercase tracking-widest text-[10px]">
          <a className="hover:text-primary-container transition-colors" href="#">Chính sách bảo mật</a>
          <a className="hover:text-primary-container transition-colors" href="#">Điều khoản dịch vụ</a>
          <a className="hover:text-primary-container transition-colors" href="#">Trung tâm hỗ trợ</a>
        </div>
      </footer>
    </div>
  );
}
