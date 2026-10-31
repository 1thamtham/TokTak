import React from 'react';
import { Product } from '../types/feed';

interface ProductCardOverlayProps {
  product: Product;
  onOpenCheckout: (product: Product) => void;
}

export const ProductCardOverlay: React.FC<ProductCardOverlayProps> = ({
  product,
  onOpenCheckout,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenCheckout(product);
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-bold text-xs shadow-xl backdrop-blur-sm cursor-pointer transition-all border border-amber-300/70 w-fit pointer-events-auto"
      title={`คลิกเพื่อสั่งซื้อ ${product.name} ฿${product.price.toLocaleString()}`}
    >
      <span className="text-sm leading-none shrink-0 drop-shadow-xs">🛒</span>
      <span className="font-extrabold text-xs tracking-tight">สั่งซื้อ</span>
      <span className="text-[11px] font-semibold bg-black/15 text-zinc-900 px-1.5 py-0.5 rounded-full font-mono">
        ฿{product.price.toLocaleString()}
      </span>
    </button>
  );
};

