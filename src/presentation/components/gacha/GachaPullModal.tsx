'use client';

/**
 * Gacha Pull Modal - The main gacha pulling experience
 */

import { CURRENCIES, formatCurrency, RARITIES, RarityType } from '@/src/domain/entities/Currency';
import { GachaBanner, GachaResult } from '@/src/domain/entities/Gacha';
import { sfxGenerator } from '@/src/infrastructure/sound/SFXGenerator';
import { useGachaStore } from '@/src/stores/gachaStore';
import { useWalletStore } from '@/src/stores/walletStore';
import { animated, config, useSpring, useTransition } from '@react-spring/web';
import { RotateCcw, Sparkles, X, Zap } from 'lucide-react';
import { useCallback, useState } from 'react';
import { CosmicBackground, GachaReveal, RainbowBackground } from './GachaReveal';

interface GachaPullModalProps {
  banner: GachaBanner;
  isOpen: boolean;
  onClose: () => void;
}

type PullPhase = 'ready' | 'pulling' | 'revealing' | 'results';

export function GachaPullModal({ banner, isOpen, onClose }: GachaPullModalProps) {
  const [phase, setPhase] = useState<PullPhase>('ready');
  const [pullResults, setPullResults] = useState<GachaResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const wallet = useWalletStore((state) => state.wallet);
  const spendCurrency = useWalletStore((state) => state.spendCurrency);
  const executePull = useGachaStore((state) => state.executePull);
  const pityCount = useGachaStore((state) => state.getPityCount(banner.id));

  const canAffordSingle = wallet[banner.cost.currency] >= banner.cost.single;
  const canAffordMulti = wallet[banner.cost.currency] >= banner.cost.multi;

  const currencyInfo = CURRENCIES[banner.cost.currency];

  // Modal transition
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    config: config.stiff,
  });

  // Pull button animation
  const pullButtonSpring = useSpring({
    scale: phase === 'ready' ? 1 : 0.9,
    config: config.wobbly,
  });

  // Handle pull
  const handlePull = useCallback((count: 1 | 10) => {
    const cost = count === 1 ? banner.cost.single : banner.cost.multi;
    
    if (!spendCurrency(banner.cost.currency, cost, `สุ่ม${banner.nameTH} x${count}`)) {
      sfxGenerator.play('error');
      return;
    }

    sfxGenerator.play('click');
    setPhase('pulling');
    setPullResults([]);
    setCurrentResultIndex(0);
    setShowSkip(false);

    // Simulate pulling animation
    setTimeout(() => {
      const results = executePull(banner, count);
      setPullResults(results);
      setPhase('revealing');
      
      // Show skip button after a delay
      setTimeout(() => setShowSkip(true), 1000);
    }, 1500);
  }, [banner, executePull, spendCurrency]);

  // Handle reveal complete
  const handleRevealComplete = useCallback(() => {
    if (currentResultIndex < pullResults.length - 1) {
      setCurrentResultIndex(currentResultIndex + 1);
    } else {
      setPhase('results');
    }
  }, [currentResultIndex, pullResults.length]);

  // Skip to results
  const handleSkip = useCallback(() => {
    setPhase('results');
    sfxGenerator.play('click');
  }, []);

  // Reset for another pull
  const handleReset = useCallback(() => {
    setPhase('ready');
    setPullResults([]);
    setCurrentResultIndex(0);
    setShowSkip(false);
  }, []);

  // Get highest rarity from results
  const getHighestRarity = (): RarityType => {
    const rarityOrder: RarityType[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
    let highest: RarityType = 'common';
    
    for (const result of pullResults) {
      const currentIndex = rarityOrder.indexOf(result.item.rarity);
      const highestIndex = rarityOrder.indexOf(highest);
      if (currentIndex > highestIndex) {
        highest = result.item.rarity;
      }
    }
    
    return highest;
  };

  const highestRarity = pullResults.length > 0 ? getHighestRarity() : 'common';
  const showRainbow = ['legendary', 'mythic'].includes(highestRarity);
  const showCosmic = highestRarity === 'mythic';

  return transitions((style, show) =>
    show ? (
      <>
        {/* Backdrop */}
        <animated.div
          style={{ opacity: style.opacity }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          onClick={phase === 'ready' || phase === 'results' ? onClose : undefined}
        />

        {/* Modal */}
        <animated.div
          style={style}
          className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col"
        >
          {/* Background Effects */}
          {showCosmic && phase === 'revealing' && <CosmicBackground isActive />}
          {showRainbow && phase === 'revealing' && (
            <RainbowBackground isActive intensity={highestRarity === 'mythic' ? 'high' : 'medium'} />
          )}

          {/* Content */}
          <div className="relative flex-1 glass rounded-3xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{banner.type === 'limited' ? '🌟' : '🎰'}</div>
                <div>
                  <h2 className="font-bold text-lg">{banner.nameTH}</h2>
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">
                    Pity: {pityCount}/{banner.pityThreshold}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Current balance */}
                <div className="flex items-center gap-1 px-3 py-1.5 glass-subtle rounded-full">
                  <span>{currencyInfo.icon}</span>
                  <span className="font-bold" style={{ color: currencyInfo.color }}>
                    {formatCurrency(wallet[banner.cost.currency])}
                  </span>
                </div>

                {/* Close button */}
                {(phase === 'ready' || phase === 'results') && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              {/* Ready Phase */}
              {phase === 'ready' && (
                <div className="text-center space-y-6">
                  {/* Featured Items */}
                  <div className="flex justify-center gap-4 flex-wrap">
                    {banner.featuredItems.slice(0, 3).map((itemId) => {
                      const item = banner.pool.find((i) => i.id === itemId);
                      if (!item) return null;
                      const rarity = RARITIES[item.rarity];
                      return (
                        <div
                          key={itemId}
                          className="p-4 glass rounded-2xl text-center"
                          style={{ borderColor: rarity.color, borderWidth: 2 }}
                        >
                          <div className="text-4xl mb-2">{item.icon}</div>
                          <p className="font-medium text-sm">{item.nameTH}</p>
                          <p className="text-xs" style={{ color: rarity.color }}>
                            {rarity.nameTH}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rate Info */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    {Object.entries(banner.rates)
                      .filter(([, rate]) => rate > 0)
                      .map(([rarity, rate]) => (
                        <span
                          key={rarity}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: `${RARITIES[rarity as RarityType].color}30`,
                            color: RARITIES[rarity as RarityType].color,
                          }}
                        >
                          {RARITIES[rarity as RarityType].nameTH}: {rate}%
                        </span>
                      ))}
                  </div>

                  {/* Pity Progress */}
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[hsl(var(--color-text-muted))]">Pity Progress</span>
                      <span className="font-bold text-yellow-500">
                        {pityCount}/{banner.pityThreshold}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-[hsl(var(--color-surface))] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                        style={{ width: `${(pityCount / banner.pityThreshold) * 100}%` }}
                      />
                    </div>
                    {banner.softPityStart && pityCount >= banner.softPityStart && (
                      <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Soft Pity Active! อัตราเพิ่มขึ้น
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Pulling Phase */}
              {phase === 'pulling' && (
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full bg-[hsl(var(--color-background))] flex items-center justify-center">
                      <span className="text-5xl animate-bounce">🎰</span>
                    </div>
                  </div>
                  <p className="text-xl font-bold">กำลังสุ่ม...</p>
                </div>
              )}

              {/* Revealing Phase */}
              {phase === 'revealing' && pullResults.length > 0 && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <GachaReveal
                    key={currentResultIndex}
                    item={pullResults[currentResultIndex].item}
                    isNew={pullResults[currentResultIndex].isNew}
                    isPity={pullResults[currentResultIndex].isPity}
                    isRateUp={pullResults[currentResultIndex].isRateUp}
                    onComplete={handleRevealComplete}
                  />

                  {/* Progress indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {pullResults.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i <= currentResultIndex
                            ? 'bg-purple-500 scale-125'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Skip button */}
                  {showSkip && (
                    <button
                      onClick={handleSkip}
                      className="absolute top-4 right-4 px-4 py-2 glass rounded-xl
                               hover:bg-white/10 transition flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      ข้าม
                    </button>
                  )}
                </div>
              )}

              {/* Results Phase */}
              {phase === 'results' && (
                <div className="w-full space-y-4">
                  <h3 className="text-center text-xl font-bold mb-4">
                    🎉 ผลการสุ่ม ({pullResults.length} ชิ้น)
                  </h3>

                  {/* Results Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto p-2">
                    {pullResults.map((result, i) => {
                      const rarity = RARITIES[result.item.rarity];
                      return (
                        <div
                          key={i}
                          className="relative p-3 glass rounded-xl text-center transition-all hover:scale-105"
                          style={{
                            borderColor: rarity.color,
                            borderWidth: 2,
                            boxShadow: `0 0 15px ${rarity.glowColor}`,
                          }}
                        >
                          {/* Badges */}
                          {result.isNew && (
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-green-500 
                                           text-white text-[10px] font-bold">
                              NEW
                            </span>
                          )}

                          <div className="text-3xl mb-1">{result.item.icon}</div>
                          <p className="font-medium text-xs truncate">{result.item.nameTH}</p>
                          <p className="text-[10px]" style={{ color: rarity.color }}>
                            {rarity.nameTH}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="flex justify-center gap-4 flex-wrap text-sm">
                    {Object.entries(
                      pullResults.reduce((acc, r) => {
                        acc[r.item.rarity] = (acc[r.item.rarity] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort(
                        ([a], [b]) =>
                          ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(a) -
                          ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(b)
                      )
                      .map(([rarity, count]) => (
                        <span
                          key={rarity}
                          className="px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: `${RARITIES[rarity as RarityType].color}30`,
                            color: RARITIES[rarity as RarityType].color,
                          }}
                        >
                          {RARITIES[rarity as RarityType].nameTH}: {count}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Pull Buttons */}
            {(phase === 'ready' || phase === 'results') && (
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-center gap-4">
                  {/* Single Pull */}
                  <animated.button
                    style={pullButtonSpring}
                    onClick={() => handlePull(1)}
                    disabled={!canAffordSingle}
                    className={`relative px-6 py-4 rounded-2xl font-bold text-white transition
                              ${canAffordSingle
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                                : 'bg-gray-500 cursor-not-allowed opacity-50'
                              }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>สุ่ม x1</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20">
                        {currencyInfo.icon} {banner.cost.single}
                      </span>
                    </div>
                  </animated.button>

                  {/* Multi Pull */}
                  <animated.button
                    style={pullButtonSpring}
                    onClick={() => handlePull(10)}
                    disabled={!canAffordMulti}
                    className={`relative px-6 py-4 rounded-2xl font-bold text-white transition
                              ${canAffordMulti
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90'
                                : 'bg-gray-500 cursor-not-allowed opacity-50'
                              }`}
                  >
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-red-500 text-xs">
                      -10%
                    </span>
                    <div className="flex items-center gap-2">
                      <span>สุ่ม x10</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20">
                        {currencyInfo.icon} {banner.cost.multi}
                      </span>
                    </div>
                  </animated.button>

                  {/* Pull Again (Results phase) */}
                  {phase === 'results' && (
                    <button
                      onClick={handleReset}
                      className="px-6 py-4 rounded-2xl font-bold glass hover:bg-white/10 transition
                               flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      สุ่มอีก
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </animated.div>
      </>
    ) : null
  );
}

export default GachaPullModal;
