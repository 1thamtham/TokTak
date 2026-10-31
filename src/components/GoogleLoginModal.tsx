import React, { useState } from 'react';
import { Mail, Check, X, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types/feed';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('goldenrivercity@gmail.com');
  const [displayName, setDisplayName] = useState('Golden River Creator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleQuickLogin = (selectedEmail?: string, selectedName?: string) => {
    setIsSubmitting(true);
    const userEmail = selectedEmail || email;
    const userName = selectedName || displayName || userEmail.split('@')[0];
    const userHandle = `@${userEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()}`;

    setTimeout(() => {
      const newUser: UserProfile = {
        id: 'usr_' + Date.now(),
        email: userEmail,
        name: userName,
        handle: userHandle,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        bio: 'สายแฟชั่น & ครีเอเตอร์ TikTok Thailand ✨ ยินดีต้อนรับสู่โปรไฟล์ของฉัน',
        followingCount: 52,
        followersCount: 1420,
        likesCount: 18900,
        isLoggedIn: true,
        isSeller: false, // ยังไม่ได้สมัครสมาชิกขายปักตระกล้า
      };

      localStorage.setItem('tokshop_user_profile', JSON.stringify(newUser));
      setIsSubmitting(false);
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Top Header */}
        <div className="relative p-5 pb-3 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Google Icon SVG */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <div>
              <h3 className="font-bold text-sm text-white">ลงชื่อเข้าใช้ Google</h3>
              <p className="text-[10px] text-zinc-400">เข้าสู่ระบบเพื่อดูโปรไฟล์และสร้างวิดีโอ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Quick 1-Click Login Account for user */}
          <div className="bg-gradient-to-r from-purple-950/40 via-zinc-800/80 to-purple-950/40 p-3.5 rounded-2xl border border-purple-500/30">
            <div className="text-[11px] font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>บัญชีแนะนำสำหรับคุณ</span>
            </div>
            <button
              onClick={() => handleGoogleQuickLogin('goldenrivercity@gmail.com', 'Golden River City')}
              disabled={isSubmitting}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 transition-all shadow-md group cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow">
                  G
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Golden River City</div>
                  <div className="text-[11px] text-zinc-500 font-mono">goldenrivercity@gmail.com</div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider">หรือระบุ Gmail ของคุณ</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Custom Gmail Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                อีเมล Gmail / Google Account
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                ชื่อที่แสดง (Display Name)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น สมชาย สตรีทสไตล์"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={() => handleGoogleQuickLogin()}
            disabled={isSubmitting || !email}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                กำลังเข้าสู่ระบบ Google...
              </span>
            ) : (
              <span>เข้าสู่ระบบด้วย Gmail บัญชีนี้</span>
            )}
          </button>

          {/* Security note */}
          <div className="flex items-start gap-2 pt-1 text-[10px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              เข้าสู่ระบบปลอดภัย ข้อมูลโปรไฟล์ของคุณจะถูกจดจำ เมื่อล็อกอินแล้วสามารถสร้าง VIDEO และสมัครสมาชิกขายปักตระกล้าได้ทันที
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
