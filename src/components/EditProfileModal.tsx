import React, { useState } from 'react';
import { Camera, X, Check, Upload, Sparkles, User, AtSign, FileText } from 'lucide-react';
import { UserProfile } from '../types/feed';

interface EditProfileModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  initialFocusField?: 'avatar' | 'name';
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
}

const PRESET_AVATARS = [
  {
    label: 'Streetwear Model',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Vintage Denim',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Neon Aesthetic',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Minimalist Clean',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Urban Jacket',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Graphic Creator',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  currentUser,
  initialFocusField = 'avatar',
  onClose,
  onSave,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อโปรไฟล์');
      return;
    }

    setIsSubmitting(true);
    let formattedHandle = handle.trim();
    if (!formattedHandle.startsWith('@')) {
      formattedHandle = `@${formattedHandle}`;
    }

    setTimeout(() => {
      const updatedUser: UserProfile = {
        ...currentUser,
        avatarUrl,
        name: name.trim(),
        handle: formattedHandle,
        bio: bio.trim(),
      };

      localStorage.setItem('tokshop_user_profile', JSON.stringify(updatedUser));
      setIsSubmitting(false);
      onSave(updatedUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/95">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-[#FE2C55] flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">แก้ไขและปรับแต่งโปรไฟล์</h3>
              <p className="text-[10px] text-zinc-400">เปลี่ยนรูปโปรไฟล์ ชื่อผู้ใช้ และประวัติของคุณ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* 1. Avatar Preview & Change Action */}
          <div className="flex flex-col items-center text-center pb-2">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-[#FE2C55] to-amber-500 shadow-xl overflow-hidden">
                <img
                  src={avatarUrl}
                  alt="Preview Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-black"
                />
              </div>

              {/* Camera Overlay on Avatar */}
              <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-medium transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>เปลี่ยนรูป</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Bottom camera button badge */}
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center border-2 border-black shadow cursor-pointer transition-transform active:scale-90">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              คลิกที่รูปหรือกดไอคอนกล้องเพื่ออัปโหลดรูปภาพใหม่จากเครื่อง
            </p>
          </div>

          {/* Quick preset avatars */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>หรือเลือกรูปโปรไฟล์สำเร็จรูปสไตล์ครีเอเตอร์:</span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {PRESET_AVATARS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setAvatarUrl(preset.url)}
                  className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                    avatarUrl === preset.url
                      ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105'
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-800 my-2" />

          {/* 2. Name & Handle */}
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>ชื่อโปรไฟล์ (Display Name) *</span>
              </label>
              <input
                type="text"
                required
                autoFocus={initialFocusField === 'name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น Golden River Official"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-pink-400" />
                <span>ชื่อผู้ใช้ (Username / Handle) *</span>
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>คำอธิบายโปรไฟล์ (Bio)</span>
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="เขียนแนะนำตัว สไตล์การแต่งตัว หรือช่องทางการติดต่อ..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs cursor-pointer transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#FE2C55] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังบันทึก...
                </span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
