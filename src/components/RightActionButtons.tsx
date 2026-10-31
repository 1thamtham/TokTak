import React from 'react';
import { VideoClip } from '../types/feed';

interface RightActionButtonsProps {
  clip: VideoClip;
  onToggleLike: (id: string) => void;
  onToggleSave?: (id: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  isPlaying?: boolean;
}

export const RightActionButtons: React.FC<RightActionButtonsProps> = ({
  clip,
  onToggleLike,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
}) => {
  // Format numbers like TikTok (e.g., 3.1K)
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-4 select-none pointer-events-auto">
      {/* 1. โปรไฟล์ครีเอเตอร์ */}
      <div className="relative mb-1">
        <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-white shadow-md">
          <img
            src={clip.creator.avatarUrl}
            alt={clip.creator.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        {/* Follow + button */}
        <button
          onClick={() => onToggleFollow(clip.creator.id)}
          aria-label={clip.creator.isFollowing ? 'ติดตามแล้ว' : 'กดติดตาม'}
          className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow transition-all active:scale-90 ${
            clip.creator.isFollowing
              ? 'bg-neutral-600 scale-90'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {clip.creator.isFollowing ? '✓' : '+'}
        </button>
      </div>

      {/* 2. ปุ่มไลก์ */}
      <button
        onClick={() => onToggleLike(clip.id)}
        aria-label="ถูกใจ"
        className="flex flex-col items-center text-xs group cursor-pointer focus:outline-none"
      >
        <span
          className={`bg-black/50 p-2.5 rounded-full text-base transition-transform active:scale-75 backdrop-blur-sm ${
            clip.isLiked
              ? 'scale-110 drop-shadow-[0_0_8px_rgba(254,44,85,0.8)]'
              : 'group-hover:scale-105'
          }`}
        >
          {clip.isLiked ? '💖' : '❤️'}
        </span>
        <span className="mt-1 text-white font-medium text-[11px] font-mono tabular-nums drop-shadow">
          {formatNumber(clip.likesCount)}
        </span>
      </button>

      {/* 3. ปุ่มคอมเมนต์ */}
      <button
        onClick={onOpenComments}
        aria-label="ความคิดเห็น"
        className="flex flex-col items-center text-xs group cursor-pointer focus:outline-none"
      >
        <span className="bg-black/50 p-2.5 rounded-full text-base transition-transform active:scale-75 group-hover:scale-105 backdrop-blur-sm">
          💬
        </span>
        <span className="mt-1 text-white font-medium text-[11px] font-mono tabular-nums drop-shadow">
          {formatNumber(clip.commentsCount)}
        </span>
      </button>

      {/* 4. ปุ่มแชร์ */}
      <button
        onClick={onOpenShare}
        aria-label="แชร์"
        className="flex flex-col items-center text-xs group cursor-pointer focus:outline-none"
      >
        <span className="bg-black/50 p-2.5 rounded-full text-base transition-transform active:scale-75 group-hover:scale-105 backdrop-blur-sm">
          ↗️
        </span>
        <span className="mt-1 text-white font-medium text-[11px] font-mono tabular-nums drop-shadow">
          {formatNumber(clip.sharesCount)}
        </span>
      </button>
    </div>
  );
};
