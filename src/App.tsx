import React, { useState, useRef, useEffect, useCallback } from 'react';
import { INITIAL_VIDEOS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CATEGORIES } from './data/mockFeed';
import { VideoClip, Product, OrderItem, UserProfile, Category } from './types/feed';
import { VideoItem } from './components/VideoItem';
import { TopNav, TopNavTab } from './components/TopNav';
import { BottomTabBar } from './components/BottomTabBar';
import { CommentsDrawer } from './components/CommentsDrawer';
import { ShareDrawer } from './components/ShareDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ShopCatalogView } from './components/ShopCatalogView';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { LiveStreamView } from './components/LiveStreamView';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { SellerRegisterModal } from './components/SellerRegisterModal';
import { CreateVideoModal } from './components/CreateVideoModal';
import { AddProductModal } from './components/AddProductModal';
import { EditProfileModal } from './components/EditProfileModal';
import { CheckCircle, Wrench } from 'lucide-react';
import {
  savePostToDB,
  getAllPostsFromDB,
  deletePostFromDB,
  updatePostInDB,
  reconstructClipsFromRecords,
} from './utils/indexedDB';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tokshop_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('tokshop_products', JSON.stringify(products));
  }, [products]);

  const [videos, setVideos] = useState<VideoClip[]>(INITIAL_VIDEOS);

  // Load persistent user posts and large video/photo blobs from browser IndexedDB
  useEffect(() => {
    let isCancelled = false;

    async function loadPersistedPosts() {
      try {
        const records = await getAllPostsFromDB();
        if (isCancelled || records.length === 0) return;

        const storedClips = reconstructClipsFromRecords(records);
        setVideos((prev) => {
          const storedIds = new Set(storedClips.map((c) => c.id));
          const remainingDefaults = prev.filter((v) => !storedIds.has(v.id));

          // Ensure video1.mp4 is the leading default clip
          const video1Clip = remainingDefaults.find(
            (c) => c.videoUrl.includes('video1.mp4') || c.id === 'vid-video1-01'
          );
          const orderedDefaults = video1Clip
            ? [video1Clip, ...remainingDefaults.filter((c) => c !== video1Clip)]
            : remainingDefaults;

          // User's persisted posts come first so they are immediately visible on refresh, followed by defaults
          return [...storedClips, ...orderedDefaults];
        });
      } catch (err) {
        console.error('Failed to load posts from IndexedDB:', err);
      }
    }

    loadPersistedPosts();

    return () => {
      isCancelled = true;
    };
  }, []);

  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('tokshop_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('tokshop_categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => {
      if (prev.some((c) => c.id === newCat.id)) return prev;
      return [...prev, newCat];
    });
  };

  const handleUpdateCategory = (updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  // User Profile state (Google / Gmail login)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tokshop_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      id: 'usr-golden-river',
      email: 'goldenrivercity@gmail.com',
      name: 'Golden River City',
      handle: '@goldenriver_official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: '✨ สายแฟชั่น & ครีเอเตอร์ TikTok Thailand ยินดีต้อนรับสู่โปรไฟล์ของฉัน',
      followingCount: 48,
      followersCount: 14500,
      likesCount: 242000,
      isLoggedIn: true,
      isSeller: false, // ยังไม่ได้สมัครสมาชิกขายปักตระกล้า (มีปุ่มให้กดสมัครได้ทันที)
    };
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true); // start muted for autoplay compliance
  const [activeNavTab, setActiveNavTab] = useState<TopNavTab>('foryou');
  const [activeBottomTab, setActiveBottomTab] = useState<string>('home');

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isCreateVideoModalOpen, setIsCreateVideoModalOpen] = useState<boolean>(false);
  const [isSellerRegisterModalOpen, setIsSellerRegisterModalOpen] = useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [editProfileField, setEditProfileField] = useState<'avatar' | 'name'>('avatar');

  const displayedVideos = React.useMemo(() => {
    if (activeNavTab === 'following') {
      const followed = videos.filter((v) => v.creator.isFollowing);
      return followed.length > 0 ? followed : videos;
    }
    if (activeNavTab === 'friends') {
      return videos.filter((_, idx) => idx % 2 === 0);
    }
    return videos;
  }, [videos, activeNavTab]);

  // Admin Dashboard View
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Modals / Drawers state
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Scroll to clip by index
  const scrollToClip = useCallback((index: number) => {
    if (!containerRef.current) return;
    const boundedIndex = Math.max(0, Math.min(index, videos.length - 1));
    const containerHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: boundedIndex * containerHeight,
      behavior: 'smooth',
    });
    setActiveIndex(boundedIndex);
  }, [videos.length]);

  // Handle scroll events with debounce/threshold
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const itemHeight = container.clientHeight;
    if (itemHeight === 0) return;

    const currentScroll = container.scrollTop;
    const newIndex = Math.round(currentScroll / itemHeight);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < videos.length) {
      setActiveIndex(newIndex);
    }
  };

  // Keyboard navigation (ArrowUp, ArrowDown, Space, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        isAdminOpen ||
        activeBottomTab !== 'home'
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        scrollToClip(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        scrollToClip(activeIndex - 1);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollToClip, isAdminOpen, activeBottomTab]);

  // Feed interactions
  const handleToggleLike = (id: string) => {
    setVideos((prev) =>
      prev.map((clip) => {
        if (clip.id === id) {
          const isLiked = !clip.isLiked;
          const updated = {
            ...clip,
            isLiked,
            likesCount: isLiked ? clip.likesCount + 1 : clip.likesCount - 1,
          };
          updatePostInDB(updated).catch(() => {});
          return updated;
        }
        return clip;
      })
    );
  };

  const handleToggleFollow = (creatorId: string) => {
    setVideos((prev) =>
      prev.map((clip) => {
        if (clip.creator.id === creatorId) {
          const isFollowing = !clip.creator.isFollowing;
          return {
            ...clip,
            creator: {
              ...clip.creator,
              isFollowing,
            },
          };
        }
        return clip;
      })
    );
  };

  const handleAddComment = (text: string) => {
    setVideos((prev) =>
      prev.map((clip, index) => {
        if (index === activeIndex) {
          const newComment = {
            id: 'c-new-' + Date.now(),
            username: 'you_fashionista',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            text,
            timeAgo: 'เมื่อสักครู่',
            likes: 0,
            isLiked: false,
          };
          const updated = {
            ...clip,
            commentsCount: clip.commentsCount + 1,
            comments: [newComment, ...clip.comments],
          };
          updatePostInDB(updated).catch(() => {});
          return updated;
        }
        return clip;
      })
    );
  };

  // Order Placement Handler
  const handleOrderSuccess = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct stock from product
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newOrder.productId) {
          return {
            ...p,
            stock: Math.max(0, (p.stock || 50) - newOrder.quantity),
          };
        }
        return p;
      })
    );
    showToast(`สั่งซื้อสำเร็จ! รหัส ${newOrder.id} บันทึกลงระบบหลังบ้านแล้ว`);
  };

  // Admin Dashboard Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`เพิ่มสินค้า ${newProd.name} สำเร็จ!`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    // Also update any video currently pinning this product
    setVideos((prev) =>
      prev.map((v) =>
        v.product?.id === updatedProd.id ? { ...v, product: updatedProd } : v
      )
    );
    showToast(`แก้ไขข้อมูลสินค้า ${updatedProd.name} สำเร็จ!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('ลบสินค้าเรียบร้อยแล้ว');
  };

  const handleAddVideo = async (newVideo: VideoClip, mediaBlob?: Blob | File) => {
    try {
      await savePostToDB(newVideo, mediaBlob);
    } catch (e) {
      console.warn('Failed to save video to IndexedDB:', e);
    }
    setVideos((prev) => [newVideo, ...prev]);
    setActiveIndex(0);
    setActiveBottomTab('home');
    showToast('อัปโหลดคลิปวิดีโอใหม่ลงฟีดสำเร็จ! บันทึกไฟล์ลง IndexedDB ของเครื่องแล้ว');
  };

  const handleDeleteVideo = async (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    try {
      await deletePostFromDB(videoId);
    } catch (e) {
      console.warn('Failed to delete video from IndexedDB:', e);
    }
    setActiveIndex(0);
    showToast('ลบคลิปวิดีโอออกจากระบบและ IndexedDB แล้ว');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`อัปเดตสถานะออร์เดอร์ ${orderId} แล้ว`);
  };

  const currentClip = videos[activeIndex] || videos[0] || INITIAL_VIDEOS[0];

  return (
    <div className="w-full h-full min-h-screen bg-black text-white font-sans m-0 p-0 flex justify-center items-center overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* หน้าจอมือถือเดี่ยวๆ พอดีกับมือถือ (Single Mobile Screen) */}
      <div className="relative w-full h-full sm:max-w-sm sm:h-[844px] sm:max-h-[96vh] bg-black sm:rounded-3xl overflow-hidden sm:shadow-2xl flex flex-col justify-between sm:border sm:border-gray-800">
        
        {/* VIEW 1: HOME VIDEO FEED (หน้าแรก) */}
        {activeBottomTab === 'home' && (
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
            {/* 2. หัวข้อด้านบน (LIVE | กำลังติดตาม | เพื่อน | สำหรับคุณ) */}
            <TopNav
              activeTab={activeNavTab}
              onTabChange={setActiveNavTab}
              onOpenSearch={() => {
                setActiveBottomTab('shop');
                showToast('ค้นหาสินค้าในร้านค้า');
              }}
            />

            {/* LIVE STREAM BROADCAST (เมื่อกดแท็บ LIVE ด้านบน) */}
            {activeNavTab === 'live' ? (
              <LiveStreamView
                product={products[0]}
                onOpenCheckout={(prod) => setCheckoutProduct(prod)}
                onClose={() => setActiveNavTab('foryou')}
              />
            ) : (
              /* Scrollable Snap Feed (กำลังติดตาม | เพื่อน | สำหรับคุณ) */
              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar flex-1 relative bg-black"
              >
                {displayedVideos.map((clip, index) => (
                  <VideoItem
                    key={clip.id}
                    clip={clip}
                    isActive={index === activeIndex}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                    onToggleLike={handleToggleLike}
                    onToggleFollow={handleToggleFollow}
                    onOpenComments={() => setIsCommentsOpen(true)}
                    onOpenShare={() => setIsShareOpen(true)}
                    onOpenCheckout={(prod) => setCheckoutProduct(prod)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SHOP CATALOG (ร้านค้า) */}
        {activeBottomTab === 'shop' && (
          <div className="relative w-full h-full flex flex-col pt-3 bg-zinc-950">
            <div className="flex items-center justify-between px-3.5 pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🛍️</span>
                <h2 className="text-sm font-bold text-white">ร้านค้า (TikTok Shop)</h2>
              </div>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-[11px] bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium cursor-pointer"
              >
                <Wrench className="w-3 h-3" />
                <span>หลังบ้าน</span>
              </button>
            </div>

            <ShopCatalogView
              products={products}
              onOpenCheckout={(prod) => setCheckoutProduct(prod)}
            />
          </div>
        )}

        {/* VIEW: FRIENDS (เพื่อน) */}
        {activeBottomTab === 'friends' && (
          <div className="relative w-full h-full flex flex-col p-4 pb-20 bg-zinc-950 items-center justify-center text-center">
            <span className="text-4xl mb-2">👥</span>
            <h3 className="text-base font-bold text-white">เพื่อนของคุณ</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
              ดูคลิปวิดีโอสั้นและสินค้าที่เพื่อนของคุณกำลังแชร์ใน TikTok Shop
            </p>
            <button
              onClick={() => setActiveBottomTab('home')}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white cursor-pointer"
            >
              กลับไปดูวิดีโอหน้าแรก
            </button>
          </div>
        )}

        {/* VIEW 3: INBOX / MESSAGES (ข้อความ) */}
        {activeBottomTab === 'inbox' && (
          <div className="relative w-full h-full flex flex-col p-4 pb-20 bg-zinc-950 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>💬</span>
              <span>กล่องข้อความ & การแจ้งเตือน</span>
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs flex gap-2.5">
                <div className="w-9 h-9 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 text-base">
                  🛍️
                </div>
                <div>
                  <h4 className="font-semibold text-white">TikTok Shop อัปเดต</h4>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    คุณได้รับคูปองส่วนลด ฿50 สำหรับสั่งซื้อเสื้อยืดกราฟิกในฟีด
                  </p>
                  <span className="text-[10px] text-zinc-500 mt-1 block">วันนี้ 20:30</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs flex gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 text-base">
                  📦
                </div>
                <div>
                  <h4 className="font-semibold text-white">คำสั่งซื้อในระบบ</h4>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    มีคำสั่งซื้อทั้งหมด {orders.length} รายการในระบบหลังบ้าน
                  </p>
                  <span className="text-[10px] text-zinc-500 mt-1 block">วันนี้ 19:15</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PROFILE (โปรไฟล์ - พร้อมปุ่มแก้ไขหลังบ้าน) */}
        {activeBottomTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            videos={videos}
            products={products}
            orders={orders}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenCheckout={(prod) => setCheckoutProduct(prod)}
            onSelectVideoClip={(idx) => {
              setActiveIndex(idx);
              setActiveBottomTab('home');
            }}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={() => {
              const loggedOut: UserProfile = { ...currentUser, isLoggedIn: false };
              setCurrentUser(loggedOut);
              localStorage.setItem('tokshop_user_profile', JSON.stringify(loggedOut));
              showToast('ออกจากระบบแล้ว');
            }}
            onOpenCreateVideo={() => {
              if (!currentUser || !currentUser.isLoggedIn) {
                setIsLoginModalOpen(true);
              } else {
                setIsCreateVideoModalOpen(true);
              }
            }}
            onOpenSellerRegister={() => setIsSellerRegisterModalOpen(true)}
            onOpenAddProduct={() => setIsAddProductModalOpen(true)}
            onOpenEditProfile={(field) => {
              setEditProfileField(field || 'avatar');
              setIsEditProfileModalOpen(true);
            }}
            onDeleteVideo={handleDeleteVideo}
          />
        )}

        {/* 5. เมนูด้านล่างสุด (หน้าแรก | ร้านค้า | + | ข้อความ | โปรไฟล์) */}
        <BottomTabBar
          currentTab={activeBottomTab}
          onSelectTab={setActiveBottomTab}
          onOpenUpload={() => {
            if (!currentUser || !currentUser.isLoggedIn) {
              setIsLoginModalOpen(true);
              showToast('กรุณาเข้าสู่ระบบ Google เพื่อสร้าง VIDEO');
            } else {
              setIsCreateVideoModalOpen(true);
            }
          }}
        />
      </div>

      {/* GOOGLE / GMAIL LOGIN MODAL */}
      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`ยินดีต้อนรับ ${user.name} (${user.email}) เข้าสู่ระบบสำเร็จ!`);
        }}
      />

      {/* CREATE VIDEO MODAL (สมาชิกสร้างคลิปได้ทันที & ปักตระกล้าถ้าเป็นผู้ขาย) */}
      <CreateVideoModal
        isOpen={isCreateVideoModalOpen}
        currentUser={currentUser}
        products={products}
        onClose={() => setIsCreateVideoModalOpen(false)}
        onVideoCreated={async (newVideo, mediaBlob) => {
          try {
            await savePostToDB(newVideo, mediaBlob);
          } catch (e) {
            console.error('Failed to save post to IndexedDB:', e);
          }
          setVideos((prev) => [newVideo, ...prev]);
          setActiveIndex(0);
          setActiveBottomTab('home');
          showToast(
            newVideo.product
              ? `สร้างคลิปปักตระกล้า (${newVideo.product.name}) สำเร็จ! บันทึกลง IndexedDB แล้ว (รีเฟรชไม่หาย)`
              : 'โพสต์รูปภาพ/วิดีโอสำเร็จ! บันทึกไฟล์ลง IndexedDB ของเครื่องแล้ว (รีเฟรชไม่หาย)'
          );
        }}
        onOpenSellerRegistration={() => setIsSellerRegisterModalOpen(true)}
      />

      {/* SELLER & BASKET REGISTRATION MODAL (สมัครสมาชิกขายปักตระกล้า) */}
      <SellerRegisterModal
        isOpen={isSellerRegisterModalOpen}
        currentUser={currentUser}
        onClose={() => setIsSellerRegisterModalOpen(false)}
        onSuccess={(updatedUser) => {
          setCurrentUser(updatedUser);
          showToast('🎉 อนุมัติสิทธิ์สำเร็จ! คุณสามารถปักตระกล้าสินค้าและลงขายของในร้านค้าได้แล้ว');
        }}
      />

      {/* ADD PRODUCT MODAL (โพสต์ขายของจะไปอยู่ร้านค้า) */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        currentUser={currentUser}
        categories={categories}
        onAddCategory={handleAddCategory}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={(newProd) => {
          handleAddProduct(newProd);
          showToast(`โพสต์สินค้า ${newProd.name} ลงร้านค้า TikTok Shop สำเร็จแล้ว!`);
        }}
      />

      {/* EDIT PROFILE MODAL (เมื่อคลิกที่รูปหรือชื่อโปรไฟล์เพื่อปรับแก้ไข) */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        currentUser={currentUser}
        initialFocusField={editProfileField}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={(updatedUser) => {
          setCurrentUser(updatedUser);
          // อัปเดตข้อมูลผู้สร้างในวิดีโอของผู้ใช้เพื่อให้ชื่อและรูปตรงกันทันที
          setVideos((prev) =>
            prev.map((v) =>
              v.creator.id === updatedUser.id || v.creator.handle === currentUser.handle
                ? {
                    ...v,
                    creator: {
                      ...v.creator,
                      name: updatedUser.name,
                      handle: updatedUser.handle,
                      avatarUrl: updatedUser.avatarUrl,
                    },
                  }
                : v
            )
          );
          showToast('บันทึกการแก้ไขโปรไฟล์เรียบร้อยแล้ว!');
        }}
      />

      {/* COMMENTS DRAWER */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={currentClip?.comments || []}
        onAddComment={handleAddComment}
      />

      {/* SHARE DRAWER */}
      <ShareDrawer
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        clip={currentClip}
      />

      {/* CHECKOUT MODAL (For "สั่งซื้อสินค้าลายนี้") */}
      <CheckoutModal
        isOpen={checkoutProduct !== null}
        onClose={() => setCheckoutProduct(null)}
        product={checkoutProduct}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ADMIN DASHBOARD (หลังบ้านร้านค้า - Seller Center) */}
      {isAdminOpen && (
        <AdminDashboard
          products={products}
          videos={videos}
          orders={orders}
          categories={categories}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddVideo={handleAddVideo}
          onDeleteVideo={handleDeleteVideo}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}

