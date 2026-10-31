import React, { useState, useRef } from 'react';
import {
  X,
  Trash2,
  Edit2,
  ArrowLeft,
  ExternalLink,
  Upload,
  Play,
  CheckCircle,
  Clock,
  Flame,
  Truck,
  Check,
  FileText,
  ShieldCheck,
  Award,
  Building2,
  Copy,
  Save,
  Image as ImageIcon,
  Plus,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { Product, VideoClip, OrderItem, StoreRegistration } from '../types/feed';

interface AdminDashboardProps {
  products: Product[];
  videos: VideoClip[];
  orders: OrderItem[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddVideo: (video: VideoClip) => void;
  onDeleteVideo: (videoId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderItem['status']) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  videos,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddVideo,
  onDeleteVideo,
  onUpdateOrderStatus,
  onClose,
}) => {
  // Navigation / active section
  const [activeTab, setActiveTab] = useState<'products' | 'videos' | 'orders' | 'registration' | 'all'>('products');

  // ข้อมูลการจดทะเบียนพาณิชย์ & DBD Registered (กรมพัฒนาธุรกิจการค้า)
  const [storeReg, setStoreReg] = useState<StoreRegistration>({
    businessName: 'CYBER ARCHIVE BKK & Streetwear Studio',
    companyNameTh: 'บริษัท ไซเบอร์ อาร์ไคฟ์ สตรีทแวร์ จำกัด',
    companyNameEn: 'CYBER ARCHIVE STREETWEAR CO., LTD.',
    registrationNumber: '0-1055-67012-34-5',
    taxId: '0105567012345',
    dbdRegisteredNumber: 'DBD-67012345001-TH',
    registeredDate: '15 มกราคม 2567',
    registeredCapital: '2,000,000 บาท (ชำระเต็มมูลค่า)',
    businessType: 'พาณิชย์อิเล็กทรอนิกส์ การจำหน่ายเสื้อผ้า เครื่องแต่งกาย และสินค้าแฟชั่นทางออนไลน์',
    registeredAddress: '123/45 ซอยทองหล่อ 10 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
    contactEmail: 'contact@cyberarchive-bkk.com',
    contactPhone: '02-123-4567, 089-123-4567',
    dbdStatus: 'verified',
  });
  const [isEditingReg, setIsEditingReg] = useState<boolean>(false);
  const [regForm, setRegForm] = useState<StoreRegistration>({
    businessName: 'CYBER ARCHIVE BKK & Streetwear Studio',
    companyNameTh: 'บริษัท ไซเบอร์ อาร์ไคฟ์ สตรีทแวร์ จำกัด',
    companyNameEn: 'CYBER ARCHIVE STREETWEAR CO., LTD.',
    registrationNumber: '0-1055-67012-34-5',
    taxId: '0105567012345',
    dbdRegisteredNumber: 'DBD-67012345001-TH',
    registeredDate: '15 มกราคม 2567',
    registeredCapital: '2,000,000 บาท (ชำระเต็มมูลค่า)',
    businessType: 'พาณิชย์อิเล็กทรอนิกส์ การจำหน่ายเสื้อผ้า เครื่องแต่งกาย และสินค้าแฟชั่นทางออนไลน์',
    registeredAddress: '123/45 ซอยทองหล่อ 10 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
    contactEmail: 'contact@cyberarchive-bkk.com',
    contactPhone: '02-123-4567, 089-123-4567',
    dbdStatus: 'verified',
  });
  const [regNotice, setRegNotice] = useState<string | null>(null);
  const [copiedRegField, setCopiedRegField] = useState<string | null>(null);

  const handleCopyRegField = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRegField(fieldKey);
    setTimeout(() => {
      setCopiedRegField(null);
    }, 2000);
  };

  const handleSaveRegistration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStoreReg({ ...regForm });
    setIsEditingReg(false);
    setRegNotice('บันทึกข้อมูลเลขที่ทะเบียนพาณิชย์และข้อมูลนิติบุคคลสำเร็จเรียบร้อย');
    setTimeout(() => {
      setRegNotice(null);
    }, 4000);
  };

  const handleCancelEditReg = () => {
    setRegForm({ ...storeReg });
    setIsEditingReg(false);
  };

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form fields (E-Commerce Standard)
  const [modalSku, setModalSku] = useState<string>('P003');
  const [modalName, setModalName] = useState<string>('');
  const [modalPrice, setModalPrice] = useState<string>('390');
  const [modalStock, setModalStock] = useState<string>('100');
  const [modalSizes, setModalSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'Oversized']);
  const [modalWeight, setModalWeight] = useState<string>('250');
  const [modalCarrier, setModalCarrier] = useState<string>(
    '📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ 1-2 วันทำการ)'
  );
  const [modalFda, setModalFda] = useState<string>('');
  const [modalTis, setModalTis] = useState<string>('');
  const [modalRegNum, setModalRegNum] = useState<string>('0-1055-67012-34-5');
  const [modalDesc, setModalDesc] = useState<string>('');
  const [modalImageFile, setModalImageFile] = useState<string>(
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80'
  );
  const [modalGalleryImages, setModalGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    '/src/assets/images/shirt_streetwear_black_1793336644572.jpg',
    '/src/assets/images/shirt_cream_minimal_1793336644442.jpg',
    '/src/assets/images/shirt_acidwash_neon_1793336644924.jpg',
  ]);
  const [adminDeleteImgPrompt, setAdminDeleteImgPrompt] = useState<{
    index: number;
    url: string;
    source: 'right-click' | 'long-press';
  } | null>(null);
  const adminLongPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile Long-Press for Admin Product Modal
  const handleAdminTouchStart = (index: number, url: string) => {
    if (adminLongPressRef.current) clearTimeout(adminLongPressRef.current);
    adminLongPressRef.current = setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(50);
        } catch {}
      }
      setAdminDeleteImgPrompt({ index, url, source: 'long-press' });
    }, 500);
  };

  const handleAdminTouchEnd = () => {
    if (adminLongPressRef.current) {
      clearTimeout(adminLongPressRef.current);
      adminLongPressRef.current = null;
    }
  };

  const handleAdminContextMenu = (index: number, url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdminDeleteImgPrompt({ index, url, source: 'right-click' });
  };

  const handleAdminDeleteImage = (idxToDelete: number) => {
    if (modalGalleryImages.length <= 1) {
      alert('สินค้าต้องมีรูปภาพอย่างน้อย 1 รูป');
      setAdminDeleteImgPrompt(null);
      return;
    }
    const filtered = modalGalleryImages.filter((_, idx) => idx !== idxToDelete);
    setModalGalleryImages(filtered);
    if (modalImageFile === modalGalleryImages[idxToDelete]) {
      setModalImageFile(filtered[0] || '');
    }
    setAdminDeleteImgPrompt(null);
  };

  // Thailand Post Tracking Popup state
  const [trackingOrder, setTrackingOrder] = useState<OrderItem | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);

  // Toggle size checkbox
  const handleToggleSize = (size: string) => {
    setModalSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Video Upload Form State (Section 2)
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [selectedProductCode, setSelectedProductCode] = useState<string>(
    products[0]?.code || 'P001'
  );
  const [videoCaption, setVideoCaption] = useState<string>('');
  const [videoSuccessMsg, setVideoSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const productImgInputRef = useRef<HTMLInputElement | null>(null);

  // Preset demo videos to allow testing without local files
  const sampleVideos = [
    {
      name: 'คลิปสตรีทแวร์ สเก็ตบอร์ด (MP4)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-a-red-t-shirt-skateboarding-41444-large.mp4',
    },
    {
      name: 'คลิปแฟชั่นสตูดิโอโมเดล (MP4)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-a-fashion-photoshoot-in-a-studio-41400-large.mp4',
    },
    {
      name: 'คลิปเต้นและสตรีทแฟชั่น (MP4)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-dancing-in-a-skatepark-42861-large.mp4',
    },
  ];

  // Open Product Modal
  const openProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setModalSku(prod.code || 'P000');
      setModalName(prod.name);
      setModalPrice(String(prod.price));
      setModalStock(String(prod.stock || 100));
      setModalSizes(prod.sizes && prod.sizes.length > 0 ? prod.sizes : ['S', 'M', 'L', 'XL']);
      setModalWeight(String(prod.weight || 250));
      setModalCarrier(
        prod.shippingCarrier || '📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ 1-2 วันทำการ)'
      );
      setModalFda(prod.fdaNumber || '');
      setModalTis(prod.tisStandard || '');
      setModalRegNum(prod.registrationNumber || storeReg.registrationNumber);
      setModalDesc(prod.description || '');
      setModalImageFile(prod.imageUrl);
      setModalGalleryImages(
        prod.galleryImages && prod.galleryImages.length > 0
          ? prod.galleryImages
          : [prod.imageUrl]
      );
    } else {
      setEditingProduct(null);
      setModalSku(`P00${products.length + 1}`);
      setModalName('');
      setModalPrice('390');
      setModalStock('100');
      setModalSizes(['S', 'M', 'L', 'XL', 'Oversized']);
      setModalWeight('250');
      setModalCarrier('📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ 1-2 วันทำการ)');
      setModalFda('');
      setModalTis('');
      setModalRegNum(storeReg.registrationNumber);
      setModalDesc('');
      const defaultImg =
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80';
      setModalImageFile(defaultImg);
      setModalGalleryImages([
        defaultImg,
        '/src/assets/images/shirt_streetwear_black_1793336644572.jpg',
        '/src/assets/images/shirt_cream_minimal_1793336644442.jpg',
      ]);
    }
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Handle Product Image Upload from Computer or Phone Gallery
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls: string[] = [];
      Array.from(files).forEach((file) => {
        newUrls.push(URL.createObjectURL(file));
      });
      setModalGalleryImages((prev) => [...newUrls, ...prev]);
      setModalImageFile(newUrls[0]);
      e.target.value = '';
    }
  };

  // Save Advanced Product (ฟังก์ชันบันทึกสินค้าแบบมืออาชีพ ครบเครื่องเรื่องอีคอมเมิร์ซ + ขนส่ง)
  const saveAdvancedProduct = () => {
    const name = modalName.trim();
    const priceStr = String(modalPrice).trim();
    const priceNum = Number(priceStr);

    if (!name || !priceStr || isNaN(priceNum) || priceNum <= 0) {
      alert('กรุณากรอกชื่อสินค้าและราคาให้ครบถ้วนครับ');
      return;
    }

    const sku = modalSku.trim() || 'P003';
    const stockNum = modalStock ? Number(modalStock) : 100;
    const weightNum = modalWeight ? Number(modalWeight) : 250;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        code: sku,
        name: name,
        price: priceNum,
        originalPrice: Math.round(priceNum * 1.4),
        stock: stockNum,
        sizes: modalSizes.length > 0 ? modalSizes : ['S', 'M', 'L', 'XL', 'Oversized'],
        weight: weightNum,
        shippingCarrier: modalCarrier,
        fdaNumber: modalFda.trim() || undefined,
        tisStandard: modalTis.trim() || undefined,
        registrationNumber: modalRegNum.trim() || undefined,
        description: modalDesc.trim() || editingProduct.description,
        imageUrl: modalImageFile || modalGalleryImages[0] || editingProduct.imageUrl,
        galleryImages: modalGalleryImages,
      };
      onUpdateProduct(updated);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        code: sku,
        name: name,
        price: priceNum,
        originalPrice: Math.round(priceNum * 1.4),
        discountPercent: 25,
        rating: 5.0,
        salesCount: '0 ขายแล้ว',
        stock: stockNum,
        category: 'เสื้อยืดพรีเมียม',
        imageUrl:
          modalImageFile ||
          modalGalleryImages[0] ||
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
        galleryImages: modalGalleryImages,
        colors: ['ดำ (Black)', 'ขาว (White)'],
        sizes: modalSizes.length > 0 ? modalSizes : ['S', 'M', 'L', 'XL', 'Oversized'],
        weight: weightNum,
        shippingCarrier: modalCarrier,
        fdaNumber: modalFda.trim() || undefined,
        tisStandard: modalTis.trim() || undefined,
        registrationNumber: modalRegNum.trim() || undefined,
        description: modalDesc.trim() || 'ผ้าฝ้ายพรีเมียม 100% Cotton สวมใส่สบาย ระบายอากาศดีเยี่ยม',
      };
      onAddProduct(newProduct);
    }

    alert(`บันทึกและเพิ่มสินค้า "${name}" ลงระบบอีคอมเมิร์ซเรียบร้อย!`);
    closeProductModal();
  };

  const saveProduct = saveAdvancedProduct;

  // Video Gallery Picker
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleSelectSampleVideo = (sample: { name: string; url: string }) => {
    setVideoPreviewUrl(sample.url);
    setSelectedVideoFile(new File(['sample'], sample.name, { type: 'video/mp4' }));
  };

  const resetVideoUpload = () => {
    setSelectedVideoFile(null);
    setVideoPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Post Video to TikTok Feed
  const handlePostVideo = () => {
    if (!videoPreviewUrl) {
      alert('กรุณาเลือกไฟล์วิดีโอจากแกลเลอรีหรือคลิปตัวอย่างก่อนโพสต์');
      return;
    }
    if (!videoCaption.trim()) {
      alert('กรุณาระบุแคปชันวิดีโอ');
      return;
    }

    const pinnedProd =
      products.find((p) => p.code === selectedProductCode) || products[0];

    const newClip: VideoClip = {
      id: `vid-${Date.now()}`,
      videoUrl: videoPreviewUrl,
      fallbackGradient: 'from-purple-950 via-slate-900 to-black',
      creator: {
        id: 'cr-seller',
        name: 'CYBER ARCHIVE BKK',
        handle: '@cyber_street.th',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
        isFollowing: true,
      },
      caption: videoCaption.trim(),
      hashtags: ['#TokShop', '#รีวิวเสื้อผ้า', '#ของดีบอกต่อ', '#Streetwear'],
      musicTitle: 'TokShop Beat - Original Sound',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
      product: pinnedProd,
      comments: [],
    };

    onAddVideo(newClip);
    setVideoSuccessMsg(`โพสต์คลิปวิดีโอพร้อมปักหมุด ${pinnedProd.code} ลงฟีดสำเร็จ!`);
    resetVideoUpload();
    setVideoCaption('');

    setTimeout(() => {
      setVideoSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 font-sans flex h-screen overflow-hidden text-gray-900">
      {/* Sidebar แถบเมนูด้านซ้าย */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col justify-between border-r border-gray-200">
        <div>
          <div className="p-6">
            <h1 className="text-xl font-bold text-purple-600 flex items-center gap-2">
              <span>🛠️</span> Seller Center
            </h1>
            <p className="text-xs text-gray-400 mt-1">ระบบจัดการหลังบ้านร้านค้า</p>
          </div>
          <nav className="mt-6 space-y-1 px-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              👕 1. จัดการสินค้าและรหัสสินค้า
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🎬 2. สร้างและลงคลิปวิดีโอ
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>📦 3. คำสั่งซื้อลูกค้า</span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer ${
                activeTab === 'registration'
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📜</span> 4. เลขที่ทะเบียน
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                DBD รับรอง
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 mt-8 transition-colors text-left cursor-pointer"
            >
              🚪 กลับหน้าหลักเว็บไซต์
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          TokShop Seller Platform v2.4
        </div>
      </aside>

      {/* Main Content ส่วนเนื้อหาหลัก */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Mobile Top Header */}
        <div className="md:hidden flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🛠️</span>
            <span className="font-bold text-purple-600 text-sm">Seller Center</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับหน้าหลัก</span>
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex gap-1.5 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'products' ? 'bg-purple-600 text-white font-bold' : 'bg-white text-gray-700'
            }`}
          >
            👕 1. สินค้า & รหัส
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'videos' ? 'bg-purple-600 text-white font-bold' : 'bg-white text-gray-700'
            }`}
          >
            🎬 2. สร้างคลิปวิดีโอ
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'orders' ? 'bg-purple-600 text-white font-bold' : 'bg-white text-gray-700'
            }`}
          >
            📦 3. ออร์เดอร์ ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'registration' ? 'bg-purple-600 text-white font-bold' : 'bg-white text-gray-700'
            }`}
          >
            <span>📜 4. เลขที่ทะเบียน</span>
            <span className="bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">DBD</span>
          </button>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              ระบบจัดการหลังบ้าน (Seller Center)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              จัดการรหัสสินค้า และสร้างวิดีโอสไตล์ TikTok ได้อย่างรวดเร็ว
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-sm">
              สถานะ: แอดมินออนไลน์
            </div>
            <button
              onClick={onClose}
              className="hidden sm:flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span>ดูหน้าฟีด TikTok</span>
            </button>
          </div>
        </header>

        {/* Success Banner */}
        {videoSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-sm">{videoSuccessMsg}</span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
            >
              ไปดูที่หน้าฟีดทันที
            </button>
          </div>
        )}

        {/* Desktop Quick Tab Switcher */}
        <div className="hidden sm:flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            👕 1. จัดการสินค้า ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            🎬 2. สร้างคลิปวิดีโอ ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            📦 3. คำสั่งซื้อ ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'registration'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span>📜 4. เลขที่ทะเบียน</span>
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              DBD รับรอง
            </span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ml-auto ${
              activeTab === 'all'
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            ดูทั้งหมด
          </button>
        </div>

        {/* ส่วนที่ 1: จัดการสินค้าและกำหนดรหัสสินค้าตอนลงภาพ */}
        {(activeTab === 'all' || activeTab === 'products') && (
        <div id="products" className="bg-white rounded-xl shadow-sm p-5 sm:p-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                👕 จัดการสินค้า & กำหนดรหัสสินค้า
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                กำหนดรหัสและอัปโหลดภาพสินค้าตั้งต้นไว้ก่อนนำไปผูกกับคลิปวิดีโอ
              </p>
            </div>
            <button
              onClick={() => openProductModal()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition shadow-sm cursor-pointer active:scale-95"
            >
              + เพิ่มสินค้าและกำหนดรหัส
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-400">
                  <th className="py-3 px-4">รหัสสินค้า (SKU)</th>
                  <th className="py-3 px-4">รูปภาพ</th>
                  <th className="py-3 px-4">ชื่อสินค้า</th>
                  <th className="py-3 px-4">ราคา</th>
                  <th className="py-3 px-4">จัดการ</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-purple-600 font-mono">
                      {p.code || 'P000'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">
                        {p.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 font-mono">
                      {p.price} บาท
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap space-x-3">
                      <button
                        onClick={() => openProductModal(p)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>แก้ไข</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`ต้องการลบสินค้า ${p.name} (${p.code}) หรือไม่?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ส่วนที่ 2: หน้าต่างสร้างและลงคลิปวิดีโอสไตล์ TikTok (ปุ่มเดียวเลือกแกลเลอรี) */}
        {(activeTab === 'all' || activeTab === 'videos') && (
        <div id="videos" className="bg-white rounded-xl shadow-sm p-5 sm:p-6 animate-in fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              🎬 สร้างและอัปโหลดคลิปวิดีโอสั้น (TikTok Feed)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              กดปุ่มเดียวเพื่อเลือกวิดีโอจากแกลเลอรี และเลือกสินค้าที่กำหนดรหัสไว้แล้วมาปักหมุด
            </p>
          </div>

          {/* ฟอร์มสร้างวิดีโอแบบหน้าเดียวจบ ทันสมัย */}
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 max-w-xl mx-auto flex flex-col items-center text-center space-y-4">
            {/* ซ่อน Input file ไว้ แล้วใช้ปุ่มนี้สั่งคลิก */}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              className="hidden"
              onChange={handleVideoFileChange}
            />

            {!videoPreviewUrl ? (
              <div
                className="w-full py-8 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 rounded-xl transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-3 shadow-sm hover:scale-105 transition">
                  📁
                </div>
                <h4 className="font-bold text-gray-800 text-base">
                  แตะเพื่อเลือกวิดีโอจากแกลเลอรี
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  รองรับไฟล์ MP4, MOV (อารมณ์เดียวกับ TikTok)
                </p>

                {/* ตัวอย่างคลิปสำเร็จรูปให้ทดสอบได้ทันที */}
                <div className="mt-4 pt-3 border-t border-gray-200/80 w-full max-w-sm">
                  <span className="text-[11px] font-semibold text-gray-500 block mb-2">
                    หรือคลิกเลือกคลิปทดสอบสำเร็จรูปด้านล่าง:
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {sampleVideos.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSampleVideo(s);
                        }}
                        className="text-[10px] bg-white border border-gray-300 hover:border-purple-500 hover:text-purple-600 px-2 py-1 rounded-md text-gray-600 font-medium transition cursor-pointer"
                      >
                        🎥 {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* แสดงชื่อไฟล์และตัวเล่นวิดีโอหลังเลือก */
              <div className="w-full space-y-3">
                <div className="w-full bg-white p-3 rounded-xl border text-left flex justify-between items-center text-sm shadow-sm">
                  <span className="text-gray-700 font-medium truncate flex items-center gap-1.5">
                    <span>📹</span>
                    <span className="truncate">
                      เลือกไฟล์: {selectedVideoFile?.name || 'sample_video.mp4'}
                    </span>
                  </span>
                  <button
                    onClick={resetVideoUpload}
                    className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer shrink-0 ml-2"
                  >
                    เปลี่ยนไฟล์
                  </button>
                </div>

                {/* Video Preview Player */}
                <div className="relative w-full max-w-[240px] mx-auto aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-lg border border-gray-300">
                  <video
                    src={videoPreviewUrl}
                    controls
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* เลือกสินค้าที่จะปักหมุด (ดึงจากรหัสสินค้าที่สร้างไว้) */}
            <div className="w-full text-left space-y-1">
              <label className="block text-xs font-bold text-gray-600">
                เลือกสินค้าปักหมุดในคลิป (ดึงจากรหัสสินค้า)
              </label>
              <select
                value={selectedProductCode}
                onChange={(e) => setSelectedProductCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.code}>
                    {p.code} - {p.name} ({p.price} บาท)
                  </option>
                ))}
              </select>
            </div>

            {/* แคปชัน */}
            <div className="w-full text-left space-y-1">
              <label className="block text-xs font-bold text-gray-600">แคปชันวิดีโอ</label>
              <textarea
                rows={2}
                value={videoCaption}
                onChange={(e) => setVideoCaption(e.target.value)}
                placeholder="เขียนแคปชันรีวิวสไตล์คุณ..."
                className="w-full px-3 py-2 border rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* ปุ่มสร้างและโพสต์ */}
            <button
              onClick={handlePostVideo}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-purple-700 transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🚀 โพสต์คลิปวิดีโอลงหน้าฟีดทันที</span>
            </button>
          </div>

          {/* ตารางคลิปวิดีโอที่เผยแพร่อยู่ในระบบ */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 mb-3">
              รายการวิดีโอที่กำลังแสดงผลในหน้าฟีด TikTok ({videos.length} คลิป)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b text-gray-400">
                    <th className="py-2.5 px-3">ลำดับ</th>
                    <th className="py-2.5 px-3">วิดีโอ</th>
                    <th className="py-2.5 px-3">แคปชัน</th>
                    <th className="py-2.5 px-3">สินค้าปักหมุด</th>
                    <th className="py-2.5 px-3">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {videos.map((vid, idx) => (
                    <tr key={vid.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-purple-600">
                        #{idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="w-10 h-14 rounded overflow-hidden bg-black border border-gray-200">
                          <video
                            src={vid.videoUrl}
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-800 max-w-xs truncate">
                        {vid.caption}
                      </td>
                      <td className="py-2.5 px-3">
                        {vid.product ? (
                          <>
                            <span className="font-bold text-purple-600 font-mono">
                              {vid.product.code || vid.product.id}
                            </span>{' '}
                            - {vid.product.name}
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">ไม่ได้ปักตระกล้า</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            if (window.confirm('ต้องการลบคลิปนี้ออกจากฟีดหรือไม่?')) {
                              onDeleteVideo(vid.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* ส่วนที่ 3: คำสั่งซื้อลูกค้า (Orders) */}
        {(activeTab === 'all' || activeTab === 'orders') && (
        <div id="orders" className="bg-white rounded-xl shadow-sm p-5 sm:p-6 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                📦 รายการคำสั่งซื้อจากลูกค้า (Orders)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                ออร์เดอร์ที่ลูกค้าสั่งซื้อผ่านปุ่ม "สั่งซื้อสินค้าลายนี้" จากหน้าฟีด
              </p>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-full">
              {orders.length} รายการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b text-gray-400">
                  <th className="py-3 px-4">เลขออร์เดอร์</th>
                  <th className="py-3 px-4">ลูกค้า</th>
                  <th className="py-3 px-4">สินค้า</th>
                  <th className="py-3 px-4">ยอดชำระ</th>
                  <th className="py-3 px-4">การชำระ</th>
                  <th className="py-3 px-4">ขนส่ง & เลขพัสดุ</th>
                  <th className="py-3 px-4">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {orders.map((order) => {
                  const trackingNum =
                    order.trackingNumber ||
                    `ED${Math.floor(
                      10000000 + (parseInt(order.id.replace(/\D/g, '') || '104921') * 83) % 90000000
                    )}TH`;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        {order.id}
                        <div className="text-[10px] text-gray-400 font-sans">{order.createdAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{order.productName}</div>
                        <div className="text-[11px] text-gray-500">
                          {order.color} • {order.size} (x{order.quantity})
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold font-mono text-purple-600">
                        ฿{order.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {order.paymentMethod === 'promptpay'
                            ? 'พร้อมเพย์'
                            : order.paymentMethod === 'cod'
                            ? 'เก็บเงินปลายทาง'
                            : 'บัตรเครดิต'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-semibold text-gray-800 flex items-center gap-1">
                            <span>📮</span>
                            <span>{order.shippingCarrier || 'ไปรษณีย์ไทย (EMS ด่วนพิเศษ)'}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              {trackingNum}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setTrackingOrder({
                                  ...order,
                                  trackingNumber: trackingNum,
                                })
                              }
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                            >
                              เช็กพัสดุ
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as OrderItem['status'])
                          }
                          className="bg-white border border-gray-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-purple-600 cursor-pointer font-medium"
                        >
                          <option value="pending">รอผลิต</option>
                          <option value="processing">กำลังผลิต</option>
                          <option value="shipped">จัดส่งแล้ว</option>
                          <option value="completed">เสร็จสิ้น</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ส่วนที่ 4: เลขที่ทะเบียนพาณิชย์ & ข้อมูลนิติบุคคล (DBD Registered) */}
        {(activeTab === 'all' || activeTab === 'registration') && (
          <div id="registration" className="space-y-6 animate-in fade-in">
            {/* Notification Banner */}
            {regNotice && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-sm">{regNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRegNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                >
                  ปิด
                </button>
              </div>
            )}

            {/* Official Registration & DBD Hero Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800/40">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                      <Award className="w-3.5 h-3.5 text-slate-900" />
                      <span>DBD Registered รับรองแล้ว</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>พ.ร.บ. ทะเบียนพาณิชย์ พ.ศ. 2499</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      <span>{storeReg.businessName}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-200/80 mt-1">
                      {storeReg.companyNameTh} • {storeReg.companyNameEn}
                    </p>
                  </div>

                  {/* Highlighted 13-digit registration number */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          เลขทะเบียนพาณิชย์ / เลขนิติบุคคล (13 หลัก)
                        </span>
                        <span className="text-base sm:text-lg font-mono font-bold text-amber-300 tracking-wider">
                          {storeReg.registrationNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyRegField(storeReg.registrationNumber, 'regNum')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        title="คัดลอกเลขทะเบียน"
                      >
                        {copiedRegField === 'regNum' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          เลขประจำตัวผู้เสียภาษีอากร (Tax ID)
                        </span>
                        <span className="text-base sm:text-lg font-mono font-bold text-emerald-300 tracking-wider">
                          {storeReg.taxId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyRegField(storeReg.taxId, 'taxId')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        title="คัดลอกเลขภาษี"
                      >
                        {copiedRegField === 'taxId' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Action Box */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                  <a
                    href="https://datawarehouse.dbd.go.th"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer text-center"
                  >
                    <span>ตรวจสอบกับ DBD DataWarehouse+</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingReg) {
                        handleCancelEditReg();
                      } else {
                        setRegForm({ ...storeReg });
                        setIsEditingReg(true);
                      }
                    }}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer text-center ${
                      isEditingReg
                        ? 'bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30'
                        : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                    }`}
                  >
                    {isEditingReg ? (
                      <>
                        <X className="w-4 h-4" />
                        <span>ยกเลิกการแก้ไข</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        <span>แก้ไขข้อมูลทะเบียนร้านค้า</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Editable Form OR Display Details */}
            {isEditingReg ? (
              <form
                onSubmit={handleSaveRegistration}
                className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-purple-200 space-y-6 animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span>แบบฟอร์มแก้ไขข้อมูลการจดทะเบียนนิติบุคคล / ทะเบียนพาณิชย์</span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      กรอกข้อมูลตามใบทะเบียนพาณิชย์ (แบบ พค. 0403) หรือหนังสือรับรองนิติบุคคล
                    </p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                    โหมดแก้ไขข้อมูล
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      ชื่อร้านค้า / พาณิชยนาม
                    </label>
                    <input
                      type="text"
                      value={regForm.businessName}
                      onChange={(e) => setRegForm({ ...regForm, businessName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      ชื่อนิติบุคคล (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      value={regForm.companyNameTh}
                      onChange={(e) => setRegForm({ ...regForm, companyNameTh: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      ชื่อนิติบุคคล (ภาษาอังกฤษ)
                    </label>
                    <input
                      type="text"
                      value={regForm.companyNameEn}
                      onChange={(e) => setRegForm({ ...regForm, companyNameEn: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      เลขทะเบียนนิติบุคคล / ทะเบียนพาณิชย์ (13 หลัก)
                    </label>
                    <input
                      type="text"
                      value={regForm.registrationNumber}
                      onChange={(e) => setRegForm({ ...regForm, registrationNumber: e.target.value })}
                      placeholder="0-1055-67012-34-5"
                      required
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      เลขประจำตัวผู้เสียภาษีอากร (Tax ID 13 หลัก)
                    </label>
                    <input
                      type="text"
                      value={regForm.taxId}
                      onChange={(e) => setRegForm({ ...regForm, taxId: e.target.value })}
                      placeholder="0105567012345"
                      required
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      เลขทะเบียนพาณิชย์อิเล็กทรอนิกส์ (DBD e-Commerce)
                    </label>
                    <input
                      type="text"
                      value={regForm.dbdRegisteredNumber}
                      onChange={(e) => setRegForm({ ...regForm, dbdRegisteredNumber: e.target.value })}
                      placeholder="DBD-67012345001-TH"
                      required
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      วันที่จดทะเบียนพาณิชย์
                    </label>
                    <input
                      type="text"
                      value={regForm.registeredDate}
                      onChange={(e) => setRegForm({ ...regForm, registeredDate: e.target.value })}
                      placeholder="เช่น 15 มกราคม 2567"
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      ทุนจดทะเบียน
                    </label>
                    <input
                      type="text"
                      value={regForm.registeredCapital}
                      onChange={(e) => setRegForm({ ...regForm, registeredCapital: e.target.value })}
                      placeholder="เช่น 2,000,000 บาท"
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">
                      ประเภทธุรกิจ / วัตถุประสงค์
                    </label>
                    <input
                      type="text"
                      value={regForm.businessType}
                      onChange={(e) => setRegForm({ ...regForm, businessType: e.target.value })}
                      placeholder="การจำหน่ายเสื้อผ้า เครื่องแต่งกาย และสินค้าแฟชั่นทางออนไลน์"
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">
                      ที่ตั้งสำนักงานใหญ่ตามทะเบียนพาณิชย์
                    </label>
                    <textarea
                      rows={2}
                      value={regForm.registeredAddress}
                      onChange={(e) => setRegForm({ ...regForm, registeredAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      อีเมลติดต่อทางราชการและร้านค้า
                    </label>
                    <input
                      type="email"
                      value={regForm.contactEmail}
                      onChange={(e) => setRegForm({ ...regForm, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      เบอร์โทรศัพท์ติดต่อ
                    </label>
                    <input
                      type="text"
                      value={regForm.contactPhone}
                      onChange={(e) => setRegForm({ ...regForm, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEditReg}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกข้อมูลทะเบียน</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Information Grid in Display Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* การจดทะเบียนนิติบุคคล */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-purple-600 font-bold border-b pb-3 text-base">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span>ข้อมูลนิติบุคคลและทะเบียนพาณิชย์</span>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">เลขทะเบียนนิติบุคคล:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900">
                          {storeReg.registrationNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyRegField(storeReg.registrationNumber, 'd-reg')}
                          className="text-gray-400 hover:text-purple-600 cursor-pointer"
                          title="คัดลอก"
                        >
                          {copiedRegField === 'd-reg' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">เลขผู้เสียภาษีอากร:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900">{storeReg.taxId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyRegField(storeReg.taxId, 'd-tax')}
                          className="text-gray-400 hover:text-purple-600 cursor-pointer"
                          title="คัดลอก"
                        >
                          {copiedRegField === 'd-tax' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">ชื่อทางการค้า (TH):</span>
                      <span className="font-semibold text-gray-800 text-right">
                        {storeReg.companyNameTh}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">ชื่อทางการค้า (EN):</span>
                      <span className="font-medium text-gray-700 text-right">
                        {storeReg.companyNameEn}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">ทุนจดทะเบียน:</span>
                      <span className="font-medium text-gray-800">{storeReg.registeredCapital}</span>
                    </div>
                    <div className="flex justify-between items-start py-1">
                      <span className="text-gray-500">วันที่จดทะเบียน:</span>
                      <span className="font-medium text-gray-800">{storeReg.registeredDate}</span>
                    </div>
                  </div>
                </div>

                {/* การรับรอง DBD Registered */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 font-bold border-b pb-3 text-base">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span>การรับรองพาณิชย์อิเล็กทรอนิกส์ (DBD e-Commerce)</span>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">เลขทะเบียน DBD:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700">
                          {storeReg.dbdRegisteredNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyRegField(storeReg.dbdRegisteredNumber, 'd-dbd')}
                          className="text-gray-400 hover:text-blue-600 cursor-pointer"
                          title="คัดลอก"
                        >
                          {copiedRegField === 'd-dbd' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">สถานะการตรวจรับรอง:</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ตรวจสอบแล้ว (Verified)</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">ประเภทธุรกิจ:</span>
                      <span className="font-medium text-gray-800 text-right max-w-xs">
                        {storeReg.businessType}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-gray-50">
                      <span className="text-gray-500">การจัดส่งมาตรฐาน:</span>
                      <span className="font-medium text-red-600 flex items-center gap-1">
                        <span>📮</span>
                        <span>ไปรษณีย์ไทย (EMS ด่วนพิเศษ)</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-1">
                      <span className="text-gray-500">หน่วยงานกำกับดูแล:</span>
                      <span className="font-medium text-gray-800">
                        กองพาณิชย์อิเล็กทรอนิกส์ กรมพัฒนาธุรกิจการค้า
                      </span>
                    </div>
                  </div>
                </div>

                {/* ที่ตั้งสำนักงานและการติดต่อ */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold border-b pb-3 text-base">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>ที่ตั้งสำนักงานใหญ่และการติดต่อร้านค้า</span>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="py-1 border-b border-gray-50">
                      <span className="text-gray-500 block mb-1">ที่ตั้งสำนักงานใหญ่:</span>
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {storeReg.registeredAddress}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-50">
                      <span className="text-gray-500">อีเมลติดต่อ:</span>
                      <a
                        href={`mailto:${storeReg.contactEmail}`}
                        className="text-purple-600 hover:underline font-mono"
                      >
                        {storeReg.contactEmail}
                      </a>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">โทรศัพท์ติดต่อ:</span>
                      <span className="font-semibold text-gray-800">{storeReg.contactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* นโยบายความคุ้มครองผู้บริโภค */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold border-b pb-3 text-base">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>ความคุ้มครองผู้บริโภคและการซื้อขายออนไลน์</span>
                  </div>
                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        ร้านค้าจดทะเบียนถูกต้องตามกฎหมาย มีตัวตนตรวจสอบได้ผ่านฐานข้อมูลกรมพัฒนาธุรกิจการค้า
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        รองรับการคืนหรือเปลี่ยนสินค้าภายใน 7 วันตามมาตรฐานการคุ้มครองผู้บริโภค
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        ระบบส่งสินค้าด่วนพิเศษ EMS ไปรษณีย์ไทย มีหมายเลข Tracking 13 หลักตรวจสอบสถานะได้แบบเรียลไทม์
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        ออกใบเสร็จรับเงิน / ใบกำกับภาษีเต็มรูปตามเลขประจำตัวผู้เสียภาษี 13 หลัก
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ตารางสินค้าที่ผูกกับเลขทะเบียนพาณิชย์ & มาตรฐานสินค้า */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <span>👕 รายการสินค้าที่ลงทะเบียนภายใต้เลขทะเบียนนี้ ({products.length} รายการ)</span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ตรวจสอบเลขทะเบียนพาณิชย์ มาตรฐาน มอก. และ อย. กำกับสินค้าแต่ละรายการ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openProductModal()}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition cursor-pointer"
                >
                  + เพิ่มสินค้าใหม่พร้อมรหัส
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b text-gray-400 bg-gray-50/50">
                      <th className="py-2.5 px-3">รหัสสินค้า (SKU)</th>
                      <th className="py-2.5 px-3">ชื่อสินค้า</th>
                      <th className="py-2.5 px-3">เลขที่ทะเบียนพาณิชย์</th>
                      <th className="py-2.5 px-3">มาตรฐาน อย. / มอก.</th>
                      <th className="py-2.5 px-3">ระบบขนส่ง</th>
                      <th className="py-2.5 px-3">สถานะความถูกต้อง</th>
                      <th className="py-2.5 px-3">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    {products.map((p) => {
                      const prodReg = p.registrationNumber || storeReg.registrationNumber;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-purple-600">
                            {p.code || 'P000'}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-gray-800 line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-gray-400">฿{p.price.toLocaleString()}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-gray-700">
                            <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                              {prodReg}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="space-y-0.5 text-[11px]">
                              {p.fdaNumber && (
                                <div className="text-emerald-700 font-mono">
                                  อย.: {p.fdaNumber}
                                </div>
                              )}
                              {p.tisStandard && (
                                <div className="text-blue-700 font-mono">
                                  มอก.: {p.tisStandard}
                                </div>
                              )}
                              {!p.fdaNumber && !p.tisStandard && (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                              <span>📮</span>
                              <span>{p.shippingCarrier ? 'ไปรษณีย์ไทย EMS' : 'EMS ด่วนพิเศษ'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>รับรองแล้ว</span>
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => openProductModal(p)}
                              className="text-xs text-purple-600 hover:text-purple-800 font-bold underline cursor-pointer"
                            >
                              แก้ไข
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal เพิ่มสินค้าแบบมืออาชีพ (ครบเครื่องเรื่องอีคอมเมิร์ซ + ขนส่ง) */}
      {isProductModalOpen && (
        <div
          id="productModal"
          onClick={closeProductModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-[100] p-4 overflow-y-auto animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-gray-900 border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  👕 {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่ (E-Commerce Standard)'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  กรอกข้อมูลรายละเอียดสินค้า สต็อก และการจัดส่งให้ครบถ้วน
                </p>
              </div>
              <button
                type="button"
                onClick={closeProductModal}
                className="text-gray-400 hover:text-gray-600 font-bold text-2xl cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {/* ฟอร์มกรอกข้อมูลแบ่งเป็นสัดส่วน */}
            <div className="space-y-4 text-sm">
              {/* 1. ข้อมูลพื้นฐาน */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productSku" className="block font-semibold text-gray-700 mb-1">
                    รหัสสินค้า (SKU)
                  </label>
                  <input
                    type="text"
                    id="productSku"
                    value={modalSku}
                    onChange={(e) => setModalSku(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 text-purple-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="productName" className="block font-semibold text-gray-700 mb-1">
                    ชื่อสินค้า <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="เช่น เสื้อยืดสตรีทโอเวอร์ไซส์..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* 2. ราคาและสต็อก */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productPrice" className="block font-semibold text-gray-700 mb-1">
                    ราคาขาย (บาท) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(e.target.value)}
                    placeholder="390"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder:text-gray-400 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="productStock" className="block font-semibold text-gray-700 mb-1">
                    จำนวนสินค้าในสต็อก
                  </label>
                  <input
                    type="number"
                    id="productStock"
                    value={modalStock}
                    onChange={(e) => setModalStock(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder:text-gray-400 font-mono"
                  />
                </div>
              </div>

              {/* 3. ตัวเลือกสินค้า (ไซส์ / สี) */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  ตัวเลือกสินค้า (ขนาด / ไซส์)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'Oversized'].map((size) => (
                    <label
                      key={size}
                      className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                        modalSizes.includes(size)
                          ? 'bg-purple-50 border-purple-400 text-purple-700 font-bold'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={modalSizes.includes(size)}
                        onChange={() => handleToggleSize(size)}
                        className="accent-purple-600 cursor-pointer"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. น้ำหนักและระบบขนส่ง (รองรับไปรษณีย์ไทย EMS / Flash / Kerry / J&T) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-red-50/40 p-4 rounded-xl border border-red-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="productWeight" className="block font-semibold text-gray-700">
                      น้ำหนักสินค้า (กรัม)
                    </label>
                    <span className="text-[11px] text-red-600 font-bold">
                      📮 คำนวณค่าส่ง ปณ. อัตโนมัติ
                    </span>
                  </div>
                  <input
                    type="number"
                    id="productWeight"
                    value={modalWeight}
                    onChange={(e) => setModalWeight(e.target.value)}
                    placeholder="250"
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    ระบบขนส่งหลัก
                  </label>
                  <select
                    value={modalCarrier}
                    onChange={(e) => setModalCarrier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-red-500 cursor-pointer font-medium"
                  >
                    <option value="📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ 1-2 วันทำการ)">
                      📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ 1-2 วันทำการ) - แนะนำ
                    </option>
                    <option value="📮 ไปรษณีย์ไทย (ลงทะเบียน R 3-5 วันทำการ)">
                      📮 ไปรษณีย์ไทย (ลงทะเบียน R 3-5 วันทำการ)
                    </option>
                    <option value="⚡ รองรับทุกขนส่ง (ไปรษณีย์ไทย EMS / Flash / Kerry / J&T)">
                      ⚡ รองรับทุกขนส่ง (ไปรษณีย์ไทย EMS / Flash / Kerry / J&T)
                    </option>
                    <option value="เฉพาะ Flash Express (1 วันถึง)">
                      เฉพาะ Flash Express (1 วันถึง)
                    </option>
                    <option value="เฉพาะ Kerry Express">เฉพาะ Kerry Express</option>
                    <option value="เฉพาะ J&T Express">เฉพาะ J&T Express</option>
                  </select>
                </div>

                {/* กล่องแสดงการเชื่อมต่อระบบไปรษณีย์ไทย */}
                <div className="col-span-1 md:col-span-2 bg-white p-3 rounded-lg border border-red-200 text-xs text-gray-700 flex flex-col gap-1 shadow-2xs">
                  <div className="flex items-center justify-between text-red-600 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>📮</span>
                      <span>เชื่อมต่อระบบ ไปรษณีย์ไทย (Thailand Post e-Tracking API)</span>
                    </span>
                    <span className="bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full border border-red-200 text-[11px] font-mono">
                      EMS: ฿
                      {(Number(modalWeight) || 250) <= 20
                        ? 32
                        : (Number(modalWeight) || 250) <= 100
                        ? 37
                        : (Number(modalWeight) || 250) <= 250
                        ? 42
                        : (Number(modalWeight) || 250) <= 500
                        ? 52
                        : (Number(modalWeight) || 250) <= 1000
                        ? 67
                        : (Number(modalWeight) || 250) <= 1500
                        ? 82
                        : 97}{' '}
                      บาท
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    คำนวณจากน้ำหนักสินค้า {Number(modalWeight) || 250} กรัม • ระบบจะเชื่อมต่อออกเลขพัสดุบาร์โค้ด
                    EMS (ED...TH) พร้อมสถานะติดตามแบบเรียลไทม์ส่งตรงถึงมือถือลูกค้าทันทีที่สั่งซื้อ
                  </p>
                </div>
              </div>

              {/* 5. เลขที่ทะเบียนพาณิชย์ / อย. / มอก. / ใบอนุญาต */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-gray-700">
                      เลขที่ทะเบียน / ใบอนุญาต
                    </label>
                    <span className="text-[10px] text-purple-600 font-bold">DBD / ทะเบียน</span>
                  </div>
                  <input
                    type="text"
                    value={modalRegNum}
                    onChange={(e) => setModalRegNum(e.target.value)}
                    placeholder="เช่น 0-1055-67012-34-5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder:text-gray-400 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    เลขที่ อย. (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={modalFda}
                    onChange={(e) => setModalFda(e.target.value)}
                    placeholder="ระบุเลข อย. 13 หลัก..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder:text-gray-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    เลขที่ มอก. / มาตรฐาน
                  </label>
                  <input
                    type="text"
                    value={modalTis}
                    onChange={(e) => setModalTis(e.target.value)}
                    placeholder="ระบุมาตรฐาน มอก..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder:text-gray-400 text-xs"
                  />
                </div>
              </div>

              {/* 6. คำอธิบายสินค้า */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  คำอธิบายรายละเอียดสินค้า
                </label>
                <textarea
                  rows={3}
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="ระบุเนื้อผ้า คุณสมบัติ วิธีการดูแลรักษา..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* 7. รูปภาพสินค้า & แกลเลอรี */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <span>รูปภาพสินค้า & แกลเลอรี ({modalGalleryImages.length} รูป) <span className="text-red-500">*</span></span>
                  </label>
                  <span className="text-[11px] text-purple-600 font-medium">
                    ⭐ รูปที่เลือกอยู่คือภาพปกหลัก
                  </span>
                </div>

                <input
                  type="file"
                  id="productImage"
                  ref={productImgInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleProductImageChange}
                  className="hidden"
                />

                {/* Main Interactive Preview Card: Tap/Click opens gallery on PC & Mobile */}
                <div className="relative aspect-video sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-300 group">
                  <img
                    src={modalImageFile || modalGalleryImages[0]}
                    alt="รูปภาพสินค้าหลัก"
                    className="w-full h-full object-contain bg-black/80"
                  />

                  {/* Overlay button / banner: clicking on PC or tapping on mobile opens device gallery */}
                  <div
                    onClick={() => productImgInputRef.current?.click()}
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

                  {/* Primary Cover Badge */}
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-md pointer-events-none flex items-center gap-1">
                    <span>⭐</span>
                    <span>ภาพปกหลักในระบบ</span>
                  </div>
                </div>

                {/* Instruction Banner explaining Computer Right-Click and Mobile Long-Press */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-purple-700">
                    <Monitor className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span><strong>คอมพิวเตอร์:</strong> คลิกขวาที่รูปภาพเพื่อลบ</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-700">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span><strong>มือถือ:</strong> แตะรูปภาพแช่ไว้เพื่อลบ</span>
                  </div>
                </div>

                {/* Gallery Thumbnails Strip */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>แตะเลือกรูป / คลิกขวาหรือกดแช่เพื่อลบ:</span>
                    <button
                      type="button"
                      onClick={() => productImgInputRef.current?.click()}
                      className="text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold cursor-pointer text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มรูปจากแกลเลอรี</span>
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar items-center">
                    {/* Upload Action Tile */}
                    <button
                      type="button"
                      onClick={() => productImgInputRef.current?.click()}
                      className="w-14 h-14 rounded-xl border border-dashed border-purple-400 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-100/50 flex flex-col items-center justify-center shrink-0 text-purple-700 cursor-pointer transition-colors active:scale-95"
                      title="ไปที่แกลเลอรีรูปภาพของคอมพิวเตอร์หรือมือถือ"
                    >
                      <Upload className="w-4 h-4 mb-0.5 text-purple-600" />
                      <span className="text-[9px] font-bold">+ แกลเลอรี</span>
                    </button>

                    {/* Image Thumbnails with Right-Click and Long-Press Handlers */}
                    {modalGalleryImages.map((url, idx) => {
                      const isSelected = modalImageFile === url;
                      return (
                        <div
                          key={idx}
                          onClick={() => setModalImageFile(url)}
                          onContextMenu={(e) => handleAdminContextMenu(idx, url, e)}
                          onTouchStart={() => handleAdminTouchStart(idx, url)}
                          onTouchEnd={handleAdminTouchEnd}
                          onTouchMove={handleAdminTouchEnd}
                          onTouchCancel={handleAdminTouchEnd}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all select-none group/item ${
                            isSelected
                              ? 'border-purple-600 ring-2 ring-purple-500/50 scale-105 z-10'
                              : 'border-gray-300 opacity-80 hover:opacity-100 hover:border-gray-400'
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
                              setAdminDeleteImgPrompt({
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
            </div>

            {/* ปุ่มกดดำเนินการ */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={closeProductModal}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50 cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => saveAdvancedProduct()}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-purple-700 transition cursor-pointer active:scale-95"
              >
                บันทึกและเผยแพร่สินค้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE IMAGE CONFIRMATION MODAL (Admin: แจ้งเตือนลบรูปภาพจากคลิกขวาหรือกดแช่) */}
      {adminDeleteImgPrompt && (
        <div
          className="fixed inset-0 z-[130] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setAdminDeleteImgPrompt(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-gray-200 w-full max-w-xs rounded-2xl p-4 shadow-2xl text-center space-y-3 animate-in zoom-in-95 duration-150 text-gray-900"
          >
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900">ต้องการลบรูปภาพนี้หรือไม่?</h4>
              <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1 font-medium">
                {adminDeleteImgPrompt.source === 'long-press' ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                    <span>ตรวจพบการกดแช่ภาพในมือถือ</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-purple-600" />
                    <span>ตรวจพบการคลิกขวาที่รูปภาพ</span>
                  </>
                )}
              </p>
            </div>

            <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner">
              <img
                src={adminDeleteImgPrompt.url}
                alt="รูปที่ต้องการลบ"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-[10px] text-gray-400">
              รูปภาพนี้จะถูกนำออกจากรายการสินค้า
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAdminDeleteImgPrompt(null)}
                className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => handleAdminDeleteImage(adminDeleteImgPrompt.index)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-200 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบรูปภาพ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ติดตามพัสดุไปรษณีย์ไทย (Thailand Post Track & Trace) */}
      {trackingOrder && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-[110] p-4 animate-in fade-in"
          onClick={() => setTrackingOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150"
          >
            {/* Header สีแดงเอกลักษณ์ไปรษณีย์ไทย */}
            <div className="bg-[#ED1C24] text-white p-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                  📮
                </div>
                <div>
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-red-100">
                    Thailand Post e-Tracking
                  </div>
                  <h3 className="font-bold text-lg leading-tight">
                    ระบบติดตามพัสดุ ไปรษณีย์ไทย
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-gray-800 max-h-[80vh] overflow-y-auto">
              {/* บาร์โค้ดและเลขพัสดุ */}
              <div className="bg-red-50/40 border border-red-200 rounded-xl p-4 flex flex-col items-center text-center">
                <span className="text-xs text-gray-500 font-medium">
                  หมายเลขสิ่งของ / พัสดุด่วนพิเศษ (EMS)
                </span>
                <div className="font-mono text-2xl font-black text-red-600 tracking-wider my-1">
                  {trackingOrder.trackingNumber || 'ED982410291TH'}
                </div>

                {/* จำลองแถบบาร์โค้ด */}
                <div className="w-56 h-10 bg-white border border-gray-300 rounded flex items-center justify-center px-3 py-1 my-2 overflow-hidden shadow-2xs">
                  <div className="flex items-center gap-0.5 w-full justify-center h-full">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3].map(
                      (w, i) => (
                        <div
                          key={i}
                          className="bg-gray-800 h-full"
                          style={{ width: `${w * 1.5}px` }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        trackingOrder.trackingNumber || 'ED982410291TH'
                      );
                      setCopiedTracking(true);
                      setTimeout(() => setCopiedTracking(false), 2000);
                    }}
                    className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium text-gray-700 cursor-pointer shadow-2xs transition active:scale-95"
                  >
                    {copiedTracking ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">คัดลอกเลขพัสดุแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>คัดลอกเลขพัสดุ</span>
                      </>
                    )}
                  </button>
                  <a
                    href="https://track.thailandpost.co.th/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold underline px-2 py-1"
                  >
                    <span>เว็บไซต์ไปรษณีย์ไทย</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* ข้อมูลคำสั่งซื้อและผู้รับ */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block font-medium">ชื่อผู้รับ:</span>
                  <span className="font-semibold text-gray-900">{trackingOrder.customerName}</span>
                  <span className="text-gray-500 block">{trackingOrder.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">บริการจัดส่ง:</span>
                  <span className="font-semibold text-red-600">
                    {trackingOrder.shippingCarrier || '📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ)'}
                  </span>
                  <span className="text-gray-500 block">ออร์เดอร์: {trackingOrder.id}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-400 block font-medium">ที่อยู่ปลายทาง:</span>
                  <span className="text-gray-700 leading-relaxed">{trackingOrder.address}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">
                    สินค้า: <strong className="text-gray-800">{trackingOrder.productName}</strong> ({trackingOrder.size})
                  </span>
                  <span className="font-mono font-bold text-purple-600">
                    ฿{trackingOrder.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* เส้นทางติดตามพัสดุ (Tracking Steps) */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                  <span>สถานะการขนส่งแบบเรียลไทม์</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    เชื่อมต่อสด
                  </span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-[9px] text-white font-bold">
                      ✓
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">
                        รับฝากสิ่งของ ณ ที่ทำการไปรษณีย์
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        เคาน์เตอร์ ปณ.บางซื่อ กทม. • 29 ต.ค. 14:30 น.
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold ${
                        trackingOrder.status !== 'pending'
                          ? 'bg-emerald-500 ring-4 ring-emerald-100'
                          : 'bg-gray-300'
                      }`}
                    >
                      {trackingOrder.status !== 'pending' ? '✓' : '•'}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">
                        ศูนย์คัดแยก ศป.EMS ด่วนพิเศษ
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        {trackingOrder.status !== 'pending'
                          ? 'คัดแยกส่งต่อสายปลายทาง • 29 ต.ค. 19:45 น.'
                          : 'เตรียมส่งเข้าศูนย์คัดแยก'}
                      </span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold ${
                        trackingOrder.status === 'shipped' || trackingOrder.status === 'completed'
                          ? 'bg-emerald-500 ring-4 ring-emerald-100'
                          : 'bg-gray-300'
                      }`}
                    >
                      {trackingOrder.status === 'shipped' || trackingOrder.status === 'completed'
                        ? '✓'
                        : '•'}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">
                        อยู่ระหว่างการนำจ่าย
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        {trackingOrder.status === 'shipped' || trackingOrder.status === 'completed'
                          ? 'เจ้าหน้าที่ไปรษณีย์นำจ่ายสิ่งของให้ผู้รับ • 30 ต.ค. 09:15 น.'
                          : 'เตรียมการนำจ่ายปลายทาง'}
                      </span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold ${
                        trackingOrder.status === 'completed'
                          ? 'bg-emerald-500 ring-4 ring-emerald-100'
                          : 'bg-gray-300'
                      }`}
                    >
                      {trackingOrder.status === 'completed' ? '✓' : '•'}
                    </div>
                    <div className="text-xs">
                      <span
                        className={`font-bold block ${
                          trackingOrder.status === 'completed'
                            ? 'text-emerald-700'
                            : 'text-gray-400'
                        }`}
                      >
                        นำจ่ายสำเร็จ (ผู้รับได้รับสิ่งของแล้ว)
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        {trackingOrder.status === 'completed'
                          ? `ลงชื่อรับสิ่งของ: ${trackingOrder.customerName} • 30 ต.ค. 11:20 น.`
                          : 'รอการนำจ่ายปลายทาง'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ปุ่มปิด */}
              <div className="pt-2 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setTrackingOrder(null)}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-black transition cursor-pointer active:scale-95"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
