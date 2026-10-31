import React from 'react';

interface BottomTabBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenUpload: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpload,
}) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-md border-t border-gray-800 flex justify-around items-center py-3 text-xs text-gray-400 select-none">
      {/* 1. หน้าแรก */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center transition-colors cursor-pointer ${
          currentTab === 'home' ? 'text-white' : 'hover:text-white'
        }`}
      >
        <span className="text-base">🏠</span>
        <span className="mt-1 text-[11px] font-medium leading-none">หน้าแรก</span>
      </button>

      {/* 2. ร้านค้า (อยู่ระหว่าง หน้าแรก กับ เพื่อน) */}
      <button
        onClick={() => onSelectTab('shop')}
        className={`flex flex-col items-center transition-colors cursor-pointer ${
          currentTab === 'shop' ? 'text-white' : 'hover:text-white'
        }`}
      >
        <span className="text-base">🛍️</span>
        <span className="mt-1 text-[11px] font-medium leading-none">ร้านค้า</span>
      </button>

      {/* 3. เพื่อน */}
      <button
        onClick={() => onSelectTab('friends')}
        className={`flex flex-col items-center transition-colors cursor-pointer ${
          currentTab === 'friends' ? 'text-white' : 'hover:text-white'
        }`}
      >
        <span className="text-base">👥</span>
        <span className="mt-1 text-[11px] font-medium leading-none">เพื่อน</span>
      </button>

      {/* 4. ปุ่มสร้าง (+) */}
      <button
        onClick={onOpenUpload}
        aria-label="สร้างวิดีโอใหม่"
        className="flex flex-col items-center text-white font-bold text-lg cursor-pointer active:scale-95 transition-transform"
      >
        <span className="bg-white text-black px-3 py-0.5 rounded-lg font-bold text-base leading-tight shadow-md">
          +
        </span>
      </button>

      {/* 5. กล่องข้อความ */}
      <button
        onClick={() => onSelectTab('inbox')}
        className={`flex flex-col items-center transition-colors cursor-pointer relative ${
          currentTab === 'inbox' ? 'text-white' : 'hover:text-white'
        }`}
      >
        <div className="relative">
          <span className="text-base">💬</span>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">
            3
          </span>
        </div>
        <span className="mt-1 text-[11px] font-medium leading-none">กล่องข้อความ</span>
      </button>

      {/* 6. โปรไฟล์ */}
      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center transition-colors cursor-pointer ${
          currentTab === 'profile' ? 'text-white' : 'hover:text-white'
        }`}
      >
        <span className="text-base">👤</span>
        <span className="mt-1 text-[11px] font-medium leading-none">โปรไฟล์</span>
      </button>
    </nav>
  );
};
