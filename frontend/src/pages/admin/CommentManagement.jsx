import {
  CheckCircle2,
  XCircle,
  Search,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Sparkles,
  Megaphone,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils.js';
import { useComments } from '../../hooks/useComments.js';
import { PageHeader } from '../../components/shared/PageHeader.jsx';

// Stats derived in component

export default function CommentManagement() {
  const {
    comments,
    isDeleteModalOpen,
    isDeleteSuccessModalOpen,
    selectedComment,
    handleDeleteClick,
    handleConfirmDelete,
    closeDeleteModal,
    closeDeleteSuccessModal,
    searchTerm,
    setSearchTerm,
  } = useComments();

  const pendingCount = comments.filter(c => c.status === 'Trung lập').length;
  const violationCount = comments.filter(c => c.status === 'Vi phạm').length;

  const stats = [
    { label: 'Tổng bình luận', value: comments.length, sub: '+24% hôm nay', color: 'text-green-400' },
    { label: 'Đang chờ duyệt', value: pendingCount, sub: 'Cần xử lý', color: 'text-primary-container' },
    { label: 'Báo cáo vi phạm', value: violationCount, sub: 'Cần kiểm tra gấp', color: 'text-primary-container' },
    { label: 'Tỷ lệ tích cực', value: '92%', sub: 'Dựa trên AI phân tích', color: 'text-green-400' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="QUẢN LÝ BÌNH LUẬN"
        description="Hệ thống kiểm duyệt nội dung thông minh tích hợp AI. Tự động phát hiện spam, ngôn từ kích động và quảng cáo trái phép."
        badge="AI Moderation"
      >
        <button className="px-6 py-2.5 bg-surface-container rounded-xl text-on-surface font-bold hover:bg-surface-container-high transition-all flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          Thông báo cộng đồng
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-on-surface font-headline">{stat.value}</h3>
            <p className={cn("text-xs mt-2 font-semibold", stat.color)}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="p-6 border-b border-surface-container-high flex items-center justify-between">
            <div className="flex gap-4">
              <button className="text-sm font-bold text-primary-container border-b-2 border-primary-container pb-1">Tất cả</button>
              <button className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">Chờ duyệt (84)</button>
              <button className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">Đã báo cáo (12)</button>
            </div>
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/10">
              <Search className="w-4 h-4 text-on-surface-variant" />
              <input
                className="bg-transparent border-none text-xs focus:ring-0 outline-none w-48"
                placeholder="Tìm kiếm bình luận..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-surface-container-high">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-surface-container-high/20 transition-colors group">
                <div className="flex gap-4">
                  <img alt={comment.user} className="w-12 h-12 rounded-full border border-outline-variant/20 shrink-0" src={comment.avatar} referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{comment.user}</span>
                          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">tại</span>
                          <span className="text-xs font-bold text-primary-container hover:underline cursor-pointer">{comment.movie}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">{comment.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-surface-container-high text-green-400 hover:bg-green-400 hover:text-white transition-all shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(comment)}
                          className="p-2 rounded-lg bg-surface-container-high text-primary-container hover:bg-primary-container hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className={cn(
                      "mt-3 text-sm leading-relaxed",
                      comment.isSpam ? "text-primary-container font-medium italic" : "text-on-surface"
                    )}>
                      {comment.content}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            className={`w-3 h-3 ${index < comment.rating ? 'text-primary fill-primary' : 'text-on-surface-variant'}`}
                          />
                        ))}
                        <span>{comment.rating || 0}</span>
                      </div>

                      <div className="ml-auto flex items-center gap-3 bg-surface-container-highest/50 px-3 py-1.5 rounded-full border border-outline-variant/10">
                        <span className="text-[10px] font-black uppercase text-on-surface-variant">{comment.createdAt || comment.time || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-surface-container border-t border-surface-container-high flex items-center justify-center">
            <button className="text-xs font-bold text-on-surface-variant hover:text-on-surface flex items-center gap-2 transition-all group">
              Xem thêm bình luận cũ hơn
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
            <h3 className="text-lg font-black font-headline mb-4">Quy tắc cộng đồng</h3>
            <div className="space-y-4">
              {[
                { label: 'Không spam link lậu', status: 'Active' },
                { label: 'Ngôn từ văn minh', status: 'Active' },
                { label: 'Không quảng cáo', status: 'Active' },
                { label: 'Tránh Spoiler', status: 'Warning', color: 'text-yellow-400' },
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant font-medium">{rule.label}</span>
                  <span className={cn("text-[10px] font-black uppercase", rule.color || "text-green-400")}>{rule.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold border border-outline-variant/20 rounded-lg hover:bg-surface-container-high transition-all">Chỉnh sửa quy tắc</button>
          </div>

          <div className="bg-primary-container p-6 rounded-2xl shadow-xl shadow-primary-container/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-black font-headline text-white mb-2 leading-tight">AI Moderator<br />đang hoạt động</h3>
            <p className="text-white/80 text-xs font-medium mb-4">Đã tự động chặn 1,240 bình luận vi phạm trong 24h qua.</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-primary-container bg-white/20"></div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">+12 Moderators online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface-container-lowest/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="absolute inset-0"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-high rounded-[2rem] shadow-[0_20px_40px_rgba(229,9,20,0.15)] border border-outline-variant/10 overflow-hidden"
            >
              {/* Red Warning Header Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary-container via-primary-container/80 to-primary-container"></div>

              <div className="p-8">
                {/* Warning Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center relative">
                    <AlertTriangle className="w-8 h-8 text-primary-container relative z-10" />
                    <div className="absolute inset-0 rounded-full border border-primary-container/40 animate-ping opacity-20 scale-125"></div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-headline font-extrabold text-white mb-3 tracking-tight uppercase italic">Xác nhận xóa bình luận</h2>
                  <p className="text-on-surface-variant font-body leading-relaxed px-2 text-sm">
                    Bạn có chắc chắn muốn xóa bình luận của <span className="text-white font-semibold">{selectedComment?.user}</span> không? Hành động này <span className="text-white font-semibold">không thể hoàn tác</span>.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={closeDeleteModal}
                    className="px-6 py-3.5 rounded-xl border-2 border-outline-variant/20 hover:bg-surface-bright text-on-surface font-headline font-bold text-sm transition-all active:scale-95 duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-3.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-headline font-bold text-sm shadow-lg shadow-primary-container/30 transition-all active:scale-95 duration-200"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>

              {/* Close Button (X) */}
              <button
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Success Modal */}
      <AnimatePresence>
        {isDeleteSuccessModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-surface-dim/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md mx-4"
            >
              {/* Tinted Glow Background */}
              <div className="absolute inset-0 bg-primary-container/5 blur-3xl rounded-full"></div>

              <div className="relative bg-surface-container-low/80 backdrop-blur-2xl rounded-xl border border-outline-variant/10 p-10 flex flex-col items-center text-center shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Success Icon with Radial Glow */}
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150"></div>
                  <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center border border-green-500/30 relative z-10">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-10">
                  <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight uppercase italic">
                    Xóa bình luận thành công!
                  </h2>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-[280px] mx-auto">
                    Phản hồi đã được loại bỏ vĩnh viễn khỏi hệ thống quản lý nội dung của bạn.
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={closeDeleteSuccessModal}
                  className="w-full py-4 bg-primary-container hover:bg-primary-container/90 text-white font-headline font-bold rounded-xl transition-all duration-300 scale-100 active:scale-95 shadow-lg shadow-primary-container/20 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Đóng
                    <XCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
