import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, X, ShieldCheck, Truck, Sparkles, Building2, Store } from 'lucide-react';
import { UserProfile } from '../types/feed';

interface SellerRegisterModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
}

export const SellerRegisterModal: React.FC<SellerRegisterModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [shopName, setShopName] = useState(currentUser.name + ' Official Store');
  const [phone, setPhone] = useState('081-987-6543');
  const [taxId, setTaxId] = useState('0105562089412');
  const [promptPay, setPromptPay] = useState('0819876543');
  const [shippingCarriers, setShippingCarriers] = useState<string[]>([
    '📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ & ลงทะเบียน)',
    '⚡ Flash Express',
  ]);
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleCarrier = (carrier: string) => {
    if (shippingCarriers.includes(carrier)) {
      setShippingCarriers(shippingCarriers.filter((c) => c !== carrier));
    } else {
      setShippingCarriers([...shippingCarriers, carrier]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !phone || !taxId) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const updatedUser: UserProfile = {
        ...currentUser,
        isSeller: true,
        sellerInfo: {
          shopName,
          registeredDate: new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          phone,
          taxIdOrIdCard: taxId,
          promptPayNumber: promptPay,
          shippingCarriers,
          status: 'approved',
        },
      };

      localStorage.setItem('tokshop_user_profile', JSON.stringify(updatedUser));
      setIsSubmitting(false);
      onSuccess(updatedUser);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg text-white font-bold">
              🛒
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>สมัครสมาชิกขายปักตระกล้า & เปิดร้านค้า</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  TikTok Shop
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                เปิดระบบปักตระกล้าในวิดีโอ & โพสต์สินค้าลงร้านค้าหลัก
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Benefit Badge */}
          <div className="p-3 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-zinc-900 rounded-2xl border border-amber-500/30 text-xs space-y-1.5">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>สิทธิพิเศษเมื่อเป็นสมาชิกผู้ขาย & ครีเอเตอร์ปักตระกล้า</span>
            </div>
            <ul className="text-[11px] text-zinc-300 space-y-1 list-disc list-inside">
              <li>สร้างวิดีโอพร้อม <strong className="text-yellow-300">ปักตระกล้าสินค้าสีเหลือง</strong> ได้ทุกคลิป</li>
              <li>โพสต์สินค้าใหม่ขึ้น <strong className="text-white">ร้านค้ากลาง (TikTok Shop)</strong> ทันที</li>
              <li>รองรับขนส่ง <strong className="text-red-400">ไปรษณีย์ไทย (EMS)</strong> ออกเลขพัสดุอัตโนมัติ</li>
              <li>รับเงินเข้าบัญชีพร้อมเพย์หรือโอนตรงทันทีที่ออร์เดอร์เสร็จสิ้น</li>
            </ul>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                ชื่อร้านค้า / แบรนด์ครีเอเตอร์ *
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="เช่น Golden River Studio & Streetwear"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">
                  อีเมลเจ้าของร้าน (Gmail)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-zinc-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-300 mb-1">
                  เบอร์โทรศัพท์ติดต่อร้านค้า *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081-xxx-xxxx"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">
                  เลขบัตร ปชช. / เลขทะเบียนพาณิชย์ 13 หลัก *
                </label>
                <input
                  type="text"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="0105562089412"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-300 mb-1">
                  บัญชีรับเงิน / พร้อมเพย์ร้านค้า
                </label>
                <input
                  type="text"
                  value={promptPay}
                  onChange={(e) => setPromptPay(e.target.value)}
                  placeholder="เบอร์โทร หรือ เลข ปชช."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            {/* Carrier selection */}
            <div>
              <label className="block font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-400" />
                <span>ช่องทางขนส่งที่ต้องการเชื่อมต่อ (เลือกได้หลายช่องทาง)</span>
              </label>
              <div className="space-y-1.5">
                {[
                  '📮 ไปรษณีย์ไทย (EMS ด่วนพิเศษ & ลงทะเบียน)',
                  '⚡ Flash Express (เข้ารับพัสดุถึงบ้าน)',
                  '📦 Kerry Express / J&T Express',
                ].map((carrier) => {
                  const isChecked = shippingCarriers.includes(carrier);
                  return (
                    <label
                      key={carrier}
                      onClick={() => toggleCarrier(carrier)}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-purple-950/30 border-purple-500/50 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-zinc-600 text-purple-600 focus:ring-0"
                      />
                      <span className="text-xs font-medium">{carrier}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Consent checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-zinc-400">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-600 text-purple-600 focus:ring-0"
                />
                <span>
                  ฉันยอมรับข้อตกลงและนโยบายผู้ขาย TikTok Shop พร้อมปฏิบัติตามมาตรฐานสินค้าและการจัดส่งพัสดุ
                </span>
              </label>
            </div>
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
              disabled={isSubmitting || !agreed}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังตรวจสอบและเปิดสิทธิ์...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>ยืนยันและเปิดระบบขายทันที</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
