import React, { useState } from 'react';
import {
  Grid,
  ShoppingBag,
  Package,
  Wrench,
  Sparkles,
  LogOut,
  Plus,
  Film,
  Tag,
  CheckCircle2,
  ChevronRight,
  Truck,
  Heart,
  Share2,
  ShieldCheck,
  Store,
  Camera,
  Pencil,
  Trash2,
  Play,
  MoreVertical,
} from 'lucide-react';
import { VideoClip, Product, OrderItem, UserProfile } from '../types/feed';

interface ProfileViewProps {
  currentUser: UserProfile | null;
  videos: VideoClip[];
  products: Product[];
  orders: OrderItem[];
  onOpenAdmin: () => void;
  onOpenCheckout: (product: Product) => void;
  onSelectVideoClip: (index: number) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenCreateVideo: () => void;
  onOpenSellerRegister: () => void;
  onOpenAddProduct: () => void;
  onOpenEditProfile: (field?: 'avatar' | 'name') => void;
  onDeleteVideo?: (videoId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  videos,
  products,
  orders,
  onOpenAdmin,
  onOpenCheckout,
  onSelectVideoClip,
  onOpenLogin,
  onLogout,
  onOpenCreateVideo,
  onOpenSellerRegister,
  onOpenAddProduct,
  onOpenEditProfile,
  onDeleteVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'my_videos' | 'shop' | 'orders' | 'liked'>('my_videos');
  const [contextMenu, setContextMenu] = useState<{
    videoId: string;
    title: string;
    x: number;
    y: number;
  } | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // If user is not logged in, show the login view
  if (!currentUser || !currentUser.isLoggedIn) {
    return (
      <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto no-scrollbar pb-20 flex flex-col items-center justify-center p-6 text-center">
        {/* Placeholder Avatar with Lock */}
        <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-[#FE2C55] to-amber-500 shadow-2xl mb-4 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center border-2 border-black">
            <span className="text-3xl">👤</span>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-black shadow">
            🔒
          </div>
        </div>

        <h2 className="text-lg font-bold text-white">เข้าสู่ระบบโปรไฟล์ของคุณ</h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
          ล็อกอินผ่าน Google หรือ Gmail เพื่อดูโปรไฟล์ของคุณ สร้างคลิป VIDEO และสมัครขายปักตระกล้าสินค้า
        </p>

        {/* Big Google Login Button */}
        <div className="w-full max-w-xs mt-6 space-y-3">
          <button
            onClick={onOpenLogin}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95 group"
          >
            {/* Google Icon SVG */}
            <div className="w-5 h-5 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold">เข้าสู่ระบบด้วย Google</span>
              <span className="block text-[10px] text-zinc-500 font-mono">goldenrivercity@gmail.com</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform ml-auto" />
          </button>
        </div>

        {/* Perks list */}
        <div className="w-full max-w-xs mt-6 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left text-xs space-y-2.5">
          <div className="font-semibold text-zinc-300 text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>สิทธิประโยชน์เมื่อเข้าสู่ระบบ:</span>
          </div>
          <div className="text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🎬</span>
              <span>สร้างและลงคลิปวิดีโอ (VIDEO) ได้ทันที</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">🛒</span>
              <span>สมัครเป็นสมาชิกขายปักตระกล้าสินค้าในวิดีโอ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🛍️</span>
              <span>โพสต์สินค้าลงร้านค้าหลัก TikTok Shop</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-400">📮</span>
              <span>รองรับระบบขนส่งไปรษณีย์ไทย (EMS) ทันใจ</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Videos created by this user
  const userVideos = videos.filter(
    (v) => v.creator.id === currentUser.id || v.creator.handle === currentUser.handle
  );
  const likedVideos = videos.filter((v) => v.isLiked);

  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto no-scrollbar pb-24">
      
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 sticky top-0 bg-zinc-950/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-white font-mono">{currentUser.handle}</span>
          {currentUser.isSeller && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 font-semibold">
              <span>🛒</span>
              <span>ผู้ขาย & ปักตระกล้า</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {currentUser.isSeller && (
            <button
              onClick={onOpenAdmin}
              aria-label="เปิดระบบหลังบ้าน"
              title="ระบบหลังบ้านร้านค้า"
              className="p-1.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 transition-colors cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onLogout}
            title="ออกจากระบบ"
            className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. User Info Section */}
      <div className="flex flex-col items-center pt-5 px-4 text-center">
        {/* Avatar with click-to-edit interaction */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => onOpenEditProfile('avatar')}
            className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-[#FE2C55] to-amber-500 shadow-xl cursor-pointer group active:scale-95 transition-all"
            title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />

            {/* Hover overlay for changing avatar */}
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
              <Camera className="w-5 h-5 text-white drop-shadow" />
              <span className="text-[9px] font-bold text-white mt-0.5">เปลี่ยนรูป</span>
            </div>

            {/* Camera mini badge */}
            <div className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center border-2 border-black shadow">
              <Camera className="w-3.5 h-3.5" />
            </div>

            {currentUser.isSeller && (
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center border-2 border-black shadow">
                🛒
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenEditProfile('avatar')}
            className="text-[10px] text-purple-400 hover:text-purple-300 font-medium mt-1 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Camera className="w-3 h-3" />
            <span>แตะเพื่อเปลี่ยนรูปโปรไฟล์</span>
          </button>
        </div>

        {/* Name with click-to-edit interaction */}
        <div
          onClick={() => onOpenEditProfile('name')}
          className="mt-1 flex items-center justify-center gap-1.5 cursor-pointer group hover:opacity-90 active:scale-98 transition-all px-2.5 py-1 rounded-xl hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800"
          title="คลิกเพื่อแก้ไขชื่อโปรไฟล์"
        >
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <span className="group-hover:text-purple-300 transition-colors">{currentUser.name}</span>
            {currentUser.isSeller && (
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </h2>
          <span className="p-1 rounded-md bg-zinc-800/80 group-hover:bg-purple-600/30 text-zinc-400 group-hover:text-purple-300 transition-all">
            <Pencil className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onOpenEditProfile('name')}
          className="flex items-center gap-2 mt-0.5 cursor-pointer group"
          title="คลิกเพื่อแก้ไขข้อมูลโปรไฟล์"
        >
          <p className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{currentUser.handle}</p>
          <span className="text-[10px] text-zinc-500 font-mono">• {currentUser.email}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-3 text-center">
          <div>
            <div className="text-sm font-bold text-white font-mono">{currentUser.followingCount}</div>
            <div className="text-[11px] text-zinc-400">กำลังติดตาม</div>
          </div>
          <div className="w-[1px] h-6 bg-zinc-800" />
          <div>
            <div className="text-sm font-bold text-white font-mono">
              {(currentUser.followersCount / 1000).toFixed(1)}K
            </div>
            <div className="text-[11px] text-zinc-400">ผู้ติดตาม</div>
          </div>
          <div className="w-[1px] h-6 bg-zinc-800" />
          <div>
            <div className="text-sm font-bold text-white font-mono">
              {(currentUser.likesCount / 1000).toFixed(1)}K
            </div>
            <div className="text-[11px] text-zinc-400">ถูกใจ</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-zinc-300 mt-2.5 max-w-xs leading-relaxed">
          {currentUser.bio}
        </p>

        {/* 🌟 ACTION SECTION (Requested Logic) */}
        <div className="w-full mt-4 space-y-2.5">
          
          {/* Action A: "สร้าง VIDEO ได้เลย" - Available to all logged-in members */}
          <button
            onClick={onOpenCreateVideo}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-[#FE2C55] to-rose-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Film className="w-4 h-4" />
            <span>🎬 สร้าง VIDEO ทันที (อัด/ลงคลิป)</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>

          {/* Action B: If NOT registered as seller -> "มีปุ่มสมัครสมาชิกขายปักตระกล้า" */}
          {!currentUser.isSeller ? (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/50 via-zinc-900 to-purple-950/40 border border-amber-500/40 text-left space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>สมัครสมาชิกขายปักตระกล้า & เปิดร้านค้า</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    เปิดสิทธิ์ปักตระกล้าสีเหลืองในวิดีโอ & ลงโพสต์สินค้าขายในร้านค้าหลัก
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenSellerRegister}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <span>🛒 สมัครสมาชิกขายปักตระกล้า (เปิดร้านฟรี)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Action C: If registered as seller -> Buttons to Post Product & Create Video with Basket */
            <div className="space-y-2">
              <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-left flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentUser.sellerInfo?.shopName || 'ร้านค้าทางการของคุณ'}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    สถานะ: ครีเอเตอร์ปักตระกล้า & เชื่อมต่อขนส่งไปรษณีย์ไทยแล้ว
                  </div>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium flex items-center gap-1"
                >
                  <Wrench className="w-3 h-3 text-purple-400" />
                  <span>Seller Center</span>
                </button>
              </div>

              {/* Two Quick Buttons: "โพสต์สินค้าลงร้านค้า" + "สร้างคลิปปักตระกล้า" */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenAddProduct}
                  className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>➕ โพสต์สินค้าลงร้านค้า</span>
                </button>
                <button
                  onClick={onOpenCreateVideo}
                  className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>🛒 สร้างคลิปปักตระกล้า</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Profile Tabs */}
      <div className="flex border-b border-zinc-800 mt-5 sticky top-12 bg-zinc-950 z-10">
        <button
          onClick={() => setActiveTab('my_videos')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'my_videos'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>วิดีโอของฉัน ({userVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'shop'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>ร้านค้า ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>ออเดอร์ ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'liked'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>ที่ถูกใจ ({likedVideos.length})</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      <div className="p-3">
        
        {/* TAB 1: USER'S VIDEOS ("ถ้าสร้าง VIDEO ปักตระกล้าจะไปอยู่ที่โปรไฟล์ของตัวเอง") */}
        {activeTab === 'my_videos' && (
          <div>
            {userVideos.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3 bg-zinc-900/40 rounded-2xl border border-zinc-900">
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto text-xl">
                  🎬
                </div>
                <h4 className="text-sm font-bold text-white">ยังไม่มีคลิปวิดีโอที่คุณสร้าง</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  เมื่อคุณสร้างคลิป หรือสร้างวิดีโอปักตระกล้า คลิปทั้งหมดจะถูกนำมาแสดงในหน้านี้
                </p>
                <button
                  onClick={onOpenCreateVideo}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  สร้างวิดีโอแรกของคุณเลย!
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1 text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-300">คลิปของคุณ ({userVideos.length})</span>
                  <span className="text-[10px] text-purple-400 bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>💡</span>
                    <span>คลิกขวาที่วิดีโอเพื่อลบ</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {userVideos.map((vid) => {
                    const globalIdx = videos.findIndex((v) => v.id === vid.id);
                    return (
                      <div
                        key={vid.id}
                        onClick={() => onSelectVideoClip(globalIdx >= 0 ? globalIdx : 0)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const x = Math.min(Math.max(10, e.clientX), window.innerWidth - 200);
                          const y = Math.min(Math.max(10, e.clientY), window.innerHeight - 150);
                          setContextMenu({
                            videoId: vid.id,
                            title: vid.caption || 'วิดีโอของคุณ',
                            x,
                            y,
                          });
                        }}
                        className="group relative aspect-[9/14] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-purple-500 transition-all shadow-md select-none"
                      >
                        <video
                          src={vid.videoUrl}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                          muted
                          playsInline
                        />
                        
                        {/* Pinned Basket Badge on Profile Video Thumbnail */}
                        {vid.product && (
                          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold shadow flex items-center gap-1 border border-amber-300/60">
                            <span>🛒</span>
                            <span className="truncate max-w-[80px]">สั่งซื้อ</span>
                          </div>
                        )}

                        {/* Options button (trigger context menu / delete on mobile or click) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = Math.min(Math.max(10, rect.left - 130), window.innerWidth - 200);
                            const y = Math.min(Math.max(10, rect.bottom + 6), window.innerHeight - 150);
                            setContextMenu({
                              videoId: vid.id,
                              title: vid.caption || 'วิดีโอของคุณ',
                              x,
                              y,
                            });
                          }}
                          title="คลิกขวาหรือกดที่นี่เพื่อลบวิดีโอ"
                          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600/90 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Bottom Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                          <p className="text-[10px] text-zinc-200 line-clamp-1 font-medium">
                            {vid.caption}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                            <span className="text-white font-bold flex items-center gap-0.5">
                              ❤️ {vid.likesCount}
                            </span>
                            {vid.product && (
                              <span className="text-amber-300 font-bold font-mono">
                                ฿{vid.product.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SHOP / PRODUCTS ("แล้วถ้าโพสขายของจะไปอยู่ร้านค้า") */}
        {activeTab === 'shop' && (
          <div className="space-y-2.5">
            {currentUser.isSeller && (
              <button
                onClick={onOpenAddProduct}
                className="w-full p-2.5 rounded-xl border border-dashed border-purple-500/50 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>➕ เพิ่มสินค้าใหม่ลงร้านค้าหลัก (TikTok Shop)</span>
              </button>
            )}

            {products.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-2.5 bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {prod.code && (
                      <span className="text-[10px] bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        {prod.code}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 truncate">{prod.category || 'สินค้าแฟชั่น'}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-0.5">
                    {prod.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xs font-bold text-[#FE2C55] font-mono">
                      ฿{prod.price}
                    </span>
                    <span className="text-[10px] text-zinc-500 line-through font-mono">
                      ฿{prod.originalPrice}
                    </span>
                    <span className="text-[9px] text-zinc-400 ml-auto">
                      คงเหลือ {prod.stock || 50}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenCheckout(prod)}
                  className="px-3 py-1.5 rounded-xl bg-[#FE2C55] hover:bg-[#ff1e4a] text-white text-xs font-semibold shrink-0 cursor-pointer shadow-md"
                >
                  สั่งซื้อ
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-2.5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-xs space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-400">{order.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300'
                        : order.status === 'processing'
                        ? 'bg-blue-500/20 text-blue-300'
                        : order.status === 'shipped'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {order.status === 'pending'
                      ? 'รอจัดส่ง'
                      : order.status === 'processing'
                      ? 'กำลังบรรจุ'
                      : order.status === 'shipped'
                      ? 'ส่งพัสดุแล้ว'
                      : 'จัดส่งสำเร็จ'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{order.productName}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      ไซส์ {order.size} • สี {order.color} • จำนวน {order.quantity} ตัว
                    </div>
                  </div>
                </div>

                {/* Shipping Carrier with Thailand Post badge */}
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Truck className="w-3.5 h-3.5 text-red-400" />
                    <span>{order.shippingCarrier || '📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ)'}</span>
                  </div>
                  {order.trackingNumber && (
                    <span className="font-mono text-purple-300 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded">
                      {order.trackingNumber}
                    </span>
                  )}
                </div>

                <div className="text-zinc-400 text-[11px] flex justify-between items-center pt-1 border-t border-zinc-800">
                  <span>ผู้รับ: {order.customerName} ({order.phone})</span>
                  <span className="text-[#FE2C55] font-bold font-mono text-xs">
                    ฿{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: LIKED VIDEOS */}
        {activeTab === 'liked' && (
          <div className="grid grid-cols-3 gap-1.5">
            {likedVideos.map((vid) => {
              const globalIdx = videos.findIndex((v) => v.id === vid.id);
              return (
                <div
                  key={vid.id}
                  onClick={() => onSelectVideoClip(globalIdx >= 0 ? globalIdx : 0)}
                  className="group relative aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden cursor-pointer"
                >
                  <video
                    src={vid.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-bold text-white flex items-center gap-0.5">
                      ❤️ {(vid.likesCount / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* RIGHT-CLICK CONTEXT MENU (เมนูคลิกขวาที่วิดีโอ) */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/20"
            onClick={() => setContextMenu(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu(null);
            }}
          />
          <div
            className="fixed z-50 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl py-1.5 w-48 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 border-b border-zinc-800 text-[10px] text-zinc-400 font-medium truncate">
              🎬 {contextMenu.title}
            </div>
            
            <button
              onClick={() => {
                const globalIdx = videos.findIndex((v) => v.id === contextMenu.videoId);
                onSelectVideoClip(globalIdx >= 0 ? globalIdx : 0);
                setContextMenu(null);
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-purple-400" />
              <span>ดู / เล่นคลิปนี้</span>
            </button>

            <button
              onClick={() => {
                setVideoToDelete({
                  id: contextMenu.videoId,
                  title: contextMenu.title,
                });
                setContextMenu(null);
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors font-semibold cursor-pointer border-t border-zinc-800/60"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>ลบวิดีโอ</span>
            </button>
          </div>
        </>
      )}

      {/* CONFIRM DELETE MODAL (กล่องยืนยันการลบวิดีโอ) */}
      {videoToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-5 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ต้องการลบวิดีโอนี้ใช่หรือไม่?</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 px-2 bg-zinc-950/60 py-2 rounded-xl border border-zinc-800/80 my-2">
                "{videoToDelete.title}"
              </p>
              <p className="text-[11px] text-zinc-500">
                เมื่อลบแล้ว วิดีโอจะถูกนำออกจากระบบและหน้าฟีดของแอปพลิเคชัน
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteVideo) {
                    onDeleteVideo(videoToDelete.id);
                  }
                  setVideoToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-900/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ยืนยันลบวิดีโอ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
