import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Clock,
  Film,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Search
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
    page,
    setPage,
    pagination,
    loading
  } = useComments();

  const totalComments = pagination?.total || 0;

  const stats = [
    { label: 'Tổng số bình luận', value: totalComments, sub: 'Toàn hệ thống', color: 'text-blue-400', icon: MessageSquare },
    { label: 'Bình luận mới', value: comments.length, sub: 'Trên trang này', color: 'text-green-400', icon: Sparkles },
    { label: 'Cần kiểm duyệt', value: '0', sub: 'Tự động lọc', color: 'text-yellow-400', icon: AlertTriangle },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="Quản Lý Bình Luận"
        description="Theo dõi và kiểm duyệt các phản hồi từ cộng đồng người xem phim."
        badge="Community Control"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-on-surface font-headline italic tracking-tight">{stat.value}</h3>
            <p className={cn("text-xs mt-2 font-bold uppercase tracking-widest", stat.color)}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface-container-low rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-2xl">
        <div className="p-6 border-b border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-surface-container px-5 py-3 rounded-2xl border border-outline-variant/10 w-full md:w-96 focus-within:ring-2 focus-within:ring-primary-container/30 transition-all">
            <Search className="w-4 h-4 text-on-surface-variant" />
            <input
              className="bg-transparent border-none text-sm focus:ring-0 outline-none w-full placeholder:text-on-surface-variant/40 font-bold"
              placeholder="Tìm kiếm nội dung, người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-outline-variant/5">
          {loading && (
            <div className="p-12 text-center text-on-surface-variant font-bold uppercase tracking-widest animate-pulse">
               Đang tải dữ liệu...
            </div>
          )}
          {!loading && comments.length === 0 && (
            <div className="p-12 text-center text-on-surface-variant font-bold uppercase tracking-widest">
               Không tìm thấy bình luận nào
            </div>
          )}
          {!loading && comments.map((comment) => (
            <motion.div 
              layout
              key={comment.id} 
              className="p-8 hover:bg-surface-container-high/20 transition-all group border-l-4 border-l-transparent hover:border-l-primary-container"
            >
              <div className="flex gap-6">
                <div className="relative shrink-0">
                  <img 
                    alt={comment.user} 
                    className="w-14 h-14 rounded-2xl border-2 border-outline-variant/10 group-hover:border-primary-container/50 transition-colors object-cover" 
                    src={comment.avatar} 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-surface-container rounded-full flex items-center justify-center border border-outline-variant/10">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-black text-on-surface text-lg">{comment.user}</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary-container/10 rounded-full border border-primary-container/20">
                          <Film className="w-3 h-3 text-primary-container" />
                          <span className="text-[10px] font-black text-primary-container uppercase tracking-tight">{comment.movie}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {comment.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <button
                        onClick={() => handleDeleteClick(comment)}
                        className="p-3 rounded-xl bg-surface-container-highest text-primary-container hover:bg-primary-container hover:text-white transition-all shadow-lg active:scale-95"
                        title="Xóa bình luận"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-5 bg-surface-container/50 rounded-2xl border border-outline-variant/5 group-hover:border-primary-container/10 transition-all font-medium text-on-surface leading-relaxed relative">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-surface-container/50 border-l border-t border-outline-variant/5 rotate-45"></div>
                    {comment.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {pagination && pagination.total > 0 && (
          <div className="p-8 bg-surface-container-high/30 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} 
              {` `}trên {pagination.total} bình luận
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="w-10 h-10 rounded-2xl bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high disabled:opacity-20 transition-all flex items-center justify-center border border-outline-variant/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                  // logic to show only few pages if totalPages is large
                  if (pagination.totalPages > 5) {
                    if (p > 1 && p < pagination.totalPages && Math.abs(p - page) > 1) {
                      if (p === 2 || p === pagination.totalPages - 1) return <span key={p} className="text-on-surface-variant">...</span>;
                      return null;
                    }
                  }

                  return (
                    <button 
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-2xl text-[10px] font-black transition-all ${
                        p === page 
                          ? 'bg-primary-container text-white shadow-xl shadow-primary-container/30 scale-110' 
                          : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="w-10 h-10 rounded-2xl bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high disabled:opacity-20 transition-all flex items-center justify-center border border-outline-variant/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface-dim/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container p-10 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-outline-variant/10 text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-container/10 blur-[100px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 mx-auto relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
                  <Trash2 className="w-12 h-12 text-red-400" />
                </div>

                <h2 className="text-2xl font-headline font-black text-on-surface mb-3 tracking-tight uppercase italic">Xác nhận xóa</h2>
                <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest leading-relaxed mb-10 max-w-[280px] mx-auto">
                  Bạn có chắc chắn muốn xóa bình luận của <span className="text-on-surface font-black">"{selectedComment?.user}"</span>? Hành động này không thể hoàn tác.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirmDelete}
                    className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Xác nhận xóa
                  </button>
                  <button
                    onClick={closeDeleteModal}
                    className="w-full py-5 bg-surface-container-high text-on-surface font-black rounded-2xl uppercase tracking-widest text-sm hover:bg-surface-container-highest transition-all"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>

              <button
                onClick={closeDeleteModal}
                className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Success Modal */}
      <AnimatePresence>
        {isDeleteSuccessModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-surface-dim/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-surface-container p-10 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-outline-variant/10 text-center relative overflow-hidden"
            >
               <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 mx-auto relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>

                <h2 className="text-2xl font-headline font-black text-on-surface mb-3 tracking-tight uppercase italic">Thành công!</h2>
                <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest leading-relaxed mb-10 mx-auto">
                  Bình luận đã được xóa vĩnh viễn khỏi hệ thống.
                </p>

                <button
                  onClick={closeDeleteSuccessModal}
                  className="w-full py-5 bg-primary-container text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-container/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Xong
                </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
