import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Music,
  RefreshCw,
  Sparkles,
  Timer,
  LayoutGrid,
  Smile,
  ChevronDown,
  ChevronUp,
  Zap,
  ZapOff,
  ZoomIn,
  Volume2,
  VolumeX,
  Upload,
  Film,
  Check,
  AlertCircle,
  Tag,
  Play,
  Pause,
  Camera,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Send,
  Type,
  Trash2,
  ShoppingBag,
  Flame,
  BadgePercent,
  Truck,
} from 'lucide-react';
import { Product, VideoClip, UserProfile } from '../types/feed';

interface CreateVideoModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  products: Product[];
  onClose: () => void;
  onVideoCreated: (newVideo: VideoClip, mediaBlob?: Blob | File) => void;
  onOpenSellerRegistration: () => void;
}

// Popular TikTok Sounds for "♪ เพิ่มเสียง"
const TRENDING_SOUNDS = [
  { id: 'snd-1', title: 'CYBER NIGHTS - Original Sound', artist: 'Cyber Beat Studio', duration: '0:30' },
  { id: 'snd-2', title: 'Tokyo Lofi Chill - Acoustic Vibes', artist: 'Lofi Coffee Club', duration: '0:45' },
  { id: 'snd-3', title: 'Retro Synthwave - Miami Sunset', artist: 'Street Beat TH', duration: '0:35' },
  { id: 'snd-4', title: 'Streetwear Daily Beats 🔥', artist: 'TikTok Viral Sounds', duration: '0:25' },
  { id: 'snd-5', title: 'Original Sound - รีวิวแฟชั่นสตรีท', artist: 'Creator Exclusive', duration: '0:40' },
  { id: 'snd-6', title: 'Speed Pop Dance (Upbeat Edit)', artist: 'Trend Hits', duration: '0:28' },
];

// Preset stickers for ecommerce videos
const PRESET_STICKERS = [
  { id: 'stk-1', label: '🛒 ปักตระกล้าสินค้าตรงนี้', color: 'bg-amber-500 text-black' },
  { id: 'stk-2', label: '🔥 สินค้าขายดีประจำวัน', color: 'bg-red-600 text-white' },
  { id: 'stk-3', label: '⚡ Flash Sale ลด 50%', color: 'bg-yellow-400 text-black' },
  { id: 'stk-4', label: '⭐ การันตีผ้าเกรดพรีเมียม', color: 'bg-purple-600 text-white' },
  { id: 'stk-5', label: '🚚 ส่งฟรี มีเก็บเงินปลายทาง', color: 'bg-emerald-600 text-white' },
  { id: 'stk-6', label: '✨ คอลเลกชันใหม่ล่าสุด 2026', color: 'bg-pink-600 text-white' },
];

interface TextOverlayItem {
  id: string;
  text: string;
  color: string;
  bgColor: string;
}

export interface AREffectItem {
  id: string;
  name: string;
  category: 'props' | 'atmosphere' | 'commerce';
  icon: string;
  badge?: string;
  description: string;
}

export const AR_EFFECTS_LIST: AREffectItem[] = [
  // 1. หมวดวัตถุเสมือน AR (Virtual Props & Accessories)
  {
    id: 'sunglasses',
    name: 'แว่นกันแดดสุดคูล',
    category: 'props',
    icon: '🕶️',
    badge: 'ยอดฮิต',
    description: 'แว่นตากันแดดสีดำขลับเงาวาวสะท้อนแสงไฟ',
  },
  {
    id: 'gold_crown',
    name: 'มงกุฎทองคำราชันย์',
    category: 'props',
    icon: '👑',
    badge: 'มาแรง',
    description: 'มงกุฎทองคำประดับอัญมณีลอยเรืองแสง',
  },
  {
    id: 'cat_ears',
    name: 'หูแมวนีออนอนิเมะ',
    category: 'props',
    icon: '🐱',
    badge: 'น่ารัก',
    description: 'หูแมวไซเบอร์เรืองแสงสีชมพู-ฟ้าขยับดุ๊กดิ๊ก',
  },
  {
    id: 'angel_wings',
    name: 'ปีกนางฟ้าเรืองแสง',
    category: 'props',
    icon: '🪽',
    badge: 'ใหม่',
    description: 'ปีกขนนกนางฟ้าเปล่งแสงสีขาวออโรร่าพริ้วไหว',
  },
  {
    id: 'pink_ribbon',
    name: 'โบว์เจ้าหญิงคาวาอี้',
    category: 'props',
    icon: '🎀',
    badge: 'ฮิต',
    description: 'โบว์ผ้าซาตินสีชมพูพาสเทลน่ารักสดใส',
  },
  {
    id: 'street_cap',
    name: 'หมวกแก๊ปไฮป์บีสต์',
    category: 'props',
    icon: '🧢',
    description: 'หมวกแก๊ปสตรีทแฟชั่นสุดเท่พร้อมโลโก้',
  },

  // 2. หมวดบรรยากาศ & แอนิเมชันลอยตัว (Atmosphere & FX)
  {
    id: 'money_rain',
    name: 'ฝนธนบัตรลอยตัว',
    category: 'atmosphere',
    icon: '💸',
    badge: 'รวยๆ',
    description: 'ธนบัตรลอยโปรยปรายลงมาสมจริงทั่วทั้งหน้าจอ',
  },
  {
    id: 'floating_hearts',
    name: 'หัวใจฟรุ้งฟริ้งลอยฟ้า',
    category: 'atmosphere',
    icon: '💕',
    badge: 'ยอดนิยม',
    description: 'หัวใจเรืองแสงสีชมพูลอยฟุ้งเป็นประกาย',
  },
  {
    id: 'glitter_sparkles',
    name: 'ประกายดาวทองวิบวับ',
    category: 'atmosphere',
    icon: '✨',
    badge: 'ออโรร่า',
    description: 'ดาวทองระยิบระยับเปล่งแสงรอบตัว',
  },
  {
    id: 'fire_aura',
    name: 'เปลวเพลิงซูเปอร์ออร่า',
    category: 'atmosphere',
    icon: '🔥',
    badge: 'ทรงพลัง',
    description: 'แสงออร่าเปลวเพลิงสีทองล้อมรอบจอ',
  },
  {
    id: 'neon_lasers',
    name: 'เลเซอร์ไซเบอร์พังค์',
    category: 'atmosphere',
    icon: '⚡',
    description: 'ลำแสงเลเซอร์นีออนล้ำอนาคตเคลื่อนไหวรอบจอ',
  },

  // 3. หมวดวัตถุไลฟ์ขายของ & ป้ายโปรโมชัน 3D (E-Commerce Live Props)
  {
    id: 'sale_badge',
    name: 'ป้ายลดราคา 50% วิ่งวน',
    category: 'commerce',
    icon: '🏷️',
    badge: 'ขายดี',
    description: 'ป้าย Flash Sale ลดราคาหมุนและเต้นเรียกลูกค้า',
  },
  {
    id: 'live_hot',
    name: 'ป้ายสินค้าขายดี HOT',
    category: 'commerce',
    icon: '🔥',
    badge: 'ด่วน',
    description: 'ป้ายไฟสินค้าขายดีการันตียอดขายปัง',
  },
  {
    id: 'free_delivery',
    name: 'รถส่งฟรีทั่วไทย',
    category: 'commerce',
    icon: '🚚',
    badge: 'ส่งฟรี',
    description: 'รถส่งของวิ่งพร้อมป้ายส่งฟรีมีคูปอง',
  },
];

export interface SampleVideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  tag: string;
}

// Preset viral TikTok sample videos for quick 1-tap import
export const PRESET_SAMPLE_VIDEOS: SampleVideoItem[] = [
  {
    id: 'sample-motor',
    title: 'มอเตอร์ไซค์ Superbike & Biker Racing (video1.mp4)',
    category: 'ยานยนต์ & สปอร์ต',
    duration: '0:10',
    videoUrl: '/video1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80',
    tag: 'คลิปหลัก 🏍️',
  },
  {
    id: 'sample-1',
    title: 'รีวิวเสื้อยืด Streetwear สตรีทซิตี้',
    category: 'เสื้อผ้า & แฟชั่น',
    duration: '0:15',
    videoUrl: '/city.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    tag: 'ยอดนิยม 🔥',
  },
  {
    id: 'sample-2',
    title: 'ถ่ายแบบสตูดิโอ & แฟชั่นมินิมอล ดอกไม้',
    category: 'แฟชั่น & โมเดล',
    duration: '0:12',
    videoUrl: '/flower.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
    tag: 'บิวตี้ ✨',
  },
  {
    id: 'sample-3',
    title: 'มอเตอร์สปอร์ต & เรซซิ่ง แรลลี่ (motor.mp4)',
    category: 'ยานยนต์ & สปอร์ต',
    duration: '0:10',
    videoUrl: '/motor.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&auto=format&fit=crop&q=80',
    tag: 'เร่งแรง ⚡',
  },
  {
    id: 'sample-4',
    title: 'สไตล์ซิตี้ไลฟ์ แฟชั่นวัยรุ่น',
    category: 'ไลฟ์สไตล์',
    duration: '0:15',
    videoUrl: '/city.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80',
    tag: 'ฮิต 🛹',
  },
  {
    id: 'sample-5',
    title: 'คอลเลกชันธรรมชาติ มินิมอล & บลูมมิ่ง',
    category: 'แฟชั่น & อาร์ต',
    duration: '0:12',
    videoUrl: '/flower.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    tag: 'สดใส 🌸',
  },
];

export const CreateVideoModal: React.FC<CreateVideoModalProps> = ({
  isOpen,
  currentUser,
  products,
  onClose,
  onVideoCreated,
  onOpenSellerRegistration,
}) => {
  // Phase: 'editor' (video & camera tools & effects) or 'post' (caption, pin basket & publish)
  const [phase, setPhase] = useState<'editor' | 'post'>('editor');

  // Camera stream & media states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const uploadedVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(true);

  // Loaded / Uploaded Video State (ย้ายมาอยู่หน้าเดียวกันกับเครื่องมือ)
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');
  const [selectedMediaBlob, setSelectedMediaBlob] = useState<Blob | File | null>(null);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Video Import & Library Drawer State (แก้ปัญหาหาวิดีโอไม่เจอ โดยมีทั้งคลังคลิปพร้อมใช้ อัปโหลดจากเครื่อง และลิงก์ URL)
  const [isUploadPickerOpen, setIsUploadPickerOpen] = useState<boolean>(false);
  const [customVideoUrlInput, setCustomVideoUrlInput] = useState<string>('');
  const [uploadPickerTab, setUploadPickerTab] = useState<'preset' | 'device' | 'url'>('preset');

  // Active Camera / Video Tools (ตามรูปและคำขอของผู้ใช้)
  const [activeMode, setActiveMode] = useState<'60s' | '30s' | '15s' | 'photo' | 'text'>('30s');
  const [selectedMusic, setSelectedMusic] = useState<string>('เพิ่มเสียง');
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);
  
  // Right Toolbar states
  const [speed, setSpeed] = useState<'0.5x' | '1x' | '2x' | '3x'>('1x');
  const [isSpeedOpen, setIsSpeedOpen] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<0 | 3 | 10 | 30>(0);
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  
  // Effects, AR Objects & Beauty Filters (เปิดใช้งานระบบเอฟเฟกต์ & วัตถุเสมือน AR เต็มรูปแบบ)
  const [activeArEffect, setActiveArEffect] = useState<string | null>(null);
  const [isEffectsDrawerOpen, setIsEffectsDrawerOpen] = useState<boolean>(false);
  const [effectsFilterCategory, setEffectsFilterCategory] = useState<'all' | 'props' | 'atmosphere' | 'commerce'>('all');
  const [beautyFilter, setBeautyFilter] = useState<'none' | 'smooth' | 'glow' | 'cyber' | 'vintage' | 'mono'>('none');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [showMoreTools, setShowMoreTools] = useState<boolean>(false);
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Text Overlays state (ใส่ข้อความบนวิดีโอ)
  const [textOverlays, setTextOverlays] = useState<TextOverlayItem[]>([]);
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const [newTextInput, setNewTextInput] = useState<string>('');
  const [newTextColor, setNewTextColor] = useState<string>('#ffffff');
  const [newTextBg, setNewTextBg] = useState<string>('rgba(0,0,0,0.7)');

  // Stickers state (สติ๊กเกอร์ป้ายกำกับ)
  const [activeStickers, setActiveStickers] = useState<string[]>([]);
  const [isStickersOpen, setIsStickersOpen] = useState<boolean>(false);

  // Recording & timer state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bottom main capture state
  const [bottomTab, setBottomTab] = useState<'camera' | 'creative' | 'live'>('camera');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Post / Publish state
  const [caption, setCaption] = useState<string>('เสื้อยืดพรีเมียมทรงสวย ใส่สบายมาก สั่งซื้อได้ที่ตระกล้าเลย! ✨');
  const [hashtags, setHashtags] = useState<string>('#TikTokShop #พิกัดเสื้อผ้า #รีวิว #แต่งตัวเท่ๆ');
  const [isPinningBasket, setIsPinningBasket] = useState<boolean>(currentUser.isSeller);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Start / stop camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    // Only run real camera if user hasn't loaded/uploaded a video yet
    if (phase === 'editor' && !selectedMediaUrl) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, phase, facingMode, selectedMediaUrl]);

  // Adjust video playback speed when speed state changes
  useEffect(() => {
    if (uploadedVideoRef.current) {
      const rate = speed === '0.5x' ? 0.5 : speed === '2x' ? 2 : speed === '3x' ? 3 : 1;
      uploadedVideoRef.current.playbackRate = rate;
    }
  }, [speed]);

  // Adjust volume & audio gain boost (รองรับการเร่งเสียงสูงสุด 200%)
  useEffect(() => {
    if (uploadedVideoRef.current) {
      uploadedVideoRef.current.muted = isMuted;
      const targetGain = isMuted ? 0 : volume / 100;
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = targetGain;
        uploadedVideoRef.current.volume = 1;
      } else {
        uploadedVideoRef.current.volume = Math.min(1, Math.max(0, targetGain));
      }
      if (!isMuted && audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    }
  }, [volume, isMuted, selectedMediaUrl]);

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: true,
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(() => {});
        }
        setHasCameraAccess(true);
      } else {
        setHasCameraAccess(false);
      }
    } catch (err) {
      console.warn('Camera access error or denied:', err);
      setHasCameraAccess(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Switch front / back camera
  const handleFlipCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // File upload from device album:
  // KEY CHANGE: Video stays right on the same screen as the tools and effects!
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedMediaBlob(file);
      const url = URL.createObjectURL(file);
      setSelectedMediaUrl(url);
      setIsPhotoCaptured(file.type.startsWith('image/'));
      setIsPlaying(true);
      setIsMuted(false); // ต้นฉบับมีเสียง: เปิดเสียงทันที
      setVolume(100);
      setPhase('editor');
      setIsUploadPickerOpen(false);
    }
  };

  // Quick 1-tap select from preset viral TikTok sample videos
  const handleSelectPresetVideo = (url: string) => {
    setSelectedMediaBlob(null);
    setSelectedMediaUrl(url);
    setIsPhotoCaptured(false);
    setIsPlaying(true);
    setIsMuted(false);
    setVolume(100);
    setPhase('editor');
    setIsUploadPickerOpen(false);
  };

  // Import video via direct URL
  const handleImportUrlVideo = (urlToImport?: string) => {
    const url = urlToImport || customVideoUrlInput.trim();
    if (!url) {
      alert('กรุณากรอกลิงก์วิดีโอ (URL)');
      return;
    }
    setSelectedMediaBlob(null);
    setSelectedMediaUrl(url);
    setIsPhotoCaptured(false);
    setIsPlaying(true);
    setIsMuted(false);
    setVolume(100);
    setPhase('editor');
    setCustomVideoUrlInput('');
    setIsUploadPickerOpen(false);
  };

  // Capture Photo
  const handleCapturePhoto = () => {
    setFlashOn(true);
    setTimeout(() => setFlashOn(false), 200);

    if (videoRef.current && hasCameraAccess) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 720;
        canvas.height = videoRef.current.videoHeight || 1280;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              setSelectedMediaBlob(blob);
            }
          }, 'image/jpeg', 0.95);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setSelectedMediaUrl(dataUrl);
          setIsPhotoCaptured(true);
          return;
        }
      } catch (e) {
        console.warn('Canvas snapshot error, using simulated capture:', e);
      }
    }

    setSelectedMediaUrl(
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80'
    );
    setIsPhotoCaptured(true);
  };

  // Start / Stop Video Recording
  const handleStartRecording = () => {
    const maxDuration = activeMode === '60s' ? 60 : activeMode === '30s' ? 30 : 15;

    if (timerDuration > 0 && countdown === null) {
      let count = timerDuration;
      setCountdown(count);
      const timerInt = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(timerInt);
          setCountdown(null);
          beginActualRecording(maxDuration);
        } else {
          setCountdown(count);
        }
      }, 1000);
      return;
    }

    beginActualRecording(maxDuration);
  };

  const beginActualRecording = (maxDuration: number) => {
    setIsRecording(true);
    setRecordedSeconds(0);
    recordedChunksRef.current = [];

    if (stream && typeof MediaRecorder !== 'undefined') {
      try {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
          setSelectedMediaBlob(blob);
          const videoUrl = URL.createObjectURL(blob);
          setSelectedMediaUrl(videoUrl);
          setIsPhotoCaptured(false);
          setIsPlaying(true);
          setIsMuted(false);
          setVolume(100);
        };
        recorder.start(100);
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.warn('MediaRecorder error, using fallback timer recording:', err);
      }
    }

    recordingTimerRef.current = setInterval(() => {
      setRecordedSeconds((prev) => {
        const next = prev + 1;
        if (next >= maxDuration) {
          handleStopRecording();
          return maxDuration;
        }
        return next;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setSelectedMediaUrl('/city.mp4');
      setIsPhotoCaptured(false);
      setIsPlaying(true);
    }
  };

  // Main Shutter Button Click
  const handleShutterClick = () => {
    if (activeMode === 'photo') {
      handleCapturePhoto();
    } else {
      if (isRecording) {
        handleStopRecording();
      } else {
        handleStartRecording();
      }
    }
  };

  // Toggle Play / Pause on loaded video
  const handleTogglePlay = () => {
    if (uploadedVideoRef.current) {
      if (isPlaying) {
        uploadedVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        uploadedVideoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Add Text Overlay
  const handleAddTextOverlay = () => {
    if (!newTextInput.trim()) {
      setIsAddingText(false);
      return;
    }
    const newItem: TextOverlayItem = {
      id: 'txt-' + Date.now(),
      text: newTextInput.trim(),
      color: newTextColor,
      bgColor: newTextBg,
    };
    setTextOverlays((prev) => [...prev, newItem]);
    setNewTextInput('');
    setIsAddingText(false);
  };

  const handleRemoveTextOverlay = (id: string) => {
    setTextOverlays((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Sticker
  const handleToggleSticker = (stickerLabel: string) => {
    setActiveStickers((prev) =>
      prev.includes(stickerLabel)
        ? prev.filter((s) => s !== stickerLabel)
        : [...prev, stickerLabel]
    );
  };

  // Clear loaded video and return to clean live camera
  const handleResetToCamera = () => {
    setSelectedMediaUrl('');
    setSelectedMediaBlob(null);
    setIsPhotoCaptured(false);
    setIsPlaying(true);
    setIsMuted(false);
    setVolume(100);
    setIsVolumeOpen(false);
    setTextOverlays([]);
    setActiveStickers([]);
  };

  // Proceed to Publish Screen
  const handleProceedToPost = () => {
    if (!selectedMediaUrl) {
      alert('กรุณาอัดวิดีโอหรือเลือกคลิปวิดีโอก่อนกดถัดไปครับ');
      return;
    }
    setPhase('post');
  };

  // Submit and Publish Video
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      alert('กรุณากรอกแคปชันวิดีโอ');
      return;
    }

    setIsUploading(true);

    const pinnedProduct = isPinningBasket && currentUser.isSeller
      ? (products.find((p) => p.id === selectedProductId) || products[0])
      : undefined;

    const parsedHashtags = hashtags
      .split(' ')
      .map((tag) => tag.trim())
      .filter((tag) => tag.startsWith('#'));

    // Prepare media blob for persistent IndexedDB storage
    let mediaBlobToSave: Blob | File | undefined = selectedMediaBlob || undefined;
    if (!mediaBlobToSave && selectedMediaUrl) {
      if (selectedMediaUrl.startsWith('blob:') || selectedMediaUrl.startsWith('data:')) {
        try {
          const res = await fetch(selectedMediaUrl);
          mediaBlobToSave = await res.blob();
        } catch (err) {
          console.warn('Could not extract blob from url for IndexedDB storage:', err);
        }
      }
    }

    const newClip: VideoClip = {
      id: 'vid-user-' + Date.now(),
      videoUrl:
        selectedMediaUrl ||
        '/motor.mp4',
      fallbackGradient: 'from-purple-950 via-zinc-900 to-black',
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatarUrl: currentUser.avatarUrl,
        verified: currentUser.isSeller,
        isFollowing: true,
      },
      caption: caption.trim(),
      hashtags: parsedHashtags.length > 0 ? parsedHashtags : ['#TikTokShop', '#รีวิวสินค้า'],
      musicTitle: selectedMusic === 'เพิ่มเสียง' ? `Original Sound - ${currentUser.name}` : selectedMusic,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
      product: pinnedProduct,
      comments: [],
    };

    setTimeout(() => {
      setIsUploading(false);
      onVideoCreated(newClip, mediaBlobToSave);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  const maxSec = activeMode === '60s' ? 60 : activeMode === '30s' ? 30 : 15;
  const progressPercent = Math.min(100, (recordedSeconds / maxSec) * 100);
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Helper CSS filter class based on active beauty filter
  const getFilterStyle = (filter: typeof beautyFilter) => {
    switch (filter) {
      case 'smooth':
        return 'brightness-105 contrast-95 saturate-110';
      case 'glow':
        return 'brightness-110 contrast-105 saturate-125';
      case 'cyber':
        return 'hue-rotate-25 contrast-115 saturate-135';
      case 'vintage':
        return 'sepia contrast-110 brightness-95';
      case 'mono':
        return 'grayscale contrast-125';
      default:
        return '';
    }
  };

  // Render active AR Virtual Object / Effect on top of camera or video
  const renderArEffect = (effectId: string) => {
    switch (effectId) {
      case 'sunglasses':
        return (
          <div className="relative animate-gentle-bob -translate-y-16 flex flex-col items-center">
            <div className="relative flex items-center filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]">
              {/* Left Lens */}
              <div className="w-24 h-14 rounded-b-[28px] rounded-t-[10px] bg-gradient-to-b from-zinc-800 via-zinc-950 to-black border-2 border-amber-400 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-3 -left-6 w-14 h-24 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-25 pointer-events-none" />
                <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              {/* Center Gold Bridge */}
              <div className="w-5 h-2 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 shadow -mt-4 rounded-full" />
              {/* Right Lens */}
              <div className="w-24 h-14 rounded-b-[28px] rounded-t-[10px] bg-gradient-to-b from-zinc-800 via-zinc-950 to-black border-2 border-amber-400 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-3 -left-6 w-14 h-24 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-25 pointer-events-none" />
                <div className="absolute bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
            </div>
            {/* VIP Brand Badge */}
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-black/75 text-[9px] font-mono tracking-widest text-amber-300 border border-amber-400/50 shadow">
              ★ VIP STREETWEAR SHADES ★
            </span>
          </div>
        );

      case 'gold_crown':
        return (
          <div className="relative animate-gentle-bob -translate-y-36 flex flex-col items-center">
            <div className="relative w-44 h-28 filter drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] flex items-end justify-center">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                <defs>
                  <linearGradient id="crownGradModal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#CA8A04" />
                  </linearGradient>
                </defs>
                <polygon
                  points="10,105 190,105 185,45 150,75 100,20 50,75 15,45"
                  fill="url(#crownGradModal)"
                  stroke="#FEF08A"
                  strokeWidth="3"
                />
                <rect x="10" y="95" width="180" height="15" rx="5" fill="#A16207" />
                <rect x="12" y="97" width="176" height="11" rx="4" fill="url(#crownGradModal)" />
                <circle cx="100" cy="20" r="9" fill="#F43F5E" stroke="#FFF" strokeWidth="2" />
                <circle cx="15" cy="45" r="7" fill="#3B82F6" stroke="#FFF" strokeWidth="1.5" />
                <circle cx="185" cy="45" r="7" fill="#3B82F6" stroke="#FFF" strokeWidth="1.5" />
                <circle cx="50" cy="75" r="6" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
                <circle cx="150" cy="75" r="6" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="absolute -top-3 -left-3 text-xl animate-ping">✨</span>
            <span className="absolute -top-4 right-1 text-2xl animate-bounce">✨</span>
            <span className="absolute top-12 -right-4 text-lg animate-pulse">💎</span>
          </div>
        );

      case 'cat_ears':
        return (
          <div className="relative animate-gentle-bob -translate-y-40 w-64 flex justify-between px-6 filter drop-shadow-[0_0_25px_rgba(244,114,182,0.95)]">
            <div className="relative w-20 h-24 rotate-[-12deg] animate-wing-left">
              <svg viewBox="0 0 100 120" className="w-full h-full">
                <polygon points="5,115 50,10 95,115" fill="#18181B" stroke="#F472B6" strokeWidth="6" />
                <polygon points="25,110 50,40 75,110" fill="#EC4899" />
                <circle cx="50" cy="25" r="4" fill="#67E8F9" />
              </svg>
            </div>
            <div className="relative w-20 h-24 rotate-[12deg] animate-wing-right">
              <svg viewBox="0 0 100 120" className="w-full h-full">
                <polygon points="5,115 50,10 95,115" fill="#18181B" stroke="#F472B6" strokeWidth="6" />
                <polygon points="25,110 50,40 75,110" fill="#EC4899" />
                <circle cx="50" cy="25" r="4" fill="#67E8F9" />
              </svg>
            </div>
          </div>
        );

      case 'angel_wings':
        return (
          <div className="absolute inset-0 flex items-center justify-between px-2 filter drop-shadow-[0_0_35px_rgba(255,255,255,0.95)] pointer-events-none">
            <div className="w-40 h-64 -translate-x-4 animate-wing-left">
              <svg viewBox="0 0 160 260" className="w-full h-full">
                <path
                  d="M150,130 C120,40 60,20 10,60 C-5,85 10,120 40,140 C10,150 15,180 50,195 C25,205 35,235 70,240 C110,245 140,200 150,130 Z"
                  fill="rgba(255,255,255,0.85)"
                  stroke="#A5F3FC"
                  strokeWidth="3"
                />
                <path d="M140,110 C100,50 60,60 30,90" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <path d="M135,140 C100,100 65,115 45,145" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <path d="M130,170 C95,145 70,165 55,190" stroke="#38BDF8" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="w-40 h-64 translate-x-4 animate-wing-right">
              <svg viewBox="0 0 160 260" className="w-full h-full scale-x-[-1]">
                <path
                  d="M150,130 C120,40 60,20 10,60 C-5,85 10,120 40,140 C10,150 15,180 50,195 C25,205 35,235 70,240 C110,245 140,200 150,130 Z"
                  fill="rgba(255,255,255,0.85)"
                  stroke="#A5F3FC"
                  strokeWidth="3"
                />
                <path d="M140,110 C100,50 60,60 30,90" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <path d="M135,140 C100,100 65,115 45,145" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <path d="M130,170 C95,145 70,165 55,190" stroke="#38BDF8" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        );

      case 'pink_ribbon':
        return (
          <div className="relative animate-gentle-bob -translate-y-36 flex flex-col items-center filter drop-shadow-[0_0_25px_rgba(244,114,182,0.9)]">
            <div className="text-8xl">🎀</div>
            <span className="mt-[-10px] px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-bold shadow">
              KAWAII PRINCESS
            </span>
          </div>
        );

      case 'street_cap':
        return (
          <div className="relative animate-gentle-bob -translate-y-36 flex flex-col items-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]">
            <div className="text-8xl">🧢</div>
            <span className="mt-[-12px] px-2.5 py-0.5 rounded-full bg-red-600 text-[8px] font-black tracking-widest text-white border border-white/60 shadow">
              STREETWEAR 2026
            </span>
          </div>
        );

      case 'money_rain':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(14)].map((_, i) => {
              const left = `${(i * 7.5 + 4) % 94}%`;
              const delay = `${(i * 0.35) % 2.5}s`;
              const duration = `${2.4 + ((i * 0.4) % 1.6)}s`;
              const isBhat = i % 2 === 0;
              return (
                <div
                  key={i}
                  className="absolute top-0 flex items-center justify-center filter drop-shadow-lg"
                  style={{
                    left,
                    animation: `fall-rain ${duration} linear ${delay} infinite`,
                  }}
                >
                  {isBhat ? (
                    <div className="px-2 py-1 rounded bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-mono font-bold text-[10px] border border-emerald-300 shadow-md flex items-center gap-1 rotate-12">
                      <span>฿</span>
                      <span>1,000</span>
                    </div>
                  ) : (
                    <div className="px-2 py-1 rounded bg-gradient-to-r from-green-700 to-emerald-900 text-emerald-100 font-mono font-bold text-[10px] border border-green-300 shadow-md flex items-center gap-1 -rotate-6">
                      <span>$</span>
                      <span>100</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'floating_hearts':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => {
              const left = `${(i * 8.5 + 5) % 92}%`;
              const delay = `${(i * 0.45) % 3}s`;
              const duration = `${3 + ((i * 0.3) % 1.5)}s`;
              const emoji = ['💖', '💕', '💗', '💓', '✨', '🥰'][i % 6];
              return (
                <div
                  key={i}
                  className="absolute bottom-6 text-2xl filter drop-shadow-[0_0_15px_rgba(244,114,182,0.95)]"
                  style={{
                    left,
                    animation: `float-up-particle ${duration} ease-in ${delay} infinite`,
                  }}
                >
                  {emoji}
                </div>
              );
            })}
          </div>
        );

      case 'glitter_sparkles':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(16)].map((_, i) => {
              const left = `${(i * 13 + 7) % 90}%`;
              const top = `${(i * 17 + 10) % 85}%`;
              const delay = `${(i * 0.25) % 2}s`;
              const duration = `${1.4 + ((i * 0.3) % 1.2)}s`;
              return (
                <div
                  key={i}
                  className="absolute text-yellow-300 text-2xl filter drop-shadow-[0_0_12px_rgba(253,224,71,1)]"
                  style={{
                    left,
                    top,
                    animation: `star-twinkle ${duration} ease-in-out ${delay} infinite`,
                  }}
                >
                  ✦
                </div>
              );
            })}
          </div>
        );

      case 'fire_aura':
        return (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            <div className="absolute inset-0 border-[6px] border-amber-400/70 rounded-none shadow-[inset_0_0_50px_rgba(245,158,11,0.6)] animate-pulse-aura" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-red-600/40 via-amber-500/20 to-transparent flex justify-around items-end pb-4">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                  🔥
                </span>
              ))}
            </div>
          </div>
        );

      case 'neon_lasers':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 border border-cyan-400/40 pointer-events-none">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
            </div>
            <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-pulse" style={{ top: '40%' }} />
            <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-[0_0_20px_#f43f5e] animate-pulse" style={{ top: '65%' }} />
            <div className="absolute bottom-16 right-6 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400 text-[9px] font-mono text-cyan-300">
              AR_TARGET: LOCKED [99.8%]
            </div>
          </div>
        );

      case 'sale_badge':
        return (
          <div className="absolute top-28 right-5 animate-gentle-bob filter drop-shadow-[0_10px_25px_rgba(239,68,68,0.7)] pointer-events-auto">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 p-1 flex items-center justify-center text-center shadow-2xl animate-spin-slow">
              <div className="w-full h-full rounded-full bg-zinc-950 flex flex-col items-center justify-center p-1 text-white border border-amber-300">
                <span className="text-[10px] font-extrabold text-amber-300">FLASH</span>
                <span className="text-xl font-black text-rose-500 leading-none">50%</span>
                <span className="text-[9px] font-bold text-white uppercase tracking-wider">OFF</span>
              </div>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-extrabold text-center shadow">
              ⚡ ลดกระหน่ำ
            </div>
          </div>
        );

      case 'live_hot':
        return (
          <div className="absolute top-24 left-4 animate-bounce filter drop-shadow-[0_8px_20px_rgba(249,115,22,0.8)] pointer-events-auto">
            <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-2xl flex items-center gap-1.5 border border-white/40">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>🔥 สินค้าขายดี HOT ITEM</span>
            </div>
          </div>
        );

      case 'free_delivery':
        return (
          <div className="absolute bottom-28 inset-x-6 animate-gentle-bob filter drop-shadow-[0_10px_25px_rgba(16,185,129,0.7)] pointer-events-auto">
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-extrabold text-xs shadow-2xl flex items-center justify-between border-2 border-emerald-300">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚚</span>
                <div>
                  <div className="text-xs font-black">ส่งฟรี ทั่วประเทศ!</div>
                  <div className="text-[9px] text-emerald-100 font-medium">เก็บเงินปลายทาง • ไม่มีขั้นต่ำ</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg bg-white text-emerald-700 text-[10px] font-black shadow">
                ใช้โค้ดฟรี
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 sm:bg-black/85 backdrop-blur-md animate-in fade-in duration-200 sm:p-4 select-none">
      
      {/* Hidden File Input for Device Album Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*,image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* =========================================================================
          VIEW 1: CAMERA & VIDEO EDITOR SCREEN (วิดีโอและเครื่องมืออยู่หน้าเดียวกัน)
         ========================================================================= */}
      {phase === 'editor' && (
        <div className="relative w-full h-full sm:h-[92vh] sm:max-w-md sm:rounded-[36px] overflow-hidden bg-zinc-950 shadow-2xl flex flex-col justify-between border border-zinc-800 text-white">

          {/* 1. VIEWFINDER: Renders either the Loaded Video OR the Live Camera Stream */}
          <div className="absolute inset-0 z-0 bg-zinc-950 overflow-hidden flex items-center justify-center">
            
            {selectedMediaUrl ? (
              /* Case A: Video has been loaded/recorded -> Plays right here on the same screen! */
              <div
                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                onClick={handleTogglePlay}
              >
                {isPhotoCaptured ? (
                  <img
                    src={selectedMediaUrl}
                    alt="Captured preview"
                    className={`w-full h-full object-cover ${getFilterStyle(beautyFilter)}`}
                  />
                ) : (
                  <video
                    ref={(el) => {
                      uploadedVideoRef.current = el;
                      if (el && !el.dataset.boosted) {
                        el.dataset.boosted = 'true';
                        try {
                          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                          if (AudioContextClass) {
                            const ctx = new AudioContextClass();
                            const gain = ctx.createGain();
                            gain.gain.value = isMuted ? 0 : volume / 100;
                            const src = ctx.createMediaElementSource(el);
                            src.connect(gain);
                            gain.connect(ctx.destination);
                            audioCtxRef.current = ctx;
                            gainNodeRef.current = gain;
                          }
                        } catch (err) {
                          console.log('Audio booster note:', err);
                        }
                      }
                    }}
                    src={selectedMediaUrl}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className={`w-full h-full object-cover ${getFilterStyle(beautyFilter)}`}
                    style={{ transform: `scale(${zoomLevel})` }}
                    onPlay={() => {
                      if (audioCtxRef.current?.state === 'suspended') {
                        audioCtxRef.current.resume().catch(() => {});
                      }
                    }}
                  />
                )}

                {/* Floating Sound Indicator & Quick Unmute / Boost Pill on video */}
                {selectedMediaUrl && !isPhotoCaptured && (
                  <div className="absolute top-16 left-3 z-30 pointer-events-auto flex flex-col gap-1.5">
                    {isMuted ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(false);
                          if (volume === 0) setVolume(100);
                          if (uploadedVideoRef.current) {
                            uploadedVideoRef.current.muted = false;
                            uploadedVideoRef.current.play().catch(() => {});
                          }
                          if (audioCtxRef.current?.state === 'suspended') {
                            audioCtxRef.current.resume().catch(() => {});
                          }
                        }}
                        className="py-1.5 px-3 rounded-full bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold shadow-2xl flex items-center gap-1.5 backdrop-blur-md animate-bounce cursor-pointer border border-white/20 active:scale-95 transition-all"
                        title="คลิกเพื่อเปิดเสียงต้นฉบับ"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>ต้นฉบับมีเสียง • แตะเปิดเสียง 🔊</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsVolumeOpen(true);
                        }}
                        className={`py-1 px-2.5 rounded-full backdrop-blur-md text-[11px] font-bold shadow-lg flex items-center gap-1.5 cursor-pointer border transition-all active:scale-95 ${
                          volume > 100
                            ? 'bg-amber-400 text-black border-amber-300'
                            : 'bg-black/60 hover:bg-black/80 text-white border-white/15'
                        }`}
                        title="แตะเพื่อปรับระดับและเร่งเสียง"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${volume > 100 ? 'text-black animate-pulse' : 'text-emerald-400'}`} />
                        <span>เสียงต้นฉบับ: {volume}% {volume > 100 && '🔥'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Pause Indicator overlay if user paused */}
                {!isPlaying && !isPhotoCaptured && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-xs">
                    <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center text-white shadow-2xl">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
            ) : hasCameraAccess ? (
              /* Case B: Live Camera stream */
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                } ${getFilterStyle(beautyFilter)}`}
                style={{ transform: `scale(${zoomLevel}) ${facingMode === 'user' ? 'scaleX(-1)' : ''}` }}
              />
            ) : (
              /* Case C: Clean Dark Viewfinder without background image */
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
                <div className="relative w-20 h-20 rounded-full border border-white/20 flex items-center justify-center text-white/70 mb-3 shadow-inner bg-zinc-900/60">
                  <Camera className="w-9 h-9 stroke-[1.5]" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">มุมมองกล้อง (Camera Mode)</span>
                <span className="text-[10px] text-zinc-500 mt-1">แตะปุ่มอัปโหลดด้านล่างเพื่อเลือกคลิปจากเครื่อง</span>
              </div>
            )}

            {/* OVERLAY: Applied Text Overlays (ข้อความที่เพิ่มลงบนวิดีโอ) */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center items-center gap-3 p-6">
              {textOverlays.map((item) => (
                <div
                  key={item.id}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-sm shadow-2xl flex items-center gap-2 pointer-events-auto backdrop-blur-xs animate-in zoom-in-95 duration-150"
                  style={{ color: item.color, backgroundColor: item.bgColor }}
                >
                  <span>{item.text}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTextOverlay(item.id);
                    }}
                    className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-[10px] cursor-pointer"
                    title="ลบข้อความนี้"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* OVERLAY: Applied Stickers (สติ๊กเกอร์ป้ายกำกับบนวิดีโอ) */}
              {activeStickers.map((stk, idx) => {
                const preset = PRESET_STICKERS.find((p) => p.label === stk);
                return (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xl flex items-center gap-1.5 pointer-events-auto animate-bounce duration-1000 ${
                      preset?.color || 'bg-amber-500 text-black'
                    }`}
                  >
                    <span>{stk}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSticker(stk);
                      }}
                      className="w-3.5 h-3.5 rounded-full bg-black/20 flex items-center justify-center text-[9px] cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            {/* OVERLAY: Active AR Virtual Objects & Atmosphere Effects (วัตถุเสมือนและเอฟเฟกต์ที่เลือกใช้งาน) */}
            {activeArEffect && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden flex items-center justify-center">
                {renderArEffect(activeArEffect)}
              </div>
            )}

            {/* Floating Active Effect Pill (แสดงชื่อเอฟเฟกต์และปุ่มกากบาทปิดด่วน) */}
            {activeArEffect && (
              <div className="absolute top-16 right-3 z-30 pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-pink-500/60 backdrop-blur-md shadow-2xl animate-in fade-in">
                <span className="text-sm">
                  {AR_EFFECTS_LIST.find((e) => e.id === activeArEffect)?.icon}
                </span>
                <span className="text-[11px] font-bold text-pink-300">
                  {AR_EFFECTS_LIST.find((e) => e.id === activeArEffect)?.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveArEffect(null);
                  }}
                  className="ml-1 w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-[10px] text-white cursor-pointer"
                  title="ปิดเอฟเฟกต์นี้"
                >
                  ×
                </button>
              </div>
            )}

            {/* Flash screen overlay animation */}
            {flashOn && (
              <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
            )}

            {/* 3x3 Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div></div>
              </div>
            )}

            {/* Recording Progress Bar at very top */}
            {isRecording && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-zinc-800 z-30">
                <div
                  className="h-full bg-red-500 transition-all duration-300 ease-linear shadow-lg shadow-red-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            {/* Countdown Overlay (3... 2... 1...) */}
            {countdown !== null && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                <span className="text-8xl font-black text-white drop-shadow-2xl animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          {/* 2. TOP BAR: [X Close / Retake] + Center [♪ เพิ่มเสียง] + Right [ถัดไป ➔] */}
          <div className="relative z-20 pt-4 px-4 flex items-center justify-between">
            {/* Left Button */}
            {selectedMediaUrl ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetToCamera}
                  className="py-1.5 px-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 text-zinc-200 hover:text-white border border-white/10 cursor-pointer shadow-md active:scale-95 transition-all"
                  title="ลบคลิปนี้เพื่อเปิดกล้องใหม่"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ถ่ายใหม่</span>
                </button>
                <button
                  onClick={() => setIsUploadPickerOpen(true)}
                  className="py-1.5 px-3 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-xs font-semibold flex items-center gap-1.5 text-white border border-cyan-400/40 cursor-pointer shadow-md active:scale-95 transition-all"
                  title="เปลี่ยนคลิปหรือเปิดคลังวิดีโอ"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>เปลี่ยนคลิป</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all shadow-md"
                title="ปิด"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            {/* Center Pill: "♪ เพิ่มเสียง" (Sound / Music button) */}
            <button
              onClick={() => setIsMusicModalOpen(true)}
              className="py-1.5 px-4 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15 shadow-xl cursor-pointer active:scale-95 transition-all max-w-[170px]"
            >
              <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate">{selectedMusic}</span>
            </button>

            {/* Right: "ถัดไป ➔" Button (Active when video is loaded or recorded) */}
            {selectedMediaUrl ? (
              <button
                onClick={handleProceedToPost}
                className="py-1.5 px-4 rounded-full bg-gradient-to-r from-red-600 to-[#FE2C55] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1 shadow-lg shadow-red-900/40 cursor-pointer active:scale-95 transition-all"
              >
                <span>ถัดไป</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="w-10 h-10" />
            )}
          </div>

          {/* 3. RIGHT VERTICAL TOOLBAR: Complete toolset for video editing & camera */}
          <div className="absolute right-3 top-16 z-20 flex flex-col items-center gap-3.5 text-white">
            
            {/* 1) สลับกล้อง (Flip Camera - อยู่ข้างบนสุด บน T ข้อความ) */}
            {!selectedMediaUrl && (
              <button
                onClick={handleFlipCamera}
                className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform"
                title="สลับกล้องหน้า/หลัง"
              >
                <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 group-hover:border-purple-400">
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                </div>
                <span className="text-[9px] font-medium drop-shadow">สลับกล้อง</span>
              </button>
            )}

            {/* 2) ข้อความ (Text Tool - T ข้อความ) */}
            <button
              onClick={() => setIsAddingText(true)}
              className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform"
              title="เพิ่มข้อความบนวิดีโอ"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 group-hover:border-purple-400">
                <Type className="w-5 h-5 text-white" />
              </div>
              <span className="text-[9px] font-medium drop-shadow">ข้อความ</span>
            </button>

            {/* 3) เอฟเฟกต์ & วัตถุ AR (Filters & AR Effects) */}
            <button
              onClick={() => setIsEffectsDrawerOpen(true)}
              className={`flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform ${
                activeArEffect || beautyFilter !== 'none' ? 'text-pink-400' : ''
              }`}
              title="เปิดใช้งานเอฟเฟกต์และวัตถุเสมือน AR"
            >
              <div
                className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg border transition-all ${
                  activeArEffect
                    ? 'bg-gradient-to-tr from-pink-600 to-rose-600 border-pink-300 ring-2 ring-pink-400/50 scale-105'
                    : 'bg-black/40 hover:bg-black/70 border-white/10 group-hover:border-rose-400'
                }`}
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="text-[9px] font-medium drop-shadow">
                {activeArEffect ? 'เปิดอยู่' : 'เอฟเฟกต์'}
              </span>
            </button>

            {/* 4) สติ๊กเกอร์ / ป้ายตระกล้า (Stickers) */}
            <button
              onClick={() => setIsStickersOpen(!isStickersOpen)}
              className={`flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform ${
                activeStickers.length > 0 ? 'text-amber-300' : ''
              }`}
              title="สติ๊กเกอร์และป้ายตระกล้า"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 group-hover:border-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-medium drop-shadow">สติ๊กเกอร์</span>
            </button>

            {/* 5) ความเร็ว / สปีด (Speed) */}
            <button
              onClick={() => setIsSpeedOpen(!isSpeedOpen)}
              className={`flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform ${
                speed !== '1x' ? 'text-amber-300' : ''
              }`}
              title="ความเร็วการเล่น / สปีด"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-medium drop-shadow">{speed}</span>
            </button>

            {/* 6) ปุ่มเปิดเสียง / เร่งเสียงต้นฉบับ (Audio & Volume Boost Control) */}
            {selectedMediaUrl && !isPhotoCaptured && (
              <button
                onClick={() => setIsVolumeOpen(!isVolumeOpen)}
                className={`flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform ${
                  isMuted ? 'text-zinc-400' : volume > 100 ? 'text-amber-300' : 'text-emerald-400'
                }`}
                title="เปิดเสียง / ปรับเร่งเสียงต้นฉบับ (Boost สูงสุด 200%)"
              >
                <div className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg border relative transition-all ${
                  isMuted
                    ? 'bg-red-500/30 border-red-500/50 hover:bg-red-500/50 text-red-400'
                    : volume > 100
                    ? 'bg-amber-500/40 border-amber-400 hover:bg-amber-500/60 ring-2 ring-amber-400/50 text-amber-300'
                    : 'bg-black/40 border-white/10 hover:bg-black/70 text-emerald-400'
                }`}>
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : volume > 100 ? (
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                  {/* Badge indicating Boost */}
                  {!isMuted && volume > 100 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[8px] font-black px-1 rounded-full shadow-md leading-tight">
                      🔥เร่ง
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold drop-shadow">
                  {isMuted ? 'เปิดเสียง' : volume > 100 ? `เร่ง ${volume}%` : `เสียง ${volume}%`}
                </span>
              </button>
            )}

            {/* 7) ตัวจับเวลา (Timer - in camera mode) */}
            {!selectedMediaUrl && (
              <button
                onClick={() => setIsTimerOpen(!isTimerOpen)}
                className={`flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform ${
                  timerDuration > 0 ? 'text-amber-300' : ''
                }`}
                title="ตัวจับเวลานับถอยหลัง"
              >
                <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
                  <Timer className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-medium drop-shadow">
                  {timerDuration > 0 ? `${timerDuration}s` : 'เวลา'}
                </span>
              </button>
            )}

            {/* 8) ตารางจัดองค์ประกอบ (Grid) */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform ${
                showGrid ? 'text-purple-400' : ''
              }`}
              title="ตารางจัดองค์ประกอบภาพ"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-medium drop-shadow">ตาราง</span>
            </button>

            {/* 9) ปุ่มเพิ่มเติม (Expand More Tools) */}
            <button
              onClick={() => setShowMoreTools(!showMoreTools)}
              className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform"
              title="เครื่องมือเพิ่มเติม"
            >
              <div className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
                {showMoreTools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Extra Expanded Tools (Flash, Zoom) */}
            {showMoreTools && (
              <div className="flex flex-col items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => setFlashOn(!flashOn)}
                  className={`w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center border border-white/10 ${
                    flashOn ? 'text-amber-400 bg-black/80' : 'text-white'
                  }`}
                  title="ไฟแฟลช"
                >
                  {flashOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                  className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center border border-white/10 text-xs font-bold"
                  title="ซูม"
                >
                  {zoomLevel}x
                </button>
              </div>
            )}
          </div>

          {/* FLOATING POPOVER: Text Overlay Editor (หน้าต่างพิมพ์ข้อความบนคลิป) */}
          {isAddingText && (
            <div
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex flex-col justify-center items-center animate-in fade-in duration-150"
              onClick={() => setIsAddingText(false)}
            >
              <div
                className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded-3xl p-5 space-y-4 text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <Type className="w-4 h-4" />
                    <span>เพิ่มข้อความบนวิดีโอ</span>
                  </div>
                  <button
                    onClick={() => setIsAddingText(false)}
                    className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={newTextInput}
                    onChange={(e) => setNewTextInput(e.target.value)}
                    placeholder="พิมพ์ข้อความ เช่น พิกัดเสื้อในคลิป..."
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-bold text-center border border-zinc-700 outline-none focus:border-purple-500 shadow-inner"
                    style={{ color: newTextColor, backgroundColor: newTextBg }}
                  />
                </div>

                {/* Color presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-400 block font-medium">เลือกโทนสีข้อความ:</span>
                  <div className="flex justify-center gap-2">
                    {[
                      { name: 'ขาว', color: '#ffffff', bg: 'rgba(0,0,0,0.8)' },
                      { name: 'เหลือง', color: '#facc15', bg: 'rgba(0,0,0,0.85)' },
                      { name: 'ชมพู', color: '#f43f5e', bg: 'rgba(255,255,255,0.95)' },
                      { name: 'ฟ้าไซเบอร์', color: '#06b6d4', bg: 'rgba(0,0,0,0.85)' },
                      { name: 'เขียวนีออน', color: '#22c55e', bg: 'rgba(0,0,0,0.85)' },
                    ].map((pal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewTextColor(pal.color);
                          setNewTextBg(pal.bg);
                        }}
                        className="w-6 h-6 rounded-full border-2 border-white/50 cursor-pointer shadow-md hover:scale-110 transition-transform"
                        style={{ backgroundColor: pal.color }}
                        title={pal.name}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddTextOverlay}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#FE2C55] text-white font-bold text-xs shadow-lg shadow-purple-900/30 cursor-pointer active:scale-95 transition-all"
                >
                  ✓ วางข้อความลงบนคลิป
                </button>
              </div>
            </div>
          )}

          {/* FLOATING POPOVER: Stickers Selector (เลือกสติ๊กเกอร์) */}
          {isStickersOpen && (
            <div className="absolute right-16 top-36 z-30 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-2xl p-3 shadow-2xl animate-in fade-in duration-150 w-56 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                <span className="font-bold text-[11px] text-zinc-300">สติ๊กเกอร์สำหรับร้านค้า</span>
                <button onClick={() => setIsStickersOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto no-scrollbar">
                {PRESET_STICKERS.map((stk) => {
                  const isActive = activeStickers.includes(stk.label);
                  return (
                    <button
                      key={stk.id}
                      onClick={() => handleToggleSticker(stk.label)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isActive ? 'ring-2 ring-white scale-102 ' + stk.color : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      <span className="truncate">{stk.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FLOATING POPOVER: Speed Selector */}
          {isSpeedOpen && (
            <div className="absolute right-16 top-48 z-30 bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex gap-1 shadow-2xl animate-in fade-in duration-150">
              {(['0.5x', '1x', '2x', '3x'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpeed(s);
                    setIsSpeedOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                    speed === s ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* FLOATING POPOVER: Timer Selector */}
          {isTimerOpen && (
            <div className="absolute right-16 top-64 z-30 bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex gap-1 shadow-2xl animate-in fade-in duration-150">
              {([0, 3, 10, 30] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTimerDuration(t);
                    setIsTimerOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                    timerDuration === t ? 'bg-amber-400 text-black' : 'text-zinc-300 hover:bg-white/20'
                  }`}
                >
                  {t === 0 ? 'ปิด' : `${t}s`}
                </button>
              ))}
            </div>
          )}

          {/* FLOATING POPOVER: Filter / Beauty Selector */}
          {isFiltersOpen && (
            <div className="absolute right-16 top-24 z-30 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col gap-1.5 shadow-2xl animate-in fade-in duration-150 w-40 text-xs">
              <span className="font-bold text-[10px] text-zinc-400 border-b border-white/10 pb-1 flex items-center justify-between">
                <span>ฟิลเตอร์ & เอฟเฟกต์</span>
                <button onClick={() => setIsFiltersOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
              {[
                { id: 'none', label: '🎨 ต้นฉบับ' },
                { id: 'smooth', label: '✨ ผิวเนียนใส' },
                { id: 'glow', label: '💖 โกลว์เป็นประกาย' },
                { id: 'cyber', label: '⚡ ไซเบอร์สตรีท' },
                { id: 'vintage', label: '🎞️ วินเทจ 90s' },
                { id: 'mono', label: '🖤 ดำขาวคลาสสิก' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setBeautyFilter(f.id as any);
                    setIsFiltersOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left font-medium cursor-pointer transition-colors ${
                    beautyFilter === f.id
                      ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold shadow'
                      : 'text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* FLOATING POPOVER: Volume & Audio Booster Panel (เปิดเสียง/เร่งเสียงต้นฉบับ) */}
          {isVolumeOpen && selectedMediaUrl && !isPhotoCaptured && (
            <div className="absolute right-14 top-40 z-40 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-3xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 w-72 text-white space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">เสียงต้นฉบับ (Original Audio)</h5>
                    <span className="text-[10px] text-zinc-400">เปิดเสียง & เร่งเสียงสูงสุด 200%</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVolumeOpen(false)}
                  className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Toggle Button: เปิดเสียง / ปิดเสียง */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextMuted = !isMuted;
                    setIsMuted(nextMuted);
                    if (!nextMuted && volume === 0) {
                      setVolume(100);
                    }
                    if (uploadedVideoRef.current) {
                      uploadedVideoRef.current.muted = nextMuted;
                      uploadedVideoRef.current.play().catch(() => {});
                    }
                    if (audioCtxRef.current?.state === 'suspended') {
                      audioCtxRef.current.resume().catch(() => {});
                    }
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    isMuted
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black animate-pulse'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 แตะเปิดเสียงต้นฉบับทันที</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-red-400" />
                      <span>แตะเพื่อปิดเสียงชั่วคราว</span>
                    </>
                  )}
                </button>
              </div>

              {/* Volume Slider & Percentage */}
              <div className="space-y-1.5 bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">ระดับเสียง:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                      isMuted
                        ? 'bg-red-500/20 text-red-400'
                        : volume > 100
                        ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                        : 'bg-zinc-800 text-white'
                    }`}
                  >
                    {isMuted ? 'ปิดเสียง (0%)' : volume > 100 ? `🔥 เร่งเสียง ${volume}%` : `${volume}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={200}
                  step={5}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVolume(val);
                    if (val > 0 && isMuted) setIsMuted(false);
                    if (val === 0) setIsMuted(true);
                    if (uploadedVideoRef.current) {
                      uploadedVideoRef.current.muted = val === 0;
                    }
                    if (audioCtxRef.current?.state === 'suspended') {
                      audioCtxRef.current.resume().catch(() => {});
                    }
                  }}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />

                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>0% (เงียบ)</span>
                  <span>100% (ปกติ)</span>
                  <span className="text-amber-400 font-bold">200% (เร่งสุด)</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-400 block font-medium">ปุ่มลัดระดับเสียง:</span>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { label: '0%', val: 0 },
                    { label: '50%', val: 50 },
                    { label: '100%', val: 100 },
                    { label: '150%🔥', val: 150, boost: true },
                    { label: '200%🚀', val: 200, boost: true },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setVolume(preset.val);
                        setIsMuted(preset.val === 0);
                        if (uploadedVideoRef.current) {
                          uploadedVideoRef.current.muted = preset.val === 0;
                        }
                        if (audioCtxRef.current?.state === 'suspended') {
                          audioCtxRef.current.resume().catch(() => {});
                        }
                      }}
                      className={`py-1.5 px-0.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
                        (isMuted && preset.val === 0) || (!isMuted && volume === preset.val)
                          ? preset.boost
                            ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                            : 'bg-white text-black shadow-md'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200/90 leading-relaxed">
                ✨ <strong>ต้นฉบับมีเสียง:</strong> สามารถเร่งเสียงได้สูงสุด 200% เพื่อให้เสียงพูดหรือเสียงสินค้าในคลิปดังและชัดเจนขึ้น
              </div>
            </div>
          )}

          {/* 4. BOTTOM SECTION: Controls based on whether video is loaded or in camera mode */}
          <div className="relative z-20 pb-3 flex flex-col items-center gap-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-4">
            
            {/* SCENARIO A: VIDEO IS LOADED -> Show Video Action Bar & "ถัดไป" Button */}
            {selectedMediaUrl ? (
              <div className="w-full px-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadPickerOpen(true)}
                  className="py-2.5 px-3 rounded-2xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 font-medium text-xs cursor-pointer transition-colors flex items-center justify-center gap-1 shrink-0 backdrop-blur-md border border-white/10"
                  title="เปลี่ยนวิดีโอ: เลือกคลิปจากคลัง หรืออัปโหลดจากเครื่อง"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>เปลี่ยนคลิป</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEffectsDrawerOpen(true)}
                  className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer backdrop-blur-md border shrink-0 ${
                    activeArEffect
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 ring-2 ring-pink-500/40 shadow-lg'
                      : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 border-white/10'
                  }`}
                  title="เปิดใช้งานเอฟเฟกต์ & วัตถุเสมือน AR"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{activeArEffect ? 'เอฟเฟกต์ (เปิดอยู่)' : 'เอฟเฟกต์'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPost}
                  className="flex-1 py-3 px-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-[#FE2C55] to-rose-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-red-900/40 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>ถัดไป</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* SCENARIO B: CAMERA MODE -> Show Mode Carousel + Shutter Button + Album Upload */
              <>
                {/* 4.1 Mode Selector Carousel (60 วินาที | 30 วินาที | 15 วินาที | รูปภาพ | ข้อความ) */}
                <div className="flex items-center gap-4 text-xs font-semibold px-4 overflow-x-auto no-scrollbar py-1">
                  <button
                    type="button"
                    onClick={() => setActiveMode('60s')}
                    className={`transition-all whitespace-nowrap cursor-pointer ${
                      activeMode === '60s'
                        ? 'px-3 py-1 bg-white text-black rounded-full font-bold shadow-md'
                        : 'text-zinc-300 hover:text-white drop-shadow'
                    }`}
                  >
                    60 วินาที
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('30s')}
                    className={`transition-all whitespace-nowrap cursor-pointer ${
                      activeMode === '30s'
                        ? 'px-3 py-1 bg-white text-black rounded-full font-bold shadow-md'
                        : 'text-zinc-300 hover:text-white drop-shadow'
                    }`}
                  >
                    30 วินาที
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('15s')}
                    className={`transition-all whitespace-nowrap cursor-pointer ${
                      activeMode === '15s'
                        ? 'px-3 py-1 bg-white text-black rounded-full font-bold shadow-md'
                        : 'text-zinc-300 hover:text-white drop-shadow'
                    }`}
                  >
                    15 วินาที
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('photo')}
                    className={`transition-all whitespace-nowrap cursor-pointer ${
                      activeMode === 'photo'
                        ? 'px-3.5 py-1 bg-white text-black rounded-full font-bold shadow-lg scale-105'
                        : 'text-zinc-300 hover:text-white drop-shadow'
                    }`}
                  >
                    รูปภาพ
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('text')}
                    className={`transition-all whitespace-nowrap cursor-pointer ${
                      activeMode === 'text'
                        ? 'px-3 py-1 bg-white text-black rounded-full font-bold shadow-md'
                        : 'text-zinc-300 hover:text-white drop-shadow'
                    }`}
                  >
                    ข้อความ
                  </button>
                </div>

                {/* 4.2 Main Shutter Row: [Album Thumbnail] --- [Big Shutter Button] --- [Effect Avatars] */}
                <div className="w-full px-6 flex items-center justify-between">
                  
                  {/* Left: Album Thumbnail & Video Library (เปิดคลังวิดีโอพร้อมใช้ หรืออัปโหลดจากเครื่อง) */}
                  <button
                    type="button"
                    onClick={() => setIsUploadPickerOpen(true)}
                    className="group flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                    title="นำเข้าวิดีโอ: เลือกจากคลังคลิปพร้อมใช้ หรืออัปโหลดไฟล์จากเครื่อง"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white/70 shadow-xl bg-gradient-to-tr from-purple-800 to-indigo-900 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
                      <ImageIcon className="w-5 h-5 text-white/90" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
                    </div>
                    <span className="text-[10px] text-zinc-300 font-medium drop-shadow">
                      อัปโหลด
                    </span>
                  </button>

                  {/* Center: Large Round Shutter Button */}
                  <div className="relative flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleShutterClick}
                      className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-white transition-all shadow-2xl active:scale-90 cursor-pointer ${
                        isRecording ? 'animate-pulse' : ''
                      }`}
                      title={
                        activeMode === 'photo'
                          ? 'กดชัตเตอร์เพื่อถ่ายภาพ'
                          : isRecording
                          ? 'กดเพื่อหยุดบันทึก'
                          : 'กดเพื่อเริ่มบันทึกวิดีโอ'
                      }
                    >
                      <div
                        className={`transition-all duration-200 ${
                          activeMode === 'photo'
                            ? 'w-[60px] h-[60px] rounded-full bg-white shadow-inner'
                            : isRecording
                            ? 'w-8 h-8 rounded-md bg-red-600 shadow-lg'
                            : 'w-[60px] h-[60px] rounded-full bg-red-600 shadow-inner'
                        }`}
                        style={{
                          width: isRecording ? undefined : '60px',
                          height: isRecording ? undefined : '60px',
                        }}
                      />
                    </button>

                    {isRecording && (
                      <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold shadow-lg flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>
                          00:{recordedSeconds < 10 ? `0${recordedSeconds}` : recordedSeconds} / {maxSec}s
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: ปุ่มเปิดใช้งานเอฟเฟกต์ & วัตถุเสมือน AR (Effects Button) */}
                  <button
                    type="button"
                    onClick={() => setIsEffectsDrawerOpen(true)}
                    className="group flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                    title="เปิดใช้งานเอฟเฟกต์และวัตถุเสมือน AR"
                  >
                    <div
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shadow-xl flex items-center justify-center transition-all ${
                        activeArEffect
                          ? 'border-pink-400 bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 ring-2 ring-pink-400/60 scale-105'
                          : 'border-white/70 bg-gradient-to-tr from-zinc-800 to-zinc-900 group-hover:scale-105 group-hover:border-pink-400'
                      }`}
                    >
                      <Sparkles
                        className={`w-6 h-6 transition-all ${
                          activeArEffect ? 'text-white animate-spin-slow' : 'text-yellow-400 group-hover:scale-110'
                        }`}
                      />
                      {activeArEffect && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-ping" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium drop-shadow ${
                        activeArEffect ? 'text-pink-300 font-bold' : 'text-zinc-300'
                      }`}
                    >
                      {activeArEffect ? 'เปิดอยู่' : 'เอฟเฟกต์'}
                    </span>
                  </button>
                </div>

                {/* 4.3 Very Bottom Navigation Bar (กล้อง | สร้างสรรค์ | LIVE) */}
                <div className="w-full pt-1 pb-1 flex items-center justify-center gap-8 text-xs font-bold text-zinc-400 border-t border-white/5 bg-black/40 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setBottomTab('camera')}
                    className={`cursor-pointer transition-colors ${
                      bottomTab === 'camera' ? 'text-white font-extrabold' : 'hover:text-zinc-200'
                    }`}
                  >
                    กล้อง
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBottomTab('creative');
                      fileInputRef.current?.click();
                    }}
                    className={`cursor-pointer transition-colors ${
                      bottomTab === 'creative' ? 'text-white font-extrabold' : 'hover:text-zinc-200'
                    }`}
                  >
                    สร้างสรรค์
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBottomTab('live');
                      alert('โหมด LIVE: เชื่อมต่อสัญญาณถ่ายทอดสด TikTok Live เรียบร้อย');
                    }}
                    className={`cursor-pointer transition-colors ${
                      bottomTab === 'live' ? 'text-white font-extrabold' : 'hover:text-zinc-200'
                    }`}
                  >
                    LIVE
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Sound Picker Modal (when ♪ เพิ่มเสียง is clicked) */}
          {isMusicModalOpen && (
            <div
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex flex-col justify-end animate-in fade-in"
              onClick={() => setIsMusicModalOpen(false)}
            >
              <div
                className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 space-y-3 max-h-[75vh] overflow-y-auto text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-pink-400" />
                    <h4 className="font-bold text-sm text-white">เลือกเสียงประกอบยอดนิยม (TikTok Sound)</h4>
                  </div>
                  <button
                    onClick={() => setIsMusicModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {TRENDING_SOUNDS.map((snd) => (
                    <div
                      key={snd.id}
                      onClick={() => {
                        setSelectedMusic(snd.title);
                        setIsMusicModalOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedMusic === snd.title
                          ? 'bg-purple-950/40 border-purple-500 text-white'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-xs truncate text-white">{snd.title}</div>
                        <div className="text-[10px] text-zinc-400">{snd.artist} • {snd.duration}</div>
                      </div>
                      <span className="text-[11px] font-bold text-purple-400 shrink-0">
                        {selectedMusic === snd.title ? '✓ กำลังใช้' : 'เลือกใช้'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Effects & AR Virtual Objects Drawer (แผงเลือกเอฟเฟกต์ & วัตถุเสมือน AR) */}
          {isEffectsDrawerOpen && (
            <div
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md p-3 flex flex-col justify-end animate-in fade-in"
              onClick={() => setIsEffectsDrawerOpen(false)}
            >
              <div
                className="bg-zinc-900/98 border border-zinc-700 rounded-3xl p-4 space-y-3 max-h-[82vh] overflow-y-auto text-left shadow-2xl animate-in slide-in-from-bottom-8 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>เอฟเฟกต์ & วัตถุเสมือน AR</span>
                        {activeArEffect && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/25 text-pink-300 text-[10px] font-bold border border-pink-500/40 animate-pulse">
                            กำลังใช้งาน
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-zinc-400">
                        เลือกเปิดใช้งานวัตถุ พร็อพ และเอฟเฟกต์บรรยากาศเสมือนจริงบนหน้าจอ
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEffectsDrawerOpen(false)}
                    className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
                  {[
                    { id: 'all', label: '🌟 ทั้งหมด' },
                    { id: 'props', label: '🕶️ วัตถุ AR' },
                    { id: 'atmosphere', label: '🎆 บรรยากาศ' },
                    { id: 'commerce', label: '🛍️ ป้ายไลฟ์ขายของ' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEffectsFilterCategory(tab.id as any)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all ${
                        effectsFilterCategory === tab.id
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md font-bold'
                          : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Quick Action: ปิดเอฟเฟกต์ / ล้างวัตถุทั้งหมด */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveArEffect(null);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                      activeArEffect === null
                        ? 'bg-zinc-800 text-white border-zinc-600'
                        : 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    <span>🚫 ไม่ใช้เอฟเฟกต์ / ล้างวัตถุบนจอ</span>
                  </button>
                </div>

                {/* Effects Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {AR_EFFECTS_LIST.filter(
                    (ef) => effectsFilterCategory === 'all' || ef.category === effectsFilterCategory
                  ).map((effect) => {
                    const isActive = activeArEffect === effect.id;
                    return (
                      <button
                        key={effect.id}
                        type="button"
                        onClick={() => {
                          setActiveArEffect(isActive ? null : effect.id);
                        }}
                        className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group text-center ${
                          isActive
                            ? 'bg-gradient-to-b from-pink-950/70 via-rose-950/40 to-zinc-900 border-pink-400 ring-2 ring-pink-500/50 shadow-lg scale-102'
                            : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50'
                        }`}
                      >
                        {/* Badge if present */}
                        {effect.badge && (
                          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-pink-500 text-[8px] font-bold text-white shadow">
                            {effect.badge}
                          </span>
                        )}

                        {/* Icon Emoji */}
                        <div className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
                          {effect.icon}
                        </div>

                        {/* Title */}
                        <div className="text-[11px] font-bold text-white leading-tight line-clamp-1">
                          {effect.name}
                        </div>

                        {/* Status / Active label */}
                        <span
                          className={`text-[9px] font-medium ${
                            isActive ? 'text-pink-300 font-bold' : 'text-zinc-500'
                          }`}
                        >
                          {isActive ? '✓ กำลังใช้งาน' : 'แตะเพื่อเปิดใช้'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Beauty Filter Section inside Effects Drawer */}
                <div className="pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                      <Smile className="w-3.5 h-3.5 text-rose-400" />
                      <span>ฟิลเตอร์ผิวเนียน & โทนสี (Beauty Filter)</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">เลือกควบคู่กับวัตถุ AR ได้</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { id: 'none', label: '🎨 ต้นฉบับ' },
                      { id: 'smooth', label: '✨ ผิวเนียน' },
                      { id: 'glow', label: '💖 โกลว์' },
                      { id: 'cyber', label: '⚡ ไซเบอร์' },
                      { id: 'vintage', label: '🎞️ วินเทจ' },
                      { id: 'mono', label: '🖤 ดำขาว' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setBeautyFilter(f.id as any)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition-all border ${
                          beautyFilter === f.id
                            ? 'bg-rose-500 text-white font-bold border-rose-300 shadow'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              Video Library & Import Drawer (แก้ปัญหาคลิกเข้ามาแล้วหาวิดีโอไม่เจอ)
             ========================================================================= */}
          {isUploadPickerOpen && (
            <div
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md p-3 flex flex-col justify-end animate-in fade-in"
              onClick={() => setIsUploadPickerOpen(false)}
            >
              <div
                className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 space-y-3.5 max-h-[86vh] overflow-y-auto text-left shadow-2xl animate-in slide-in-from-bottom-8 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                      <Film className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <span>นำเข้าวิดีโอ & คลังคลิปสร้างคอนเทนต์</span>
                      </h4>
                      <span className="text-[10px] text-zinc-400">
                        เลือกคลิปตัวอย่างพร้อมใช้ หรืออัปโหลดจากเครื่อง หรือนำเข้าด้วย URL
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsUploadPickerOpen(false)}
                    className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1.5 bg-zinc-950/70 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setUploadPickerTab('preset')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                      uploadPickerTab === 'preset'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    🎬 คลิปพร้อมใช้ ({PRESET_SAMPLE_VIDEOS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadPickerTab('device')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                      uploadPickerTab === 'device'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    📂 เลือกจากเครื่อง
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadPickerTab('url')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                      uploadPickerTab === 'url'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    🔗 นำเข้าด้วย URL
                  </button>
                </div>

                {/* Tab 1: PRESET SAMPLE VIDEOS */}
                {uploadPickerTab === 'preset' && (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>แตะ 1 ครั้งเพื่อนำเข้าคลิปตัวอย่างระดับ Full HD สำหรับทดสอบเอฟเฟกต์และปักตะกร้าทันที</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {PRESET_SAMPLE_VIDEOS.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectPresetVideo(item.videoUrl)}
                          className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 hover:border-cyan-500 cursor-pointer transition-all hover:scale-[1.02] shadow-lg flex flex-col"
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-900">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-400/30">
                              {item.tag}
                            </span>
                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                              {item.duration}
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                              <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-2.5 flex flex-col justify-between flex-1">
                            <div>
                              <div className="text-[10px] text-cyan-400 font-bold">{item.category}</div>
                              <h5 className="font-bold text-xs text-white line-clamp-1 group-hover:text-cyan-300">
                                {item.title}
                              </h5>
                            </div>
                            <button
                              type="button"
                              className="mt-2 w-full py-1.5 rounded-xl bg-cyan-600/90 group-hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>เลือกคลิปนี้</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: DEVICE UPLOAD */}
                {uploadPickerTab === 'device' && (
                  <div className="space-y-3 py-2 text-center">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 bg-zinc-950/70 hover:bg-zinc-950 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-cyan-500/20 text-zinc-300 group-hover:text-cyan-400 flex items-center justify-center transition-colors">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-cyan-300">
                          แตะที่นี่เพื่อเลือกไฟล์วิดีโอจากอุปกรณ์ของคุณ
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          รองรับไฟล์ MP4, MOV, WebM, ภาพนิ่ง JPG, PNG (สูงสุด 500MB)
                        </div>
                      </div>
                      <span className="mt-2 py-2 px-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-lg group-hover:opacity-95">
                        📂 เปิดคลังภาพ / ไฟล์ในเครื่อง
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      💡 แนะนำใช้วิดีโอแนวตั้งอัตราส่วน 9:16 ความละเอียด 1080p เพื่อภาพที่คมชัดที่สุดบนฟีด TikTok Shop
                    </p>
                  </div>
                )}

                {/* Tab 3: IMPORT VIA URL */}
                {uploadPickerTab === 'url' && (
                  <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        วางลิงก์วิดีโอโดยตรง (Direct MP4 URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customVideoUrlInput}
                          onChange={(e) => setCustomVideoUrlInput(e.target.value)}
                          placeholder="https://assets.mixkit.co/... หรือ .mp4 URL"
                          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleImportUrlVideo()}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white text-xs font-bold rounded-xl cursor-pointer shadow flex items-center gap-1.5 shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>นำเข้า</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        ตัวอย่างลิงก์วิดีโอฟรีความเร็วสูง (กดเพื่อนำเข้าทันที):
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleImportUrlVideo('/city.mp4')}
                          className="text-left p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>🛹 วิดีโอสตรีทซิตี้ แฟชั่นวัยรุ่น (/city.mp4)</span>
                          <span className="text-cyan-400 text-[10px] font-bold">แตะใช้นี้ ➔</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImportUrlVideo('/flower.mp4')}
                          className="text-left p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>🌸 วิดีโอโมเดลมินิมอล บลูมมิ่งอาร์ต (/flower.mp4)</span>
                          <span className="text-cyan-400 text-[10px] font-bold">แตะใช้นี้ ➔</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImportUrlVideo('/motor.mp4')}
                          className="text-left p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>🏍️ วิดีโอมอเตอร์สปอร์ต เรซซิ่งแรลลี่ (/motor.mp4)</span>
                          <span className="text-cyan-400 text-[10px] font-bold">แตะใช้นี้ ➔</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          VIEW 2: POST & PIN BASKET SCREEN (หน้าตั้งค่าแคปชัน ปักตระกล้า และเผยแพร่)
         ========================================================================= */}
      {phase === 'post' && (
        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/95">
            <button
              onClick={() => setPhase('editor')}
              className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white cursor-pointer py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>กลับไปปรับแต่งคลิป (เครื่องมือ & เอฟเฟกต์)</span>
            </button>
            <h3 className="font-bold text-sm text-white">เผยแพร่คลิป</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handlePublish} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
            
            {/* Media Preview Player with active Overlays, Filters & Sound Info */}
            <div className="relative aspect-[9/12] max-h-56 mx-auto bg-black rounded-2xl overflow-hidden border border-zinc-700 shadow-inner group">
              {isPhotoCaptured ? (
                <img
                  src={selectedMediaUrl}
                  alt="Captured"
                  className={`w-full h-full object-cover ${getFilterStyle(beautyFilter)}`}
                />
              ) : (
                <video
                  src={selectedMediaUrl}
                  className={`w-full h-full object-cover ${getFilterStyle(beautyFilter)}`}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
              )}

              {/* Sound status pill on post preview */}
              {!isPhotoCaptured && (
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow border border-white/10 cursor-pointer active:scale-95 transition-all"
                  title="คลิกเพื่อเปิด/ปิดเสียง"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3 h-3 text-red-400" />
                      <span>ปิดเสียง</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 text-emerald-400" />
                      <span>เสียง {volume}% {volume > 100 && '🔥'}</span>
                    </>
                  )}
                </button>
              )}

              {/* Text Overlays preview on final post */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center gap-2 p-3">
                {textOverlays.map((item) => (
                  <div
                    key={item.id}
                    className="px-2.5 py-1 rounded-lg font-bold text-xs shadow-lg backdrop-blur-xs"
                    style={{ color: item.color, backgroundColor: item.bgColor }}
                  >
                    {item.text}
                  </div>
                ))}
                {activeStickers.map((stk, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black shadow-lg"
                  >
                    {stk}
                  </div>
                ))}
              </div>

              {/* Music Pill preview */}
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-zinc-200 flex items-center gap-1.5 shadow">
                <Music className="w-3 h-3 text-pink-400" />
                <span className="truncate max-w-[150px]">{selectedMusic}</span>
              </div>

              {/* Basket Preview badge if active */}
              {isPinningBasket && currentUser.isSeller && selectedProduct && (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-amber-400 text-zinc-950 border border-amber-300/70 flex items-center gap-1.5 shadow-xl">
                  <span className="text-xs">🛒</span>
                  <span className="text-[11px] font-bold">สั่งซื้อ</span>
                  <span className="text-[10px] font-mono bg-black/15 px-1.5 py-0.5 rounded-full font-bold">
                    ฿{selectedProduct.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Caption & Hashtags */}
            <div className="space-y-2">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">
                  แคปชันวิดีโอ (Caption) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="เขียนคำบรรยายสินค้า เช่น เสื้อยืดสตรีทแวร์รุ่นใหม่ ทรงสวยใส่สบาย..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>แฮชแท็ก (Hashtags)</span>
                  </label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#TikTokShop #รีวิว"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-pink-400" />
                    <span>ชื่อเสียง / เพลง</span>
                  </label>
                  <input
                    type="text"
                    value={selectedMusic}
                    onChange={(e) => setSelectedMusic(e.target.value)}
                    placeholder="ชื่อเพลงหรือเสียงประกอบ"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* PIN BASKET SECTION (ปักตระกล้าสินค้า) */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🛒</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">ปักตระกล้าสินค้าในวิดีโอ (TikTok Shop Basket)</h4>
                    <p className="text-[10px] text-zinc-400">
                      แสดงตระกล้าสีเหลืองให้ผู้ชมกดสั่งซื้อสินค้าได้ทันทีขณะดูคลิป
                    </p>
                  </div>
                </div>

                {currentUser.isSeller && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinningBasket}
                      onChange={(e) => setIsPinningBasket(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                )}
              </div>

              {/* If NOT a seller: Prompt to apply */}
              {!currentUser.isSeller ? (
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-amber-300 flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>ต้องการปักตระกล้าสินค้าในคลิปนี้หรือไม่?</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      สมัครเป็นสมาชิกขายปักตระกล้าฟรี เพื่อเปิดระบบร้านค้าและสร้างรายได้จากคลิป
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSellerRegistration();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-bold text-[11px] shrink-0 shadow cursor-pointer"
                  >
                    สมัครขายปักตระกล้า
                  </button>
                </div>
              ) : isPinningBasket ? (
                /* Product Picker */
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-medium text-zinc-300">
                    เลือกสินค้าที่จะปักตระกล้าจากร้านค้า:
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto no-scrollbar">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProductId(prod.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                          selectedProductId === prod.id
                            ? 'bg-amber-950/30 border-amber-500 text-white shadow-md'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-semibold truncate text-white">
                            {prod.code ? `[${prod.code}] ` : ''}
                            {prod.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-[#FE2C55] font-bold font-mono">
                              ฿{prod.price}
                            </span>
                            <span className="text-[9px] text-zinc-500">
                              คงเหลือ {prod.stock || 50} ชิ้น
                            </span>
                          </div>
                        </div>
                        {selectedProductId === prod.id && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-xs shrink-0">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-amber-300/80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>คลิปนี้จะแสดงตระกล้าสินค้าและจะบันทึกไปที่โปรไฟล์ของคุณโดยอัตโนมัติ</span>
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500 italic">
                  ไม่ได้เปิดใช้งานปักตระกล้า (คลิปจะเผยแพร่เป็นวิดีโอทั่วไป)
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setPhase('editor')}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>กลับไปแก้ไขคลิป</span>
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-[#FE2C55] to-rose-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังเผยแพร่คลิป...
                  </span>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>🚀 โพสต์วิดีโอทันที</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
