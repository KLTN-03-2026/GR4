import { Send } from 'lucide-react';

const CommentForm = ({ user, value, setValue, onSubmit, loading }) => {
  return (
    <div className="flex gap-4 md:gap-6 items-start">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface-container-high overflow-hidden border border-white/10 shadow-xl shrink-0">
        <img
          src={
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`
          }
          className="w-full h-full object-cover"
          alt="User avatar"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1 space-y-4">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Chia sẻ cảm nhận của bạn về phim..."
          className="w-full bg-black/20 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 min-h-[100px] resize-none outline-none placeholder:text-on-surface-variant/40 transition-all font-medium custom-scrollbar"
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[10px] md:text-xs font-medium text-on-surface-variant/50 hidden sm:block italic">Bình luận của bạn sẽ được hiển thị công khai</p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !value.trim()}
            className="btn-primary py-3 px-8 text-xs uppercase tracking-[0.2em] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed ml-auto"
          >
            <Send className="w-4 h-4 mr-0.5" />
            {loading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
