import React from 'react';
import { Search } from 'lucide-react';

export type TopNavTab = 'live' | 'following' | 'friends' | 'foryou';

interface TopNavProps {
  activeTab: TopNavTab;
  onTabChange: (tab: TopNavTab) => void;
  onOpenSearch?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
}) => {
  return (
    <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 sm:px-4 pt-7 sm:pt-9 pb-3 text-xs sm:text-sm font-semibold pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent">
      {/* 4 Tabs: LIVE, กำลังติดตาม, เพื่อน, สำหรับคุณ */}
      <div className="flex-1 flex justify-center items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
        {/* 1. เมนู LIVE */}
        <button
          onClick={() => onTabChange('live')}
          className={`relative flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap py-1 ${
            activeTab === 'live'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-gray-300/80 hover:text-white'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="tracking-wide">LIVE</span>
        </button>

        {/* 2. เมนู กำลังติดตาม */}
        <button
          onClick={() => onTabChange('following')}
          className={`transition-all cursor-pointer whitespace-nowrap py-1 ${
            activeTab === 'following'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-gray-300/80 hover:text-white'
          }`}
        >
          กำลังติดตาม
        </button>

        {/* 3. เมนู เพื่อน (Requested) */}
        <button
          onClick={() => onTabChange('friends')}
          className={`relative transition-all cursor-pointer whitespace-nowrap py-1 ${
            activeTab === 'friends'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-gray-300/80 hover:text-white'
          }`}
        >
          <span>เพื่อน</span>
          <span className="absolute top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
        </button>

        {/* 4. เมนู สำหรับคุณ */}
        <button
          onClick={() => onTabChange('foryou')}
          className={`transition-all cursor-pointer whitespace-nowrap py-1 ${
            activeTab === 'foryou'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-gray-300/80 hover:text-white'
          }`}
        >
          สำหรับคุณ
        </button>
      </div>

      {/* Right Search Button */}
      <button
        onClick={onOpenSearch}
        aria-label="ค้นหาวิดีโอหรือสินค้า"
        className="text-gray-300 hover:text-white p-1 ml-1 cursor-pointer transition-colors shrink-0"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
};
