export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  salesCount: string;
  imageUrl: string;
  galleryImages?: string[];
  colors: string[];
  sizes: string[];
  description: string;
  code?: string;
  stock?: number;
  category?: string;
  weight?: number;
  shippingCarrier?: string;
  fdaNumber?: string;
  tisStandard?: string;
  registrationNumber?: string;
}

export interface StoreRegistration {
  businessName: string;
  companyNameTh: string;
  companyNameEn: string;
  registrationNumber: string; // เลขที่ทะเบียนพาณิชย์ / เลขทะเบียนนิติบุคคล 13 หลัก
  taxId: string; // เลขประจำตัวผู้เสียภาษีอากร
  dbdRegisteredNumber: string; // ทะเบียนพาณิชย์อิเล็กทรอนิกส์ DBD
  registeredDate: string;
  registeredCapital: string;
  businessType: string;
  registeredAddress: string;
  contactEmail: string;
  contactPhone: string;
  dbdStatus: 'verified' | 'pending';
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  verified?: boolean;
  isFollowing?: boolean;
}

export interface CommentItem {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
}

export interface VideoClip {
  id: string;
  videoUrl: string;
  fallbackGradient: string;
  posterUrl?: string;
  creator: Creator;
  caption: string;
  hashtags: string[];
  musicTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  product?: Product;
  comments: CommentItem[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
  isLoggedIn: boolean;
  isSeller: boolean;
  sellerInfo?: {
    shopName: string;
    registeredDate: string;
    phone: string;
    taxIdOrIdCard: string;
    promptPayNumber: string;
    shippingCarriers: string[];
    status: 'approved' | 'pending';
  };
}

export interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: 'promptpay' | 'cod' | 'card';
  status: 'pending' | 'processing' | 'shipped' | 'completed';
  createdAt: string;
  shippingCarrier?: string;
  trackingNumber?: string;
}
