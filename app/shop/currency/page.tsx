'use client';

/**
 * Currency Shop Page - Full shop experience for buying premium currency
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
import { animated, config, useSpring } from '@react-spring/web';
import {
    ArrowLeftRight,
    Check,
    ChevronRight,
    Clock,
    Gift,
    History,
    Sparkles,
    Star,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

export default function ShopCurrencyPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('gems');
  const [purchasedPackage, setPurchasedPackage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const wallet = useWalletStore((state) => state.wallet);
  const transactions = useWalletStore((state) => state.transactions);
  const addCurrency = useWalletStore((state) => state.addCurrency);
  const exchangeCurrency = useWalletStore((state) => state.exchangeCurrency);
  const [exchangeAmount, setExchangeAmount] = useState(10);

  const handlePurchase = (pkg: CurrencyPackage) => {
    const totalAmount = pkg.amount + pkg.bonusAmount;
    addCurrency(pkg.currency, totalAmount, `ซื้อ ${pkg.nameTH}`, 'purchase');
    setPurchasedPackage(pkg.id);
    sfxGenerator.play('success');
    setTimeout(() => setPurchasedPackage(null), 2000);
  };

  const handleExchange = () => {
    if (exchangeCurrency('gems', 'coins', exchangeAmount)) {
      sfxGenerator.play('coin');
    } else {
      sfxGenerator.play('error');
    }
  };

  const filteredPackages = CURRENCY_PACKAGES.filter(
    (pkg) => pkg.currency === selectedCurrency
  );

  const currencyTabs: CurrencyType[] = ['gems', 'tickets', 'crystals'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            💎 ร้านค้าเพชร
          </h1>
          <p className="text-[hsl(var(--color-text-muted))]">
            เติมเพชรเพื่อสุ่มกาชาและซื้อไอเทมพิเศษ
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-3 glass rounded-xl hover:bg-[hsl(var(--color-surface))] transition flex items-center gap-2"
        >
          <History className="w-5 h-5" />
          <span className="hidden sm:inline">ประวัติ</span>
        </button>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.keys(CURRENCIES) as CurrencyType[]).map((currency) => {
          const info = CURRENCIES[currency];
          return (
            <div
              key={currency}
              className={`p-4 glass rounded-2xl cursor-pointer transition-all
                ${selectedCurrency === currency ? 'ring-2 ring-purple-500' : 'hover:bg-[hsl(var(--color-surface))]'}`}
              onClick={() => info.isPremium && setSelectedCurrency(currency)}
            >
              <div className="text-3xl mb-2">{info.icon}</div>
              <div className="font-bold text-lg" style={{ color: info.color }}>
                {formatCurrency(wallet[currency])}
              </div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">
                {info.nameTH}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currency Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {currencyTabs.map((currency) => {
              const info = CURRENCIES[currency];
              const isActive = selectedCurrency === currency;
              return (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition whitespace-nowrap
                    ${isActive 
                      ? `bg-gradient-to-r ${info.gradient} text-white shadow-lg` 
                      : 'glass hover:bg-[hsl(var(--color-surface))]'
                    }`}
                >
                  <span className="text-xl">{info.icon}</span>
                  <span>{info.nameTH}</span>
                </button>
              );
            })}
          </div>

          {/* Special Offers */}
          <div className="p-4 glass rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    🎉 โบนัสผู้เล่นใหม่!
                  </h3>
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">
                    ซื้อครั้งแรกได้โบนัส x2
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-orange-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">2 วันที่เหลือ</span>
              </div>
            </div>
          </div>

          {/* Packages Grid */}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Exchange Section */}
          <div className="p-5 glass rounded-2xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <ArrowLeftRight className="w-5 h-5 text-purple-500" />
              แลกเปลี่ยน
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 glass rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💎</span>
                    <input
                      type="number"
                      min="1"
                      max={wallet.gems}
                      value={exchangeAmount}
                      onChange={(e) => setExchangeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-transparent border-none outline-none font-bold text-lg"
                    />
                  </div>
                  <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
                    คุณมี {formatCurrency(wallet.gems)} เพชร
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />

                <div className="flex-1 p-3 glass rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪙</span>
                    <span className="font-bold text-lg text-yellow-500">
                      {formatCurrency(exchangeAmount * 100)}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
                    อัตรา 1:100
                  </p>
                </div>
              </div>

              <button
                onClick={handleExchange}
                disabled={wallet.gems < exchangeAmount}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold
                          disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                แลกเปลี่ยนเลย
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-5 glass rounded-2xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              สิทธิพิเศษ VIP
            </h3>

            <div className="space-y-3">
              {[
                { icon: <Sparkles className="w-4 h-4" />, text: 'โบนัส 20% ทุกการซื้อ' },
                { icon: <TrendingUp className="w-4 h-4" />, text: 'EXP x1.5 ตลอด' },
                { icon: <Gift className="w-4 h-4" />, text: 'กาชาฟรี 1 ครั้ง/วัน' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/20 
                                 flex items-center justify-center text-yellow-500">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 rounded-xl glass border-2 border-yellow-500/50 
                             text-yellow-500 font-bold hover:bg-yellow-500/10 transition">
              อัพเกรด VIP
            </button>
          </div>

          {/* Transaction History */}
          {showHistory && (
            <div className="p-5 glass rounded-2xl">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-blue-500" />
                ประวัติล่าสุด
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2 glass-subtle rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>{CURRENCIES[tx.currency].icon}</span>
                      <span className="text-sm truncate max-w-[120px]">{tx.description}</span>
                    </div>
                    <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-sm text-[hsl(var(--color-text-muted))] py-4">
                    ยังไม่มีประวัติ
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Package Card Component
function PackageCard({ 
  package: pkg, 
  isPurchased, 
  onPurchase 
}: { 
  package: CurrencyPackage; 
  isPurchased: boolean; 
  onPurchase: () => void;
}) {
  const currencyInfo = CURRENCIES[pkg.currency];
  const [isHovered, setIsHovered] = useState(false);

  const hoverSpring = useSpring({
    scale: isHovered ? 1.03 : 1,
    y: isHovered ? -6 : 0,
    config: config.wobbly,
  });

  const tagConfig = {
    popular: { text: '🔥 ยอดนิยม', color: 'from-orange-500 to-red-500' },
    best_value: { text: '⭐ คุ้มสุด', color: 'from-green-500 to-emerald-500' },
    limited: { text: '⏰ จำกัดเวลา', color: 'from-purple-500 to-pink-500' },
    first_purchase: { text: '🎁 โบนัสใหม่', color: 'from-blue-500 to-cyan-500' },
  };

  return (
    <animated.div
      style={hoverSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPurchase}
      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all
                 ${isPurchased 
                   ? 'border-green-500 bg-green-500/10' 
                   : 'glass border-transparent hover:border-purple-500/50'
                 }`}
    >
      {/* Tag */}
      {pkg.tag && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full 
                        text-xs font-bold text-white bg-gradient-to-r ${tagConfig[pkg.tag].color}`}>
          {tagConfig[pkg.tag].text}
        </div>
      )}

      {/* Icon */}
      <div className="text-center mb-4 mt-2">
        <span className="text-5xl">{pkg.icon}</span>
      </div>

      {/* Amount */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold" style={{ color: currencyInfo.color }}>
            {formatCurrency(pkg.amount)}
          </span>
          <span className="text-2xl">{currencyInfo.icon}</span>
        </div>
        {pkg.bonusAmount > 0 && (
          <div className="flex items-center justify-center gap-1 text-green-500 text-sm mt-1">
            <Sparkles className="w-4 h-4" />
            <span>+{formatCurrency(pkg.bonusAmount)} โบนัส!</span>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-center text-sm text-[hsl(var(--color-text-muted))] mb-4">
        {pkg.nameTH}
      </p>

      {/* Price Button */}
      <button
        className={`w-full py-3 rounded-xl font-bold text-white text-lg transition
                   ${isPurchased 
                     ? 'bg-green-500' 
                     : `bg-gradient-to-r ${currencyInfo.gradient} hover:opacity-90`
                   }`}
        disabled={isPurchased}
      >
        {isPurchased ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> ซื้อแล้ว!
          </span>
        ) : (
          `฿${pkg.priceTHB.toLocaleString()}`
        )}
      </button>
    </animated.div>
  );
}
