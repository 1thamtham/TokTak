import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types/feed';
import { ShoppingBag, Heart, Share2, Send, X, Flame, Gift, Sparkles } from 'lucide-react';

interface LiveStreamViewProps {
  product: Product;
  onOpenCheckout: (product: Product) => void;
  onClose: () => void;
}

interface LiveChat {
  id: string;
  user: string;
  text: string;
  isSystem?: boolean;
}

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({
  product,
  onOpenCheckout,
  onClose,
}) => {
  const [likes, setLikes] = useState<number>(14200);
  const [comments, setComments] = useState<LiveChat[]>([
    { id: '1', user: 'fah_bkk', text: 'ผ้านุ่มใส่สบายมากค่ะ สั่งรอบที่สองแล้ว' },
    { id: '2', user: 'System', text: '🎉 @nook_shop สั่งซื้อ เสื้อยืดสตรีทแวร์ 1 ตัว', isSystem: true },
    { id: '3', user: 'ball_street', text: 'มีไซส์ XL พร้อมส่งไหมครับ' },
    { id: '4', user: 'mook_29', text: 'ลายเท่มาก เก็บโค้ดลด ฿50 ได้ที่ไหนคะ' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-simulate new incoming chat comments
  useEffect(() => {
    const mockFeed = [
      { user: 'ploy_ch', text: 'จัดส่งกี่วันถึงกรุงเทพคะ' },
      { user: 'System', text: '⚡️ เหลือสินค้าโปรโมชั่นในไลฟ์อีก 8 ตัวเท่านั้น!', isSystem: true },
      { user: 'korn_vibe', text: 'กดสั่งเรียบร้อยครับ รอรับของเลย' },
      { user: 'mind_fashion', text: 'ทรงเสื้อโอเวอร์ไซส์สวยมาก' },
      { user: 'System', text: '🔥 @tum_rider สั่งซื้อเสื้อยืดกราฟิก 2 ตัว', isSystem: true },
    ];

    let i = 0;
    const interval = setInterval(() => {
      const nextMsg = mockFeed[i % mockFeed.length];
      setComments((prev) => [...prev.slice(-15), { id: String(Date.now()), ...nextMsg }]);
      i++;
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: String(Date.now()), user: 'คุณ (ฉัน)', text: inputMsg.trim() },
    ]);
    setInputMsg('');
  };

  const handleHeartClick = () => {
    setLikes((l) => l + 1);
    const newHeart = { id: Date.now(), left: 60 + Math.random() * 30 };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden flex flex-col justify-between select-none">
      {/* Background Live Video Stream */}
      <div className="absolute inset-0 z-0">
        <video
          src="https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-a-red-t-shirt-skateboarding-41444-large.mp4"
          poster={product.imageUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Floating Hearts Animation */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          style={{ right: `${h.left}px`, bottom: '90px' }}
          className="absolute z-30 pointer-events-none text-red-500 animate-[float-heart_1.2s_ease-out_forwards] text-3xl"
        >
          ❤️
        </div>
      ))}

      {/* 1. Top Header: Host info + Viewers + Close */}
      <div className="relative z-20 flex items-center justify-between px-3 pt-12 pb-2">
        {/* Host Pill */}
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full pl-1 pr-3 py-1 border border-white/20">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Host"
            className="w-7 h-7 rounded-full object-cover border border-white/40"
          />
          <div className="leading-tight">
            <div className="text-[11px] font-bold text-white flex items-center gap-1">
              <span>CyberStore</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="text-[9px] text-zinc-300 font-mono">14.2K ถูกใจ</div>
          </div>
          <button className="ml-1 text-[10px] bg-[#FE2C55] text-white font-bold px-2 py-0.5 rounded-full active:scale-95 transition-transform">
            + ติดตาม
          </button>
        </div>

        {/* Viewers & Close Button */}
        <div className="flex items-center gap-2">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 text-[11px] font-semibold text-white/90 border border-white/10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            <span className="text-[10px] font-bold text-white">1,428 คน</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white border border-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ranking / Topic Badge */}
      <div className="relative z-20 px-3 flex items-center gap-1.5">
        <div className="inline-flex items-center gap-1 bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
          <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>🏆 อันดับ 1 เสื้อยืดแฟชั่นยอดนิยม</span>
        </div>
      </div>

      {/* 2. Bottom Live Interactions (Chat & Pinned Product) */}
      <div className="relative z-20 p-3 pb-20 flex flex-col gap-2.5 mt-auto">
        {/* Live Chat Message Area */}
        <div
          ref={chatScrollRef}
          className="max-h-36 overflow-y-auto no-scrollbar space-y-1.5 text-xs pr-12"
        >
          {comments.map((c) => (
            <div
              key={c.id}
              className={`rounded-lg px-2.5 py-1 max-w-[280px] backdrop-blur-md inline-block ${
                c.isSystem
                  ? 'bg-purple-900/60 border border-purple-500/40 text-purple-200 text-[11px] font-medium'
                  : 'bg-black/50 text-white border border-white/10'
              }`}
            >
              <span className="text-zinc-400 font-semibold mr-1.5">{c.user}:</span>
              <span className="leading-snug">{c.text}</span>
            </div>
          ))}
        </div>

        {/* 🏷️ LIVE PINNED PRODUCT CARD (ตะกร้าสินค้าในไลฟ์) */}
        <div className="bg-white text-zinc-950 rounded-xl p-2.5 flex items-center justify-between shadow-2xl border border-white/40 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-100 border border-zinc-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-0 left-0 bg-[#FE2C55] text-white text-[8px] font-black px-1 rounded-br">
                LIVE
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1 rounded">
                  ลดพิเศษในไลฟ์
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">{product.code}</span>
              </div>
              <h5 className="text-xs font-bold text-zinc-900 truncate mt-0.5">
                {product.name}
              </h5>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-black text-[#FE2C55] font-mono">
                  ฿{product.price}
                </span>
                <span className="text-[10px] text-zinc-400 line-through font-mono">
                  ฿{product.originalPrice}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenCheckout(product)}
            className="px-3.5 py-2 rounded-lg bg-[#FE2C55] hover:bg-[#ff1e4a] text-white font-bold text-xs shrink-0 cursor-pointer shadow-md shadow-[#FE2C55]/30 active:scale-95 transition-transform"
          >
            ซื้อทันที
          </button>
        </div>

        {/* Bottom Input & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Chat Input */}
          <form onSubmit={handleSendComment} className="flex-1 flex items-center">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="พูดคุยในไลฟ์..."
              className="w-full bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-white/50"
            />
          </form>

          {/* Product Basket Button */}
          <button
            onClick={() => onOpenCheckout(product)}
            className="relative w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-[#FE2C55] text-white text-[9px] font-bold px-1 rounded-full">
              1
            </span>
          </button>

          {/* Heart Button */}
          <button
            onClick={handleHeartClick}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-red-500 cursor-pointer active:scale-125 transition-transform"
          >
            <Heart className="w-4 h-4 fill-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
