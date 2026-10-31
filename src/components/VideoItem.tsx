import React, { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { VideoClip, Product } from '../types/feed';
import { RightActionButtons } from './RightActionButtons';
import { ProductCardOverlay } from './ProductCardOverlay';

interface VideoItemProps {
  clip: VideoClip;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave?: (id: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onOpenCheckout: (product: Product) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const VideoItem: React.FC<VideoItemProps> = ({
  clip,
  isActive,
  isMuted,
  onToggleLike,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
  onOpenCheckout,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showPlayIcon, setShowPlayIcon] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const lastTapRef = useRef<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Play/pause control based on active state
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
          });
      }
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleVideoAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (now - lastTapRef.current < 300) {
      // Double tap -> spawn heart & like
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (!clip.isLiked) {
        onToggleLike(clip.id);
      }
      const newHeart = { id: Date.now(), x, y };
      setFloatingHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 900);
    } else {
      // Single tap -> toggle play/pause
      clickTimerRef.current = setTimeout(() => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 500);
      }, 250);
    }
    lastTapRef.current = now;
  };

  return (
    <div className="relative w-full h-full snap-start snap-always shrink-0 overflow-hidden bg-black flex flex-col justify-between select-none">
      {/* 1. วิดีโอพื้นหลัง (พร้อมเลเยอร์ bg-black/30) */}
      <div
        className="absolute inset-0 z-0 cursor-pointer overflow-hidden"
        onClick={handleVideoAreaClick}
      >
        <video
          ref={videoRef}
          src={clip.videoUrl}
          poster={clip.posterUrl || clip.product?.imageUrl}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover"
        />

        {/* Video darken scrim layer */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Fallback image if video encounters error */}
        {videoError && (
          <div className="absolute inset-0 z-0">
            {clip.product?.imageUrl || clip.posterUrl ? (
              <img
                src={clip.product?.imageUrl || clip.posterUrl}
                alt={clip.caption}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${clip.fallbackGradient || 'from-zinc-900 to-black'}`} />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Floating pop hearts from double tap */}
        {floatingHearts.map((h) => (
          <div
            key={h.id}
            style={{ left: h.x - 30, top: h.y - 30 }}
            className="absolute z-30 pointer-events-none text-red-500 animate-[float-heart_0.9s_ease-out_forwards] text-4xl drop-shadow-lg"
          >
            ❤️
          </div>
        ))}

        {/* Central Play/Pause Indicator Watermark */}
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
              {isPlaying ? (
                <div className="flex gap-1.5">
                  <div className="w-2 h-6 bg-white rounded-xs" />
                  <div className="w-2 h-6 bg-white rounded-xs" />
                </div>
              ) : (
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. ปุ่มด้านขวา (ไลก์ แชร์) */}
      <RightActionButtons
        clip={clip}
        isPlaying={isPlaying}
        onToggleLike={onToggleLike}
        onToggleFollow={onToggleFollow}
        onOpenComments={onOpenComments}
        onOpenShare={onOpenShare}
      />

      {/* 3. ส่วนล่าง (แคปชัน และ กล่องสินค้าปักหมุด) */}
      <div className="relative z-10 p-3 sm:p-4 mb-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 mr-14 pointer-events-auto mt-auto">
        <div>
          <h4 className="font-bold text-sm text-white drop-shadow">
            {clip.creator.handle}
          </h4>
          <p className="text-xs text-gray-200 mt-0.5 line-clamp-2 drop-shadow leading-relaxed">
            {clip.caption}
          </p>
        </div>

        {/* กล่องสินค้าปักหมุด (แสดงเฉพาะคลิปที่มีการปักตระกล้า 1 ใน 5) */}
        {clip.product && (
          <ProductCardOverlay
            product={clip.product}
            onOpenCheckout={onOpenCheckout}
          />
        )}
      </div>

      {/* Thin playback progress line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-white transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
