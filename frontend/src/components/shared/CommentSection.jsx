import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const CommentSection = ({ comments, averageRating, ratingCount }) => {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Đánh giá người dùng</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-container-high rounded-3xl px-5 py-4 border border-white/10">
              <span className="text-4xl font-black text-white">{averageRating?.toFixed(1) || '0.0'}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${index < Math.round(averageRating || 0) ? 'text-primary fill-primary' : 'text-on-surface-variant'}`}
                    />
                  ))}
                </div>
                <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">{ratingCount || 0} đánh giá</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pl-20 relative">
        <div className="absolute left-7 top-0 bottom-0 w-px bg-white/5"></div>
        {comments.length === 0 ? (
          <div className="glass-dark p-8 rounded-3xl border border-white/10 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-on-surface-variant">Chưa có bình luận nào</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id || index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative"
            >
              <div className="absolute -left-13 top-2 w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <img
                  src={comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user || 'User')}&background=random`}
                  alt={comment.user}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="font-black text-sm text-white uppercase tracking-tight">{comment.user}</h4>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mt-1">{comment.time || comment.createdAt}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{comment.content}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
