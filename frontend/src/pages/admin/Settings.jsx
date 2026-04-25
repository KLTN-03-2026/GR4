import {
  Moon,
  Sun,
  Save,
  ChevronRight,
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useSettings } from '../../hooks/useSettings.js';
import { PageHeader } from '../../components/shared/PageHeader.jsx';

export default function Settings() {
  const {
    activeTab,
    tabs,
    isDarkMode,
    accentColor,
    handleTabChange,
    toggleDarkMode,
    handleAccentColorChange,
    handleSave,
  } = useSettings();

  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="CÀI ĐẶT HỆ THỐNG"
        description="Cấu hình tham số vận hành, bảo mật và giao diện của CINEMA+."
        badge="System Configuration"
      >
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-primary-container text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-container/20 flex items-center gap-2 hover:bg-primary-container/90 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          Lưu thay đổi
        </button>
      </PageHeader>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {tabs.map((item, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(item.label)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                activeTab === item.label
                  ? "bg-primary-container text-white shadow-lg shadow-primary-container/20"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", activeTab === item.label ? "text-white" : "text-on-surface-variant")} />
            </button>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-xl font-black font-headline mb-6 uppercase tracking-tight">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Tên hiển thị</label>
                <input className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary-container transition-all" defaultValue="Admin Cinema" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Email quản trị</label>
                <input className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary-container transition-all" defaultValue="admin@cinemaplus.com" />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Tiểu sử</label>
                <textarea rows={3} className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary-container transition-all resize-none" defaultValue="Quản trị viên cấp cao của hệ thống Cinema+ Entertainment." />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-xl font-black font-headline mb-6 uppercase tracking-tight">Tùy chọn giao diện</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface uppercase tracking-tight">Chế độ tối (Dark Mode)</p>
                  <p className="text-xs text-on-surface-variant">Tự động chuyển đổi giao diện theo hệ thống</p>
                </div>
                <div className="flex bg-surface-container p-1 rounded-xl">
                  <button
                    onClick={toggleDarkMode}
                    className={cn("p-2 rounded-lg transition-all", isDarkMode ? "bg-primary-container text-white shadow-md" : "text-on-surface-variant hover:text-on-surface")}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className={cn("p-2 rounded-lg transition-all", !isDarkMode ? "bg-primary-container text-white shadow-md" : "text-on-surface-variant hover:text-on-surface")}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface uppercase tracking-tight">Màu sắc chủ đạo</p>
                  <p className="text-xs text-on-surface-variant">Thay đổi màu nhấn của toàn bộ ứng dụng</p>
                </div>
                <div className="flex gap-2">
                  {[
                    { color: 'bg-[#e50914]', value: '#e50914' },
                    { color: 'bg-blue-500', value: '#3b82f6' },
                    { color: 'bg-green-500', value: '#22c55e' },
                    { color: 'bg-purple-500', value: '#a855f7' }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleAccentColorChange(item.value)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 border-surface-container-highest transition-all",
                        item.color,
                        accentColor === item.value && "ring-2 ring-white scale-110"
                      )}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 border-primary-container/20">
            <h3 className="text-xl font-black font-headline mb-2 uppercase tracking-tight text-primary-container">Vùng nguy hiểm</h3>
            <p className="text-xs text-on-surface-variant mb-6">Các hành động này có thể ảnh hưởng nghiêm trọng đến dữ liệu hệ thống.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <button className="flex-1 py-3 border border-primary-container/30 rounded-xl text-xs font-bold text-primary-container hover:bg-primary-container/5 transition-all uppercase tracking-widest">Xóa bộ nhớ đệm</button>
              <button className="flex-1 py-3 bg-primary-container/10 border border-primary-container/30 rounded-xl text-xs font-bold text-primary-container hover:bg-primary-container/20 transition-all uppercase tracking-widest">Khôi phục cài đặt gốc</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
