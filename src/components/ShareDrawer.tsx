import React, { useState } from 'react';
import { X, Link2, Download, MessageSquare, Send, Check } from 'lucide-react';
import { VideoClip } from '../types/feed';

interface ShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clip: VideoClip;
}

export const ShareDrawer: React.FC<ShareDrawerProps> = ({
  isOpen,
  onClose,
  clip,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      name: 'คัดลอกลิงก์',
      icon: copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Link2 className="w-5 h-5" />,
      color: copied ? 'bg-emerald-600/30 border-emerald-500' : 'bg-zinc-800 hover:bg-zinc-700',
      action: handleCopyLink,
    },
    {
      name: 'LINE',
      icon: <Send className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-600/20 border-emerald-500/30 hover:bg-emerald-600/30',
      action: () => alert('จำลองการแชร์ไปยังแอป LINE'),
    },
    {
      name: 'Facebook',
      icon: <span className="font-bold text-lg text-blue-400">f</span>,
      color: 'bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30',
      action: () => alert('จำลองการแชร์ไปยัง Facebook'),
    },
    {
      name: 'Messenger',
      icon: <MessageSquare className="w-5 h-5 text-indigo-400" />,
      color: 'bg-indigo-600/20 border-indigo-500/30 hover:bg-indigo-600/30',
      action: () => alert('จำลองการแชร์ไปยัง Messenger'),
    },
    {
      name: 'ดาวน์โหลด',
      icon: <Download className="w-5 h-5 text-zinc-200" />,
      color: 'bg-zinc-800 hover:bg-zinc-700',
      action: () => alert('เริ่มจำลองการดาวน์โหลดวิดีโอแบบไม่มีลายน้ำ...'),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className="relative w-full max-w-md sm:max-w-lg bg-zinc-950 text-white rounded-t-3xl border-t border-white/10 shadow-2xl p-4 z-10 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-sm font-semibold">แชร์ไปยัง</span>
          <button
            onClick={onClose}
            aria-label="ปิดเมนูแชร์"
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video preview mini banner */}
        <div className="flex items-center gap-3 p-3 my-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <img
            src={clip.product?.imageUrl || clip.posterUrl || clip.creator.avatarUrl}
            alt={clip.caption}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-300 font-medium truncate">
              {clip.creator.name}: {clip.caption}
            </p>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
              {clip.musicTitle}
            </p>
          </div>
        </div>

        {/* Share buttons row */}
        <div className="grid grid-cols-5 gap-2 py-3 text-center">
          {shareOptions.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 transition-transform active:scale-95 group-hover:scale-105 ${opt.color}`}
              >
                {opt.icon}
              </div>
              <span className="text-[11px] text-zinc-300 font-medium truncate w-full">
                {opt.name}
              </span>
            </button>
          ))}
        </div>

        {copied && (
          <div className="mt-2 p-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว!</span>
          </div>
        )}
      </div>
    </div>
  );
};
