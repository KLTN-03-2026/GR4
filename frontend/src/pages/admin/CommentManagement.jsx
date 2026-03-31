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
    ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="QUẢN LÝ BÌNH LUẬN"
        description="Hệ thống kiểm duyệt nội dung bình luận."
        badge="Comment Control"
      >
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
                          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter"> đã bình luận trong phim </span>
                          <span className="text-xs font-bold text-primary-container hover:underline cursor-pointer">{comment.movie}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">{comment.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteClick(comment)}
                          className="p-2 rounded-lg bg-surface-container-high text-primary-container hover:bg-primary-container hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className={cn(
                      "mt-3 text-sm leading-relaxed",
                      comment.isSpam ? "text-primary-container font-medium italic" : "text-on-surface"
                    )}>
                      {comment.content}
                    </p>
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
