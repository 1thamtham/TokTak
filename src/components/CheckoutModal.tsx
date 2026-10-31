import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, QrCode, Banknote, ChevronRight, Tag } from 'lucide-react';
import { Product, OrderItem } from '../types/feed';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onOrderSuccess?: (order: OrderItem) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  onOrderSuccess,
}) => {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [shippingCarrier, setShippingCarrier] = useState<'thaipost' | 'flash' | 'kerry' | 'jandt'>('thaipost');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'cod' | 'card'>('promptpay');
  const [address, setAddress] = useState<string>('99/12 หมู่บ้านสุขสราญ ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110');
  const [recipient, setRecipient] = useState<string>('ธนากร วัฒนศิลป์ (089-123-4567)');
  const [couponApplied, setCouponApplied] = useState<boolean>(true);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [orderTracking, setOrderTracking] = useState<string>('');

  const discountAmount = couponApplied ? 50 : 0;
  const subtotal = product.price * quantity;
  const total = Math.max(0, subtotal - discountAmount);

  const getCarrierLabel = (c: 'thaipost' | 'flash' | 'kerry' | 'jandt') => {
    switch (c) {
      case 'thaipost':
        return '📮 ไปรษณีย์ไทย (Thailand Post EMS ด่วนพิเศษ 1-2 วัน)';
      case 'flash':
        return '⚡ Flash Express (ส่งด่วน 1 วัน)';
      case 'kerry':
        return '🚚 Kerry Express';
      case 'jandt':
        return '📦 J&T Express';
    }
  };

  const generateTrackingNumber = (c: 'thaipost' | 'flash' | 'kerry' | 'jandt') => {
    if (c === 'thaipost') {
      return `ED${Math.floor(10000000 + Math.random() * 90000000)}TH`;
    } else if (c === 'flash') {
      return `TH01${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    } else if (c === 'kerry') {
      return `KEX${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    } else {
      return `JT${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    }
  };

  const handleConfirmOrder = () => {
    const generatedId = 'TK-' + Math.floor(100000 + Math.random() * 900000);
    const tracking = generateTrackingNumber(shippingCarrier);
    setOrderId(generatedId);
    setOrderTracking(tracking);
    setIsOrdered(true);

    if (onOrderSuccess) {
      const now = new Date();
      const timeStr = `${now.getDate()} ต.ค. ${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newOrder: OrderItem = {
        id: generatedId,
        customerName: recipient.split('(')[0]?.trim() || recipient,
        phone: recipient.match(/\((.*?)\)/)?.[1] || '089-123-4567',
        address,
        productId: product.id,
        productName: `${product.code ? product.code + ' - ' : ''}${product.name}`,
        productImage: product.imageUrl,
        size: selectedSize,
        color: selectedColor,
        quantity,
        totalPrice: total,
        paymentMethod,
        status: 'pending',
        createdAt: timeStr,
        shippingCarrier: getCarrierLabel(shippingCarrier),
        trackingNumber: tracking,
      };
      onOrderSuccess(newOrder);
    }
  };

  const handleResetAndClose = () => {
    setIsOrdered(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={handleResetAndClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-lg bg-zinc-950 text-white rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FE2C55]" />
            <h3 className="text-base font-bold text-white">
              {isOrdered ? 'สั่งซื้อสินค้าสำเร็จ!' : 'สั่งซื้อด่วน (Quick Checkout)'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            aria-label="ปิดหน้าต่างสั่งซื้อ"
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isOrdered ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">ขอบคุณสำหรับคำสั่งซื้อ!</h4>
              <p className="text-zinc-400 text-sm mt-1">
                ระบบได้รับคำสั่งซื้อเรียบร้อยแล้ว เตรียมจัดส่งสินค้าถึงคุณใน 1-2 วันทำการ
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>หมายเลขคำสั่งซื้อ:</span>
                <span className="font-mono text-white font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>สินค้า:</span>
                <span className="text-zinc-200 truncate max-w-[200px]">{product.name}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>ตัวเลือก:</span>
                <span className="text-zinc-200">{selectedColor} / ไซส์ {selectedSize} (x{quantity})</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>ระบบขนส่ง:</span>
                <span className="text-zinc-200 font-medium">{getCarrierLabel(shippingCarrier)}</span>
              </div>
              <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 mt-1">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                  <span>📮</span>
                  <span>เลขพัสดุ:</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold text-sm tracking-wider">
                  {orderTracking}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>วิธีชำระเงิน:</span>
                <span className="text-zinc-200">
                  {paymentMethod === 'promptpay' ? 'สแกนพร้อมเพย์ (QR)' : paymentMethod === 'cod' ? 'เก็บเงินปลายทาง' : 'บัตรเครดิต'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-200 font-semibold pt-2 border-t border-zinc-800 text-sm">
                <span>ยอดชำระสุทธิ:</span>
                <span className="text-[#FE2C55] font-mono tabular-nums">฿{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-colors"
            >
              กลับไปดูวิดีโอต่อ
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
            {/* Product Summary */}
            <div className="flex gap-3.5 items-start bg-zinc-900/90 rounded-2xl p-3 border border-zinc-800">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-red-950/80 text-[#FE2C55] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#FE2C55]/30 mb-1">
                  ลดพิเศษ -{product.discountPercent}%
                </span>
                <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-extrabold text-[#FE2C55] font-mono tabular-nums">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-400 line-through font-mono tabular-nums">
                    ฿{product.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                1. เลือกลาย / สีเสื้อ:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedColor === color
                        ? 'bg-white text-zinc-950 border-white font-semibold'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300">
                  2. เลือกขนาด (Size):
                </label>
                <span className="text-[11px] text-zinc-400 underline cursor-pointer">
                  ตารางเทียบไซส์
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2.5 rounded-xl text-xs text-center border transition-all ${
                      selectedSize === size
                        ? 'bg-[#FE2C55]/20 border-[#FE2C55] text-white font-bold shadow-[0_0_12px_rgba(254,44,85,0.3)]'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between py-2 border-y border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-300">3. จำนวน:</span>
              <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-zinc-900/60 rounded-2xl p-3.5 border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  สถานที่จัดส่ง
                </span>
                <span className="text-emerald-400 text-[11px] font-medium">ส่งฟรี Flash Express</span>
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white"
                placeholder="ชื่อ-นามสกุล และเบอร์โทรศัพท์"
              />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white resize-none"
                placeholder="ที่อยู่จัดส่งละเอียด"
              />
            </div>

            {/* 4. เลือกระบบขนส่ง (เชื่อมไปรษณีย์ไทย) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <span>📮</span>
                  <span>4. เลือกระบบขนส่ง:</span>
                </label>
                <span className="text-emerald-400 text-[11px] font-bold">ส่งฟรีทุกชิ้น</span>
              </div>
              <div className="space-y-2">
                {/* 1. ไปรษณีย์ไทย */}
                <label
                  onClick={() => setShippingCarrier('thaipost')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    shippingCarrier === 'thaipost'
                      ? 'bg-red-950/40 border-red-500 text-white shadow-sm shadow-red-500/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center text-base shrink-0 font-bold">
                      📮
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>ไปรษณีย์ไทย (Thailand Post EMS)</span>
                        <span className="text-[10px] bg-red-600 text-white px-1.5 rounded font-mono font-bold">
                          ส่งด่วน
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        ด่วนพิเศษ 1-2 วันทำการ ทั่วประเทศ ครอบคลุม 77 จังหวัด
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="carrier"
                    checked={shippingCarrier === 'thaipost'}
                    onChange={() => setShippingCarrier('thaipost')}
                    className="accent-red-500"
                  />
                </label>

                {/* 2. Flash Express */}
                <label
                  onClick={() => setShippingCarrier('flash')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    shippingCarrier === 'flash'
                      ? 'bg-amber-950/30 border-amber-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-sm shrink-0">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Flash Express</div>
                      <div className="text-[10px] text-zinc-400">จัดส่งด่วนทุกวัน 365 วัน</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="carrier"
                    checked={shippingCarrier === 'flash'}
                    onChange={() => setShippingCarrier('flash')}
                    className="accent-amber-500"
                  />
                </label>

                {/* 3. Kerry Express */}
                <label
                  onClick={() => setShippingCarrier('kerry')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    shippingCarrier === 'kerry'
                      ? 'bg-orange-950/30 border-orange-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-sm shrink-0">
                      🚚
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Kerry Express</div>
                      <div className="text-[10px] text-zinc-400">จัดส่งด่วน วันถัดไปถึงมือผู้รับ</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="carrier"
                    checked={shippingCarrier === 'kerry'}
                    onChange={() => setShippingCarrier('kerry')}
                    className="accent-orange-500"
                  />
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                5. ช่องทางการชำระเงิน:
              </label>
              <div className="space-y-2">
                <label
                  onClick={() => setPaymentMethod('promptpay')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'promptpay'
                      ? 'bg-blue-950/30 border-blue-500/80 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-semibold">Thai QR PromptPay (พร้อมเพย์)</div>
                      <div className="text-[10px] text-zinc-400">สแกนจ่ายได้ทุกแอปธนาคาร รวดเร็ว ปลอดภัย</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'promptpay'}
                    onChange={() => setPaymentMethod('promptpay')}
                    className="accent-[#FE2C55]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-950/30 border-amber-500/80 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-semibold">เก็บเงินปลายทาง (COD)</div>
                      <div className="text-[10px] text-zinc-400">ชำระเงินกับพนักงานเมื่อได้รับพัสดุ</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#FE2C55]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'bg-purple-950/30 border-purple-500/80 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-semibold">บัตรเครดิต / เดบิต (Visa, Mastercard)</div>
                      <div className="text-[10px] text-zinc-400">เข้ารหัส SSL 256-bit ปลอดภัยสูงสุด</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#FE2C55]"
                  />
                </label>
              </div>
            </div>

            {/* Discount Coupon Tag */}
            <div className="flex items-center justify-between p-2.5 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-rose-300">
                <Tag className="w-3.5 h-3.5 text-[#FE2C55]" />
                <span>คูปองส่วนลดผู้ใช้ใหม่ TIKTOK50</span>
              </div>
              <span className="text-[#FE2C55] font-bold font-mono">-฿50</span>
            </div>

            {/* Trust badge */}
            <div className="flex flex-col items-center justify-center gap-1 text-[11px] text-zinc-400 text-center">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>การันตีคืนเงินใน 7 วัน • พ.ร.บ. ทะเบียนพาณิชย์</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                เลขทะเบียน 0-1055-67012-34-5 (DBD Registered รับรอง)
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout CTA */}
        {!isOrdered && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-zinc-400">ยอดชำระสุทธิ</div>
              <div className="text-lg font-black text-[#FE2C55] font-mono tabular-nums leading-none mt-0.5">
                ฿{total.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#ff476d] hover:from-[#ff1e4a] hover:to-[#ff3860] text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#FE2C55]/30 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span>ยืนยันการสั่งซื้อ</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
