'use client';

/**
 * Gacha Page - Main gacha experience with banner selection
 */

import { CURRENCIES, RARITIES, RarityType } from '@/src/domain/entities/Currency';
import {
    GachaBanner,
    getActiveBanners
} from '@/src/domain/entities/Gacha';
import { CurrencyBar } from '@/src/presentation/components/currency/CurrencyBar';
import GachaPullModal from '@/src/presentation/components/gacha/GachaPullModal';
import { useGachaStore } from '@/src/stores/gachaStore';
import { useWalletStore } from '@/src/stores/walletStore';
import { animated, config, useSpring } from '@react-spring/web';
import {
    ChevronRight,
    Clock,
    Gift,
    History,
    Sparkles,
    Star,
    Trophy
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function GachaPage() {
  const [selectedBanner, setSelectedBanner] = useState<GachaBanner | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const wallet = useWalletStore((state) => state.wallet);
  const pullHistory = useGachaStore((state) => state.pullHistory);
  const pityTrackers = useGachaStore((state) => state.pityTrackers);
  const inventory = useGachaStore((state) => state.inventory);
  
  // Memoize computed values to avoid infinite loops
  const totalPulls = useMemo(() => {
    return pullHistory.reduce((total, session) => total + session.results.length, 0);
  }, [pullHistory]);

  const rarityStats = useMemo(() => {
    const stats: Record<RarityType, number> = {
      common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0,
    };
    pullHistory.forEach((session) => {
      session.results.forEach((result) => {
        stats[result.item.rarity]++;
      });
    });
    return stats;
  }, [pullHistory]);

  const recentPulls = useMemo(() => pullHistory.slice(0, 5), [pullHistory]);
  
  const getPityCount = (bannerId: string) => pityTrackers[bannerId]?.pullCount || 0;

  const activeBanners = getActiveBanners();


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🎰 กาชา
          </h1>
          <p className="text-[hsl(var(--color-text-muted))]">
            สุ่มรับตัวละคร สัตว์เลี้ยง และไอเทมสุดพิเศษ!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CurrencyBar currencies={['gems', 'tickets']} />
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-3 glass rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Trophy className="w-5 h-5 text-yellow-500" />}
          label="สุ่มทั้งหมด"
          value={totalPulls.toString()}
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-purple-500" />}
          label="Legendary"
          value={rarityStats.legendary.toString()}
          color="#F59E0B"
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5 text-pink-500" />}
          label="Mythic"
          value={rarityStats.mythic.toString()}
          color="#EC4899"
        />
        <StatCard
          icon={<Gift className="w-5 h-5 text-green-500" />}
          label="ของใหม่วันนี้"
          value="3"
          color="#22C55E"
        />
      </div>

      {/* Featured Banner */}
      {activeBanners.filter((b) => b.type === 'limited').length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            🌟 แบนเนอร์พิเศษ
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activeBanners
              .filter((b) => b.type === 'limited')
              .map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  pityCount={getPityCount(banner.id)}
                  onClick={() => setSelectedBanner(banner)}
                  isFeatured
                />
              ))}
          </div>
        </div>
      )}

      {/* All Banners */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg flex items-center gap-2">
          🎰 แบนเนอร์ทั้งหมด
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBanners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              pityCount={getPityCount(banner.id)}
              onClick={() => setSelectedBanner(banner)}
            />
          ))}
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed right-4 top-24 bottom-24 w-80 glass rounded-2xl p-4 z-40 overflow-auto">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            ประวัติการสุ่ม
          </h3>

          {recentPulls.length === 0 ? (
            <p className="text-center text-[hsl(var(--color-text-muted))] py-8">
              ยังไม่มีประวัติ
            </p>
          ) : (
            <div className="space-y-4">
              {recentPulls.map((session, i) => (
                <div key={i} className="p-3 glass-subtle rounded-xl">
                  <p className="text-xs text-[hsl(var(--color-text-muted))] mb-2">
                    {new Date(session.timestamp).toLocaleString('th-TH')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {session.results.map((result, j) => {
                      const rarity = RARITIES[result.item.rarity];
                      return (
                        <span
                          key={j}
                          className="text-lg"
                          title={`${result.item.nameTH} (${rarity.nameTH})`}
                          style={{
                            filter: `drop-shadow(0 0 4px ${rarity.color})`,
                          }}
                        >
                          {result.item.icon}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rarity Stats */}
          <div className="mt-4 p-3 glass-subtle rounded-xl">
            <h4 className="font-medium text-sm mb-2">สถิติ Rarity</h4>
            <div className="space-y-1">
              {(Object.entries(rarityStats) as [RarityType, number][])
                .filter(([, count]) => count > 0)
                .sort(
                  ([a], [b]) =>
                    ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(a) -
                    ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(b)
                )
                .map(([rarity, count]) => (
                  <div key={rarity} className="flex items-center justify-between text-sm">
                    <span style={{ color: RARITIES[rarity].color }}>
                      {RARITIES[rarity].nameTH}
                    </span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Pull Modal */}
      {selectedBanner && (
        <GachaPullModal
          banner={selectedBanner}
          isOpen={!!selectedBanner}
          onClose={() => setSelectedBanner(null)}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-4 glass rounded-2xl">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-[hsl(var(--color-text-muted))]">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// Banner Card Component
function BannerCard({
  banner,
  pityCount,
  onClick,
  isFeatured = false,
}: {
  banner: GachaBanner;
  pityCount: number;
  onClick: () => void;
  isFeatured?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const currencyInfo = CURRENCIES[banner.cost.currency];

  const hoverSpring = useSpring({
    scale: isHovered ? 1.02 : 1,
    y: isHovered ? -4 : 0,
    config: config.wobbly,
  });

  const typeConfig = {
    standard: { badge: '🎰', color: 'from-blue-500 to-cyan-500' },
    limited: { badge: '🌟', color: 'from-purple-500 to-pink-500' },
    event: { badge: '🎉', color: 'from-orange-500 to-red-500' },
    beginner: { badge: '🎁', color: 'from-green-500 to-emerald-500' },
    weapon: { badge: '⚔️', color: 'from-gray-500 to-gray-600' },
  };

  const config_t = typeConfig[banner.type];

  return (
    <animated.div
      style={hoverSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all
                 ${isFeatured ? 'border-2 border-yellow-500/50' : 'glass'}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config_t.color} opacity-20`} />

      {/* Content */}
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{config_t.badge}</span>
              <h3 className="font-bold text-lg">{banner.nameTH}</h3>
            </div>
            <p className="text-sm text-[hsl(var(--color-text-muted))]">
              {banner.description}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
        </div>

        {/* Featured Items */}
        <div className="flex gap-2 mb-4">
          {banner.featuredItems.slice(0, 3).map((itemId) => {
            const item = banner.pool.find((i) => i.id === itemId);
            if (!item) return null;
            return (
              <div
                key={itemId}
                className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center text-2xl"
                style={{
                  boxShadow: `0 0 10px ${RARITIES[item.rarity].glowColor}`,
                }}
                title={item.nameTH}
              >
                {item.icon}
              </div>
            );
          })}
        </div>

        {/* Pity Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[hsl(var(--color-text-muted))]">Pity</span>
            <span className="font-bold">
              {pityCount}/{banner.pityThreshold}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[hsl(var(--color-surface))]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${config_t.color}`}
              style={{ width: `${(pityCount / banner.pityThreshold) * 100}%` }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[hsl(var(--color-text-muted))]">x1:</span>
            <span className="flex items-center gap-1 font-bold" style={{ color: currencyInfo.color }}>
              {currencyInfo.icon} {banner.cost.single}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[hsl(var(--color-text-muted))]">x10:</span>
            <span className="flex items-center gap-1 font-bold" style={{ color: currencyInfo.color }}>
              {currencyInfo.icon} {banner.cost.multi}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">-10%</span>
          </div>
        </div>

        {/* End date for limited */}
        {banner.endDate && (
          <div className="mt-3 flex items-center gap-1 text-xs text-orange-500">
            <Clock className="w-3 h-3" />
            หมดเขต: {new Date(banner.endDate).toLocaleDateString('th-TH')}
          </div>
        )}
      </div>
    </animated.div>
  );
}
