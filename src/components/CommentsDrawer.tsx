import React, { useState } from 'react';
import { X, Heart, Send, Smile } from 'lucide-react';
import { CommentItem } from '../types/feed';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentItem[];
  onAddComment: (text: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
}) => {
  const [inputText, setInputText] = useState('');
  const [localComments, setLocalComments] = useState<CommentItem[]>(comments);

  // Sync when prop updates
  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newComment: CommentItem = {
      id: 'c-user-' + Date.now(),
      username: 'you_fashionista',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: inputText.trim(),
      timeAgo: 'เมื่อสักครู่',
      likes: 0,
      isLiked: false,
    };

    setLocalComments([newComment, ...localComments]);
    onAddComment(inputText.trim());
    setInputText('');
  };

  const toggleCommentLike = (id: string) => {
    setLocalComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div
        className="relative w-full max-w-md sm:max-w-lg bg-zinc-950 text-white rounded-t-3xl border-t border-white/10 shadow-2xl flex flex-col h-[70vh] max-h-[600px] z-10 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto my-2 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-zinc-800">
          <span className="text-sm font-semibold text-center flex-1">
            ความคิดเห็น ({localComments.length})
          </span>
          <button
            onClick={onClose}
            aria-label="ปิดกล่องความคิดเห็น"
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {localComments.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              ยังไม่มีความคิดเห็น เป็นคนแรกที่คอมเมนต์เลย!
            </div>
          ) : (
            localComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-300">
                      @{comment.username}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-100 mt-0.5 break-words">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                    <button className="hover:text-zinc-300">ตอบกลับ</button>
                  </div>
                </div>

                {/* Like Comment Heart */}
                <button
                  onClick={() => toggleCommentLike(comment.id)}
                  aria-label="ถูกใจความคิดเห็น"
                  className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-white pt-1 shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      comment.isLiked
                        ? 'fill-[#FE2C55] text-[#FE2C55]'
                        : 'text-zinc-400'
                    }`}
                  />
                  <span className="text-[10px] tabular-nums font-mono">
                    {comment.likes > 0 ? comment.likes : ''}
                  </span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700/50 focus-within:border-zinc-500">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="เพิ่มความคิดเห็นที่สุภาพ..."
              className="bg-transparent border-none text-white text-xs sm:text-sm focus:outline-none flex-1 placeholder:text-zinc-500"
            />
            <button
              type="button"
              aria-label="ใส่อิโมจิ"
              className="text-zinc-400 hover:text-white"
              onClick={() => setInputText((prev) => prev + ' 🔥')}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            aria-label="ส่งความคิดเห็น"
            className="w-9 h-9 rounded-full bg-[#FE2C55] disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-transform active:scale-90"
          >
            <Send className="w-4 h-4 stroke-[2.2]" />
          </button>
        </form>
      </div>
    </div>
  );
};
