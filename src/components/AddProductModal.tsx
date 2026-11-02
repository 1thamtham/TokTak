import React, { useState, useRef } from 'react';
import {
  ShoppingBag,
  X,
  CheckCircle,
  Image as ImageIcon,
  Truck,
  Sparkles,
  Upload,
  Trash2,
  Plus,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { Product, UserProfile, Category } from '../types/feed';
import { INITIAL_CATEGORIES, detectCategoryFromName } from '../data/mockFeed';

interface AddProductModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  categories?: Category[];
  onAddCategory?: (cat: Category) => void;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const PRESET_PRODUCT_IMAGES = [
  {
    name: 'เสื้อยืดสตรีทฟอกดำ',
    url: '/src/assets/images/shirt_streetwear_black_1793336644572.jpg',
  },
  {
    name: 'เสื้อยืดมินิมอลครีม',
    url: '/src/assets/images/shirt_cream_minimal_1793336644442.jpg',
  },
  {
    name: 'เสื้อนีออนวินเทจ',
    url: '/src/assets/images/shirt_acidwash_neon_1793336644924.jpg',
  },
  {
    name: 'เสื้อไบเกอร์โอลีฟ',
    url: '/src/assets/images/shirt_vintage_olive_1793336645622.jpg',
  },
  {
    name: 'เสื้อยืดขาวคลาสสิก',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
  },
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  currentUser,
  categories = INITIAL_CATEGORIES,
  onAddCategory,
  onClose,
  onAddProduct,
}) => {
  const [sku, setSku] = useState('P00' + (Math.floor(Math.random() * 90) + 10));
  const [name, setName] = useState('');
  const [price, setPrice] = useState('390');
  const [originalPrice, setOriginalPrice] = useState('690');
  const [stock, setStock] = useState('100');
  
  // Category state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id || 'CAT01'
  );
  const [category, setCategory] = useState<string>(
    categories[0]?.name || 'เสื้อผ้าและแฟชั่น'
  );
  const [autoMatchedCat, setAutoMatchedCat] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');

  // ฟังก์ชันอัจฉริยะ: วิเคราะห์ชื่อสินค้าแล้วเลือกหมวดหมู่ให้อัตโนมัติ (Smart Auto-Category)
  const handleNameChange = (val: string) => {
    setName(val);
    const detected = detectCategoryFromName(val, categories);
    if (detected) {
      setSelectedCategoryId(detected.categoryId);
      setCategory(detected.categoryName);
      setAutoMatchedCat(detected.categoryId);
    } else {
      setAutoMatchedCat(null);
    }
  };
  
  // Gallery images & selection
  const [galleryImages, setGalleryImages] = useState<string[]>(
    PRESET_PRODUCT_IMAGES.map((p) => p.url)
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [deletePrompt, setDeletePrompt] = useState<{
    index: number;
    url: string;
    source: 'right-click' | 'long-press';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [description, setDescription] = useState(
    'ผ้า Cotton 100% หนา 240g งานพิมพ์คุณภาพสูง ทรงโอเวอร์ไซส์ ใส่สบาย ไม่หด ไม่ย้วย'
  );
  const [productColors, setProductColors] = useState<string[]>(['สีดำ (Black)', 'สีขาว (White)']);
  const [productSizes, setProductSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'Oversized']);
  const [customColorInput, setCustomColorInput] = useState<string>('');
  const [customSizeInput, setCustomSizeInput] = useState<string>('');
  const [shippingCarrier, setShippingCarrier] = useState('📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleColor = (color: string) => {
    setProductColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleToggleSize = (size: string) => {
    setProductSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAddCustomColor = () => {
    const trimmed = customColorInput.trim();
    if (trimmed && !productColors.includes(trimmed)) {
      setProductColors((prev) => [...prev, trimmed]);
      setCustomColorInput('');
    }
  };

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (trimmed && !productSizes.includes(trimmed)) {
      setProductSizes((prev) => [...prev, trimmed]);
      setCustomSizeInput('');
    }
  };

  // Mobile Long-Press handlers
  const handleTouchStart = (index: number, url: string) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(50);
        } catch {
          // ignore
        }
      }
      setDeletePrompt({
        index,
        url,
        source: 'long-press',
      });
    }, 500); // 500ms press & hold
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Computer Right-Click handler
  const handleContextMenu = (index: number, url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletePrompt({
      index,
      url,
      source: 'right-click',
    });
  };

  // Delete image function
  const handleDeleteImage = (indexToDelete: number) => {
    if (galleryImages.length <= 1) {
      alert('สินค้าจำเป็นต้องมีรูปภาพอย่างน้อย 1 รูป');
      setDeletePrompt(null);
      return;
    }
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    if (selectedImageIndex === indexToDelete) {
      setSelectedImageIndex(0);
    } else if (selectedImageIndex > indexToDelete) {
      setSelectedImageIndex((prev) => prev - 1);
    }
    setDeletePrompt(null);
  };

  // Upload from computer files or phone gallery
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newUrls: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newUrls.push(url);
    });
    setGalleryImages((prev) => [...newUrls, ...prev]);
    setSelectedImageIndex(0);
    e.target.value = '';
  };

  // Quick add category
  const handleQuickAddCategory = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) {
      alert('กรุณากรอกชื่อหมวดหมู่');
      return;
    }
    const newId = `CAT${String(categories.length + 1).padStart(2, '0')}`;
    const createdCat: Category = {
      id: newId,
      name: newCatName.trim(),
      icon: newCatIcon.trim() || '📦',
    };
    if (onAddCategory) {
      onAddCategory(createdCat);
    }
    setSelectedCategoryId(newId);
    setCategory(createdCat.name);
    setNewCatName('');
    setIsQuickAddOpen(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('กรุณากรอกชื่อสินค้าและราคา');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const numPrice = Number(price) || 390;
      const numOrig = Number(originalPrice) || numPrice * 1.5;
      const discount = Math.round(((numOrig - numPrice) / numOrig) * 100);

      const primaryImage =
        galleryImages[selectedImageIndex] || galleryImages[0] || PRESET_PRODUCT_IMAGES[0].url;

      const newProduct: Product = {
        id: 'prod-' + Date.now(),
        code: sku.trim(),
        name: name.trim(),
        price: numPrice,
        originalPrice: numOrig,
        discountPercent: discount > 0 ? discount : 30,
        rating: 5.0,
        salesCount: 'เพิ่งลงขายใหม่',
        stock: Number(stock) || 50,
        category,
        categoryId: selectedCategoryId,
        imageUrl: primaryImage,
        galleryImages: galleryImages,
        colors: productColors.length > 0 ? productColors : ['สีดำ (Black)', 'สีขาว (White)'],
        sizes: productSizes.length > 0 ? productSizes : ['S', 'M', 'L', 'XL'],
        description,
        shippingCarrier,
      };

      onAddProduct(newProduct);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/95">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">โพสต์สินค้าใหม่ลงร้านค้า</h3>
              <p className="text-[11px] text-zinc-400">
                สินค้าจะไปแสดงในหน้าร้านค้า TikTok Shop และพร้อมให้ปักตระกล้า
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          <div className="p-2.5 bg-purple-950/30 border border-purple-500/30 rounded-xl flex items-center gap-2 text-purple-300 text-[11px]">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              ผู้ลงขาย: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                รหัสสินค้า (SKU) *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="P007"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <label className="block font-medium text-zinc-300">
                    หมวดหมู่สินค้า *
                  </label>
                  {autoMatchedCat && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 animate-in fade-in">
                      ✨ เลือกอัตโนมัติแล้ว
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                  className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isQuickAddOpen ? 'ปิด' : 'เพิ่มหมวดหมู่'}</span>
                </button>
              </div>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  const selId = e.target.value;
                  setSelectedCategoryId(selId);
                  setAutoMatchedCat(null);
                  const found = categories.find((c) => c.id === selId);
                  if (found) {
                    setCategory(found.name);
                  }
                }}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white outline-none focus:border-purple-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name} ({cat.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* กล่องเพิ่มหมวดหมู่ด่วน */}
          {isQuickAddOpen && (
            <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-200">
                  ✨ เพิ่มหมวดหมู่ใหม่ลงในระบบหลังบ้าน:
                </span>
                <span className="text-[10px] text-zinc-400">
                  รหัสใหม่: CAT{String(categories.length + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  placeholder="📦"
                  maxLength={4}
                  className="w-12 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-center text-sm outline-none focus:border-purple-400"
                  title="ไอคอนหมวดหมู่ (Emoji)"
                />
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="เช่น ของเล่น & โมเดลสะสม..."
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-purple-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleQuickAddCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  บันทึก
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-zinc-300 mb-1">
              ชื่อสินค้า (พิมพ์เพื่อจับคู่หมวดหมู่อัตโนมัติ) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="ลองพิมพ์ เช่น ลิปสติก, หูฟังบลูทูธ, อาหารแมว, เสื้อยืด..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                ราคาขาย (บาท) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="390"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                ราคาปกติก่อนลด (บาท)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="690"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                จำนวนสต็อก (ชิ้น)
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Picture Selection & Interactive Gallery */}
          <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-zinc-200 text-xs">
                  รูปภาพสินค้า & แกลเลอรี ({galleryImages.length} รูป)
                </span>
              </div>
              <span className="text-[10px] text-purple-400 font-medium">
                ⭐ รูปที่ {selectedImageIndex + 1} เป็นภาพปกหลัก
              </span>
            </div>

            {/* Hidden file input supporting multiple files */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />

            {/* Main Interactive Preview Card: Tap/Click opens gallery on PC & Mobile */}
            <div className="relative aspect-video sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700/80 group">
              <img
                src={galleryImages[selectedImageIndex] || PRESET_PRODUCT_IMAGES[0].url}
                alt="รูปสินค้าหลัก"
                className="w-full h-full object-contain bg-black/60"
              />

              {/* Overlay button / banner: clicking on PC or tapping on mobile opens device gallery */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/45 hover:bg-black/60 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100 backdrop-blur-[2px]"
                title="แตะหรือคลิกเพื่อเลือกรูปจากแกลเลอรี (คอมพิวเตอร์ / มือถือ)"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mb-1.5 shadow-xl group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-xs">
                  แตะเพื่อไปที่ แกลเลอรีรูปภาพ
                </span>
                <span className="text-[10px] text-zinc-300 mt-0.5">
                  (คอมพิวเตอร์: เลือกไฟล์ในเครื่อง | มือถือ: เปิดคลังรูปภาพในมือถือ)
                </span>
              </div>

              {/* Cover badge */}
              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-md pointer-events-none flex items-center gap-1">
                <span>⭐</span>
                <span>ภาพปกหลักในร้านค้า</span>
              </div>
            </div>

            {/* Instruction Banner explaining Computer Right-Click and Mobile Long-Press */}
            <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-purple-300">
                <Monitor className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span><strong>คอมพิวเตอร์:</strong> คลิกขวาที่รูปภาพเพื่อลบ</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-300">
                <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span><strong>มือถือ:</strong> แตะรูปภาพแช่ไว้เพื่อลบ</span>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>แตะเลือกรูป / คลิกขวาหรือกดแช่เพื่อลบ:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มรูปจากแกลเลอรี</span>
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar items-center">
                {/* Upload Action Tile */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-xl border border-dashed border-purple-500/60 hover:border-purple-400 bg-purple-950/30 hover:bg-purple-950/50 flex flex-col items-center justify-center shrink-0 text-purple-300 cursor-pointer transition-colors active:scale-95"
                  title="ไปที่แกลเลอรีรูปภาพของคอมพิวเตอร์หรือมือถือ"
                >
                  <Upload className="w-4 h-4 mb-0.5 text-purple-400" />
                  <span className="text-[9px] font-bold">+ แกลเลอรี</span>
                </button>

                {/* Image Thumbnails with Right-Click and Long-Press Handlers */}
                {galleryImages.map((url, idx) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      onContextMenu={(e) => handleContextMenu(idx, url, e)}
                      onTouchStart={() => handleTouchStart(idx, url)}
                      onTouchEnd={handleTouchEnd}
                      onTouchMove={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all select-none group/item ${
                        isSelected
                          ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105 z-10'
                          : 'border-zinc-800 opacity-70 hover:opacity-100 hover:border-zinc-600'
                      }`}
                      title="แตะเลือกรูป | คลิกขวา (คอม) หรือกดแช่ (มือถือ) เพื่อลบ"
                    >
                      <img
                        src={url}
                        alt={`รูปภาพที่ ${idx + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                      />

                      {isSelected && (
                        <div className="absolute bottom-0 inset-x-0 bg-purple-600 text-white text-[8px] font-bold text-center py-0.5">
                          ภาพปก
                        </div>
                      )}

                      {/* Hover / Tap Quick Delete Icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletePrompt({
                            index: idx,
                            url,
                            source: 'right-click',
                          });
                        }}
                        title="ลบรูปภาพนี้"
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-75 sm:opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer shadow-md hover:scale-110"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipping system */}
          <div>
            <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-red-400" />
              <span>ระบบขนส่งที่รองรับ (เชื่อมระบบอัตโนมัติ)</span>
            </label>
            <select
              value={shippingCarrier}
              onChange={(e) => setShippingCarrier(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white outline-none focus:border-purple-500"
            >
              <option value="📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ)">📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ 1-2 วัน)</option>
              <option value="📮 ไปรษณีย์ไทย (ลงทะเบียน R)">📮 ไปรษณีย์ไทย (ลงทะเบียน R 3-5 วัน)</option>
              <option value="⚡ Flash Express (เข้ารับพัสดุถึงบ้าน)">⚡ Flash Express</option>
              <option value="📦 Kerry Express">📦 Kerry Express</option>
            </select>
          </div>

          {/* Product Options: Colors (สี) and Sizes/Numbers (เบอร์ / ไซส์) */}
          <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800 space-y-3.5">
            {/* Color selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                  <span>🎨 ตัวเลือก สี (Colors)</span>
                  <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                    เลือกแล้ว {productColors.length} สี
                  </span>
                </label>
                <span className="text-[10px] text-zinc-500">ติ๊กเลือกสี หรือพิมพ์เพิ่มเอง</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  { name: 'สีดำ (Black)', dot: 'bg-black border border-white/30' },
                  { name: 'สีขาว (White)', dot: 'bg-white border border-gray-400' },
                  { name: 'สีเทา (Grey)', dot: 'bg-zinc-500' },
                  { name: 'สีแดง (Red)', dot: 'bg-red-500' },
                  { name: 'สีกรม/น้ำเงิน (Navy)', dot: 'bg-blue-800' },
                  { name: 'สีเขียวโอลีฟ (Olive)', dot: 'bg-emerald-800' },
                  { name: 'สีครีม/เบจ (Beige)', dot: 'bg-amber-100' },
                  { name: 'สีชมพู (Pink)', dot: 'bg-pink-400' },
                  { name: 'สีน้ำตาล (Brown)', dot: 'bg-amber-900' },
                ].map((col) => (
                  <label
                    key={col.name}
                    className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-lg text-xs cursor-pointer select-none transition-all ${
                      productColors.includes(col.name)
                        ? 'bg-purple-900/40 border-purple-400 text-purple-200 font-bold'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={productColors.includes(col.name)}
                      onChange={() => handleToggleColor(col.name)}
                      className="accent-purple-500 cursor-pointer"
                    />
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.dot}`} />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  placeholder="พิมพ์ชื่อสีที่ต้องการ เช่น ส้มอิฐ, ม่วงพาสเทล..."
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomColor();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  + เพิ่มสี
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-800" />

            {/* Sizes & Numbers selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                  <span>📏 ตัวเลือก เบอร์ และ ไซส์ (Sizes & Numbers)</span>
                  <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                    เลือกแล้ว {productSizes.length} รายการ
                  </span>
                </label>
                <span className="text-[10px] text-zinc-500">รองรับทั้งเบอร์รองเท้าและไซส์เสื้อ</span>
              </div>

              {/* Standard Sizes */}
              <div className="mb-2">
                <span className="block text-[10px] text-zinc-400 mb-1">
                  👕 ไซส์มาตรฐาน (เสื้อผ้า):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['S', 'M', 'L', 'XL', '2XL', '3XL', 'Oversized', 'Free Size'].map((size) => (
                    <label
                      key={size}
                      className={`flex items-center gap-1 border px-2 py-0.5 rounded-lg text-xs cursor-pointer select-none transition-all ${
                        productSizes.includes(size)
                          ? 'bg-purple-900/40 border-purple-400 text-purple-200 font-bold'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={productSizes.includes(size)}
                        onChange={() => handleToggleSize(size)}
                        className="accent-purple-500 cursor-pointer"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Numbers */}
              <div className="mb-2">
                <span className="block text-[10px] text-zinc-400 mb-1">
                  👟 เบอร์รองเท้า / เบอร์กางเกง:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'เบอร์ 36',
                    'เบอร์ 37',
                    'เบอร์ 38',
                    'เบอร์ 39',
                    'เบอร์ 40',
                    'เบอร์ 41',
                    'เบอร์ 42',
                    'เบอร์ 43',
                    'เบอร์ 44',
                    'เบอร์ 45',
                    'เบอร์ 28',
                    'เบอร์ 30',
                    'เบอร์ 32',
                    'เบอร์ 34',
                  ].map((num) => (
                    <label
                      key={num}
                      className={`flex items-center gap-1 border px-2 py-0.5 rounded-lg text-xs cursor-pointer select-none transition-all ${
                        productSizes.includes(num)
                          ? 'bg-amber-950/40 border-amber-500 text-amber-200 font-bold'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={productSizes.includes(num)}
                        onChange={() => handleToggleSize(num)}
                        className="accent-amber-500 cursor-pointer"
                      />
                      <span>{num}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Size/Number Input */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  placeholder="พิมพ์เบอร์หรือไซส์เอง เช่น เบอร์ 46, 4XL..."
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSize();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  + เพิ่มเบอร์/ไซส์
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-zinc-300 mb-1">
              รายละเอียดสินค้า (Description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุคุณสมบัติเนื้อผ้า ไซส์ หรือการดูแลรักษา..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500"
            />
          </div>

          {/* Action buttons */}
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังลงรายการสินค้า...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>🛍️ บันทึกและโพสต์ลงร้านค้าทันที</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* DELETE IMAGE CONFIRMATION MODAL (แจ้งเตือนลบรูปภาพจากคลิกขวาหรือกดแช่) */}
      {deletePrompt && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setDeletePrompt(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-700 w-full max-w-xs rounded-2xl p-4 shadow-2xl text-center space-y-3 animate-in zoom-in-95 duration-150"
          >
            <div className="w-11 h-11 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">ต้องการลบรูปภาพนี้หรือไม่?</h4>
              <p className="text-[11px] text-zinc-400 mt-1 flex items-center justify-center gap-1">
                {deletePrompt.source === 'long-press' ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                    <span>ตรวจพบการกดแช่ภาพในมือถือ</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-purple-400" />
                    <span>ตรวจพบการคลิกขวาที่รูปภาพ</span>
                  </>
                )}
              </p>
            </div>

            <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 shadow-inner">
              <img
                src={deletePrompt.url}
                alt="รูปที่ต้องการลบ"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-[10px] text-zinc-500">
              รูปภาพนี้จะถูกนำออกจากแกลเลอรีสินค้า
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletePrompt(null)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => handleDeleteImage(deletePrompt.index)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบรูปภาพ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
