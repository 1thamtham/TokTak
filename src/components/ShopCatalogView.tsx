import React, { useState } from 'react';
import { Search, ShoppingBag, Flame, Sparkles, Filter, ChevronRight, Tag } from 'lucide-react';
import { Product } from '../types/feed';

interface ShopCatalogViewProps {
  products: Product[];
  onOpenCheckout: (product: Product) => void;
}

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  products,
  onOpenCheckout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'graphic', label: 'เสื้อยืดกราฟิก' },
    { id: 'vintage', label: 'ฟอกวินเทจ' },
    { id: 'japan', label: 'สไตล์ญี่ปุ่น' },
    { id: 'basic', label: 'เบสิก & ฮู้ด' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'graphic') return p.category?.includes('กราฟิก') || p.id.includes('cyber');
    if (selectedCategory === 'vintage') return p.category?.includes('วินเทจ') || p.id.includes('neon') || p.id.includes('moto');
    if (selectedCategory === 'japan') return p.category?.includes('ญี่ปุ่น') || p.id.includes('wave');
    if (selectedCategory === 'basic') return p.category?.includes('เบสิก') || p.category?.includes('ฮู้ด') || p.code === 'P001' || p.code === 'P002';
    return true;
  });

  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto no-scrollbar pb-20 pt-3 px-3 sm:px-4">
      {/* 1. Shop Header & Search */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเสื้อยืด ลายกราฟิก สตรีทแวร์..."
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
        <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
          <Filter className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Flash Sale Promotional Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900 via-rose-950 to-zinc-950 p-4 border border-rose-500/30 mb-4 shadow-lg">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
          <span>TikTok Shop Flash Sale ⚡️</span>
        </div>
        <h2 className="text-base sm:text-lg font-black text-white leading-tight">
          ลดกระหน่ำสูงสุด 44% ทุกคอลเลกชัน
        </h2>
        <p className="text-xs text-zinc-300 mt-1">
          แจกคูปองส่งฟรี + ลดเพิ่ม ฿50 เมื่อสั่งซื้อวันนี้
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-rose-300 border border-rose-500/40">
          <Tag className="w-3 h-3" />
          <span>โค้ดลด: TIKTOK50</span>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group relative bg-zinc-900/90 rounded-2xl border border-zinc-800/80 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md"
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
              <img
                src={prod.imageUrl}
                alt={prod.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80';
                }}
              />
              {prod.discountPercent > 0 && (
                <span className="absolute top-2 left-2 bg-[#FE2C55] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                  -{prod.discountPercent}%
                </span>
              )}
              {prod.code && (
                <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-zinc-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                  {prod.code}
                </span>
              )}
            </div>

            {/* Product Meta */}
            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                  {prod.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-1">
                  <span>⭐ {prod.rating.toFixed(1)}</span>
                  <span>·</span>
                  <span>{prod.salesCount}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-2.5 pt-2 border-t border-zinc-800/80">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-[#FE2C55] font-mono tabular-nums">
                    ฿{prod.price.toLocaleString()}
                  </span>
                  {prod.originalPrice > prod.price && (
                    <span className="text-[10px] text-zinc-500 line-through font-mono tabular-nums">
                      ฿{prod.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onOpenCheckout(prod)}
                  className="mt-2 w-full py-1.5 px-2 rounded-xl bg-[#FE2C55] hover:bg-[#ff1e4a] text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm shadow-[#FE2C55]/20 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>สั่งซื้อ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 text-zinc-500 text-xs">
          ไม่พบสินค้าที่ตรงกับการค้นหา
        </div>
      )}
    </div>
  );
};
