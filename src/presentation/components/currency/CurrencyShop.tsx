'use client';

/**
 * Currency Shop - Buy premium currency with real money
 */

import {
    CURRENCIES,
    CURRENCY_PACKAGES,
    CurrencyPackage,
    CurrencyType,
    formatCurrency,
} from '@/src/domain/entities/Currency';
import { sfxGenerator } from '@/src/infrastructure/sound/SFXGenerator';
import { useWalletStore } from '@/src/stores/walletStore';
import { animated, config, useSpring, useTransition } from '@react-spring/web';
import { ArrowLeftRight, Check, ShoppingCart, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { CurrencyInline } from './CurrencyDisplay';

interface CurrencyShopProps {
  isOpen: boolean;
  onClose: () => void;
  initialCurrency?: CurrencyType;
}

export function CurrencyShop({ isOpen, onClose, initialCurrency = 'gems' }: CurrencyShopProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(initialCurrency);
  const [purchasedPackage, setPurchasedPackage] = useState<string | null>(null);
  const addCurrency = useWalletStore((state) => state.addCurrency);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    config: config.stiff,
  });

  const handlePurchase = (pkg: CurrencyPackage) => {
    // Simulate purchase (in real app, this would go through payment gateway)
    const totalAmount = pkg.amount + pkg.bonusAmount;
    addCurrency(pkg.currency, totalAmount, `ซื้อ ${pkg.nameTH}`, 'purchase');
    setPurchasedPackage(pkg.id);
    sfxGenerator.play('success');

    // Reset after animation
    setTimeout(() => setPurchasedPackage(null), 2000);
  };

  const filteredPackages = CURRENCY_PACKAGES.filter(
    (pkg) => pkg.currency === selectedCurrency
  );

  const currencyTabs: CurrencyType[] = ['gems', 'tickets', 'crystals'];

  return transitions((style, show) =>
    show ? (
      <>
        {/* Backdrop */}
        <animated.div
          style={{ opacity: style.opacity }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
        />

        {/* Modal */}
        <animated.div
          style={style}
          className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                     md:w-full md:max-w-2xl md:max-h-[85vh]
                     glass rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">ร้านค้าเพชร</h2>
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">
                    เติมเพชรเพื่อเล่นกาชาและซื้อไอเทม
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Currency Tabs */}
            <div className="flex gap-2 mt-4">
              {currencyTabs.map((currency) => {
                const info = CURRENCIES[currency];
                const isActive = selectedCurrency === currency;
                return (
                  <button
                    key={currency}
                    onClick={() => setSelectedCurrency(currency)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition
                      ${isActive 
                        ? `bg-gradient-to-r ${info.gradient} text-white` 
                        : 'glass hover:bg-[hsl(var(--color-surface))]'
                      }`}
                  >
                    <span>{info.icon}</span>
                    <span>{info.nameTH}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  isPurchased={purchasedPackage === pkg.id}
                  onPurchase={() => handlePurchase(pkg)}
                />
              ))}
            </div>

            {filteredPackages.length === 0 && (
              <div className="text-center py-12 text-[hsl(var(--color-text-muted))]">
                <p>ยังไม่มีแพ็กเกจสำหรับ {CURRENCIES[selectedCurrency].nameTH}</p>
              </div>
            )}
          </div>

          {/* Exchange Section */}
          <ExchangeSection />
        </animated.div>
      </>
    ) : null
  );
}

// Package Card Component
interface PackageCardProps {
  package: CurrencyPackage;
  isPurchased: boolean;
  onPurchase: () => void;
}

function PackageCard({ package: pkg, isPurchased, onPurchase }: PackageCardProps) {
  const currencyInfo = CURRENCIES[pkg.currency];
  const [isHovered, setIsHovered] = useState(false);

  const hoverSpring = useSpring({
    scale: isHovered ? 1.02 : 1,
    y: isHovered ? -4 : 0,
    config: config.wobbly,
  });

  const purchasedSpring = useSpring({
    scale: isPurchased ? [1, 1.1, 1] : [1],
    config: config.stiff,
  });

  const tagColors = {
    popular: 'from-orange-500 to-red-500',
    best_value: 'from-green-500 to-emerald-500',
    limited: 'from-purple-500 to-pink-500',
    first_purchase: 'from-blue-500 to-cyan-500',
  };

  return (
    <animated.div
      style={{ ...hoverSpring, ...purchasedSpring }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer
                 ${isPurchased 
                   ? 'border-green-500 bg-green-500/10' 
                   : 'glass border-transparent hover:border-purple-500/50'
                 }`}
      onClick={onPurchase}
    >
      {/* Tag */}
      {pkg.tag && (
        <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white
                        bg-gradient-to-r ${tagColors[pkg.tag]}`}>
          {pkg.tag === 'popular' && '🔥 ยอดนิยม'}
          {pkg.tag === 'best_value' && '⭐ คุ้มสุด'}
          {pkg.tag === 'limited' && '⏰ จำกัดเวลา'}
          {pkg.tag === 'first_purchase' && '🎁 โบนัสใหม่'}
        </div>
      )}

      {/* Icon */}
      <div className="text-center mb-3">
        <span className="text-4xl">{pkg.icon}</span>
      </div>

      {/* Amount */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-bold" style={{ color: currencyInfo.color }}>
            {formatCurrency(pkg.amount)}
          </span>
          <span className="text-xl">{currencyInfo.icon}</span>
        </div>
        {pkg.bonusAmount > 0 && (
          <div className="flex items-center justify-center gap-1 text-green-500 text-sm">
            <Sparkles className="w-3 h-3" />
            <span>+{formatCurrency(pkg.bonusAmount)} โบนัส!</span>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-center text-sm text-[hsl(var(--color-text-muted))] mb-3">
        {pkg.nameTH}
      </p>

      {/* Price Button */}
      <button
        className={`w-full py-2 rounded-xl font-bold text-white transition
                   ${isPurchased 
                     ? 'bg-green-500' 
                     : `bg-gradient-to-r ${currencyInfo.gradient} hover:opacity-90`
                   }`}
        disabled={isPurchased}
      >
        {isPurchased ? (
          <span className="flex items-center justify-center gap-1">
            <Check className="w-4 h-4" /> ซื้อแล้ว!
          </span>
        ) : (
          `฿${pkg.priceTHB}`
        )}
      </button>

      {/* Discount */}
      {pkg.discount && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-500 text-white text-xs font-bold">
          -{pkg.discount}%
        </div>
      )}
    </animated.div>
  );
}

// Exchange Section
function ExchangeSection() {
  const wallet = useWalletStore((state) => state.wallet);
  const exchangeCurrency = useWalletStore((state) => state.exchangeCurrency);
  const [exchangeAmount, setExchangeAmount] = useState(10);
  const [fromCurrency] = useState<CurrencyType>('gems');
  const [toCurrency] = useState<CurrencyType>('coins');

  const fromInfo = CURRENCIES[fromCurrency];
  const toInfo = CURRENCIES[toCurrency];
  const exchangeRate = fromInfo.exchangeRate || 1;
  const resultAmount = exchangeAmount * exchangeRate;

  const handleExchange = () => {
    if (exchangeCurrency(fromCurrency, toCurrency, exchangeAmount)) {
      sfxGenerator.play('coin');
    } else {
      sfxGenerator.play('error');
    }
  };

  return (
    <div className="p-4 border-t border-white/10 glass-subtle">
      <div className="flex items-center gap-2 mb-3">
        <ArrowLeftRight className="w-5 h-5 text-purple-500" />
        <span className="font-medium">แลกเปลี่ยน</span>
      </div>

      <div className="flex items-center gap-3">
        {/* From */}
        <div className="flex-1 flex items-center gap-2 p-3 glass rounded-xl">
          <span className="text-xl">{fromInfo.icon}</span>
          <input
            type="number"
            min="1"
            max={wallet[fromCurrency]}
            value={exchangeAmount}
            onChange={(e) => setExchangeAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 bg-transparent border-none outline-none font-bold text-center"
          />
        </div>

        {/* Arrow */}
        <div className="text-[hsl(var(--color-text-muted))]">→</div>

        {/* To */}
        <div className="flex-1 flex items-center gap-2 p-3 glass rounded-xl">
          <span className="text-xl">{toInfo.icon}</span>
          <span className="font-bold" style={{ color: toInfo.color }}>
            {formatCurrency(resultAmount)}
          </span>
        </div>

        {/* Exchange Button */}
        <button
          onClick={handleExchange}
          disabled={wallet[fromCurrency] < exchangeAmount}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold
                     disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          แลก
        </button>
      </div>

      <div className="mt-2 text-xs text-[hsl(var(--color-text-muted))] text-center">
        คุณมี <CurrencyInline currency={fromCurrency} size="xs" /> • อัตรา: 1 {fromInfo.icon} = {exchangeRate} {toInfo.icon}
      </div>
    </div>
  );
}

export default CurrencyShop;
