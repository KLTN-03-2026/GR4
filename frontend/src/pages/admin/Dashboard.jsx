import { 
  Crown,
  Users, 
  Film, 
  Eye, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  Play,
  Star,
  Activity,
  ShieldCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useMovies } from '../../hooks/useMovies';
import { useUsers } from '../../hooks/useUsers';
import { useComments } from '../../hooks/useComments';
import { PageHeader } from '../../components/shared/PageHeader';
import { getNotifications } from '../../service/notification_service';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { movies, pagination: moviePagination } = useMovies();
  const { users, pagination: userPagination } = useUsers();
  const { comments } = useComments();
  const [recentNotifications, setRecentNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await getNotifications();
        setRecentNotifications(res.data.slice(0, 5));
      } catch (error) {
        console.error('Lỗi khi tải thông báo', error);
      }
    };
    fetchNotifs();
  }, []);

  const totalMovies = moviePagination?.total || 0;
  const totalUsers = userPagination?.total || 0;
  const totalVip = userPagination?.totalVip || 0;

  const stats = [
    { label: 'Phim đang quản lý', value: totalMovies, trend: '+4', icon: Film, color: 'text-primary-container' },
    { label: 'Tổng thành viên', value: totalUsers.toLocaleString(), trend: '+12.5%', icon: Users, color: 'text-blue-400' },
    { label: 'Thành viên VIP', value: totalVip.toLocaleString(), trend: '+5.4%', icon: Crown, color: 'text-yellow-400' },
    { label: 'Bình luận mới', value: comments.length, trend: '+24%', icon: MessageSquare, color: 'text-purple-400' },
  ];

  const trendingMovies = movies.slice(0, 2);

  return (
    <div className="p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader 
        title="Tổng quan hệ thống" 
        description="Chào mừng trở lại, Admin. Đây là những gì đang diễn ra hôm nay."
        badge="Live Dashboard"
      >
        
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 hover:border-primary-container/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-surface-container-highest", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded-full">
                {stat.trend}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-3xl font-black text-on-surface font-headline tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity className="w-32 h-32 text-primary-container" />
            </div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black font-headline uppercase italic tracking-tight">Hoạt động gần đây</h3>
              <button onClick={() => navigate('/admin/notifications')} className="text-xs font-bold text-primary-container hover:underline uppercase tracking-widest">Xem tất cả</button>
            </div>
            <div className="space-y-6">
              {recentNotifications.length > 0 ? recentNotifications.map((notif, i) => (
                <div key={notif.id || i} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/admin/notifications')}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-outline-variant/10 bg-surface-container-highest group-hover:border-primary-container/50 group-hover:bg-primary-container/10 transition-colors">
                    <Activity className="w-5 h-5 text-on-surface-variant group-hover:text-primary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary-container transition-colors truncate">
                      {notif.title}
                    </p>
                    <p className="text-xs font-medium text-on-surface-variant truncate">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-on-surface-variant" />
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                        {new Date(notif.created_at).toLocaleDateString('vi-VN')} {new Date(notif.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl bg-surface-container-highest opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-on-surface" />
                  </button>
                </div>
              )) : (
                <div className="text-center py-6 text-on-surface-variant text-sm font-medium">Chưa có hoạt động nào gần đây.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
