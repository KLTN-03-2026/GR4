import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut,
  Search,
  Bell
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Film, label: 'Quản lý phim', path: '/admin/movies' },
  { icon: Users, label: 'Quản lý người dùng', path: '/admin/users' },
  { icon: MessageSquare, label: 'Quản lý bình luận', path: '/admin/comments' },
  { icon: BarChart3, label: 'Thống kê', path: '/admin/stats' },
  { icon: SettingsIcon, label: 'Cài đặt', path: '/admin/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-surface-container-high sticky left-0 top-0 bg-surface py-6 font-headline antialiased tracking-tight z-50">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-black tracking-tighter text-primary-container uppercase">CINEMA+</h1>
        <p className="text-[10px] text-on-surface-variant/60 tracking-widest uppercase mt-1">Admin Panel</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-300",
              isActive 
                ? "bg-primary-container text-white font-bold shadow-lg shadow-primary-container/20" 
                : "text-on-surface-variant hover:bg-surface-container-highest/30 hover:text-on-surface"
            )}
            end={item.path === '/admin'}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-white/5 px-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Đăng xuất hệ thống</span>
              </button>
            </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="w-full h-16 sticky top-0 z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-surface-container-high font-sans text-sm font-medium">
      <div className="flex items-center gap-4 bg-surface-container-low/50 px-4 py-2 rounded-full border border-outline-variant/10 focus-within:ring-1 focus-within:ring-primary-container/30">
        {/* <Search className="w-4 h-4 text-on-surface-variant" /> */}
        {/* <input 
          className="bg-transparent border-none focus:ring-0 text-on-surface w-64 placeholder:text-on-surface-variant/40 outline-none" 
          placeholder="Tìm kiếm dữ liệu..." 
          type="text"
        /> */}
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-surface-container-high">
          <div className="text-right">
            <p className="text-on-surface font-bold">Admin Cinema</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Super Admin</p>
          </div>
          <img 
            alt="Admin Avatar" 
            className="w-10 h-10 rounded-full border-2 border-primary-container" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSkP0qGwY0Y5bOh37vqjSotlvM7fx0ERp9ixgFgRgM0-vmXKjInN4Oh75hLM6qAstUSYE_WZHB6JqCgomhQ3DFQBbGk2AwjdYukX7pQ_QoKQf49PE7BHvSDnHBM33RhQjL3d7mvvHiNDwPEe-O-Orr1mT_X5khyx1kN8czzD3Tr9ooJOGnKLD1KoK14TcuzvA_fv_gLDQkd6KiLL34hpCn8wYe3mRoKa1FXSDqMWeA4lTY95fIOiSXdYDMIUSOafnm266bizEe4Ync"
          />
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
