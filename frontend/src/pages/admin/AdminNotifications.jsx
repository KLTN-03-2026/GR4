import React, { useState, useEffect } from 'react';
import { Bell, Check, Zap, Shield, CreditCard, Gift, MoreVertical, X, Users, Crown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNotifications, markAllAsRead, markAsRead, deleteNotification as deleteNotifApi, deleteReadNotifications } from '../../service/notification_service';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getNotifications();
      const mapped = res.data.map(n => ({ ...n, read: !!n.is_read }));
      setNotifications(mapped);
    } catch (error) {
      console.error('Lỗi khi tải thông báo', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc', error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
      setNotifications(prev => prev.filter(n => !n.read));
    } catch (error) {
      console.error("Lỗi khi xóa", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      try {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      } catch (_) {}
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await deleteNotifApi(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa thông báo', error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new': return <Users className="w-5 h-5 text-blue-400" />;
      case 'billing': return <Crown className="w-5 h-5 text-emerald-400" />;
      case 'promo': return <Gift className="w-5 h-5 text-purple-400" />;
      case 'security': return <Shield className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'new': return 'bg-blue-500/10 border-blue-500/20';
      case 'billing': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'promo': return 'bg-purple-500/10 border-purple-500/20';
      case 'security': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2">Quản trị hệ thống</p>
          <h1 className="text-3xl font-black text-on-surface tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary-container" />
            Hoạt Động Gần Đây
            {unreadCount > 0 && (
              <span className="text-sm bg-primary-container text-white font-black px-3 py-1 rounded-full">
                {unreadCount} mới
              </span>
            )}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">Theo dõi hoạt động người dùng và hệ thống</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-highest rounded-xl border border-outline-variant/20 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all"
            >
              <Check className="w-4 h-4" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
          {notifications.length > unreadCount && (
             <button 
               onClick={handleDeleteRead}
               className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-xs font-black uppercase tracking-widest text-red-400 hover:text-white hover:bg-red-500/80 transition-all shadow-sm"
             >
                <Trash2 className="w-4 h-4" /> {unreadCount === 0 ? "Xóa tất cả" : "Xóa đã đọc"}
             </button>
           )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tổng thông báo', value: notifications.length, color: 'text-on-surface' },
          { label: 'Chưa đọc', value: unreadCount, color: 'text-primary-container' },
          { label: 'Đã đọc', value: notifications.length - unreadCount, color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Bell className="w-10 h-10 text-primary-container animate-bounce opacity-50" />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`bg-surface-container-low rounded-2xl border flex gap-5 p-5 cursor-pointer group hover:bg-surface-container-highest/40 transition-all relative ${
                    n.read ? 'border-outline-variant/10 opacity-60 hover:opacity-100' : 'border-primary-container/30 shadow-lg shadow-primary-container/5'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-primary-container rounded-full animate-pulse shadow-[0_0_8px_rgba(229,9,20,0.6)]" />
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getBgColor(n.type)}`}>
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className={`text-sm font-black uppercase tracking-tight ${n.read ? 'text-on-surface/50' : 'text-on-surface'}`}>
                        {n.title}
                      </h4>
                      <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-wide shrink-0">{formatTime(n.created_at)}</p>
                    </div>
                    <p className="text-on-surface-variant/70 text-xs leading-relaxed mt-1">{n.message}</p>

                    <div className="flex items-center gap-5 mt-3">
                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                          className="text-[9px] font-black uppercase tracking-widest text-primary-container hover:text-on-surface transition-colors"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(n.id, e)}
                        className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/30 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Xóa
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center space-y-6"
            >
              <div className="w-32 h-32 bg-surface-container-low rounded-3xl flex items-center justify-center border border-outline-variant/10">
                <Bell className="w-14 h-14 text-on-surface-variant/10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Chưa có thông báo nào</h3>
                <p className="text-on-surface-variant/40 text-xs font-medium uppercase tracking-widest max-w-sm">
                  Thông báo sẽ xuất hiện khi người dùng đăng ký hoặc mua gói VIP.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AdminNotifications;
