import { Send } from 'lucide-react';

const CommentForm = ({ value, setValue, onSubmit, loading }) => {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden border border-white/5 shadow-xl shrink-0"></div>
      <div className="flex-1 space-y-4">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Chia sẻ cảm nhận của bạn về phim..."
          className="w-full bg-surface-container-low border border-white/5 rounded-2xl p-5 text-base focus:ring-2 focus:ring-primary/20 min-h-30 resize-none outline-none placeholder:text-on-surface-variant/40 transition-all font-medium"
        />
        <div className="flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="btn-primary py-3 px-8 text-xs uppercase tracking-[0.2em] disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
