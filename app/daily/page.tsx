'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { Calendar, CheckCircle, Gift, RotateCw, Sparkles, Star, Zap } from 'lucide-react';
import { useState } from 'react';

// Mock data for daily rewards
const DAILY_STREAK_REWARDS = [
  { day: 1, coins: 50, icon: '🪙' },
  { day: 2, coins: 100, icon: '💎' },
  { day: 3, coins: 150, icon: '🎁' },
  { day: 4, coins: 200, icon: '⭐' },
  { day: 5, coins: 300, icon: '🔥' },
  { day: 6, coins: 400, icon: '💫' },
  { day: 7, coins: 1000, icon: '👑', special: true },
];

const SPIN_WHEEL_PRIZES = [
  { id: 1, name: '50 Coins', icon: '🪙', color: '#FFD700', value: 50 },
  { id: 2, name: 'Rare Item', icon: '💎', color: '#00D4FF', value: 0 },
  { id: 3, name: '100 Coins', icon: '🪙', color: '#FFD700', value: 100 },
  { id: 4, name: 'XP Boost', icon: '⚡', color: '#9B59B6', value: 0 },
  { id: 5, name: '200 Coins', icon: '🪙', color: '#FFD700', value: 200 },
  { id: 6, name: 'Mystery Box', icon: '🎁', color: '#E74C3C', value: 0 },
  { id: 7, name: '500 Coins', icon: '💰', color: '#2ECC71', value: 500 },
  { id: 8, name: 'JACKPOT!', icon: '👑', color: '#F39C12', value: 1000 },
];

export default function DailyRewardsPage() {
  const [currentStreak, setCurrentStreak] = useState(3);
  const [claimedToday, setClaimedToday] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<typeof SPIN_WHEEL_PRIZES[0] | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [freeSpins, setFreeSpins] = useState(1);
  const [showResult, setShowResult] = useState(false);

  // Animations
  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const wheelSpring = useSpring({
    rotation: wheelRotation,
    config: { tension: 10, friction: 50 },
  });

  const resultSpring = useSpring({
    opacity: showResult ? 1 : 0,
    scale: showResult ? 1 : 0.5,
    config: config.wobbly,
  });

  const handleClaimDaily = () => {
    if (claimedToday) return;
    setClaimedToday(true);
    setCurrentStreak(prev => Math.min(prev + 1, 7));
  };

  const handleSpin = () => {
    if (isSpinning || freeSpins <= 0) return;
    
    setIsSpinning(true);
    setShowResult(false);
    setFreeSpins(prev => prev - 1);
    
    // Random result
    const resultIndex = Math.floor(Math.random() * SPIN_WHEEL_PRIZES.length);
    const result = SPIN_WHEEL_PRIZES[resultIndex];
    
    // Calculate rotation (5 full spins + land on prize)
    const segmentAngle = 360 / SPIN_WHEEL_PRIZES.length;
    const targetAngle = 360 * 5 + (resultIndex * segmentAngle) + (segmentAngle / 2);
    
    setWheelRotation(prev => prev + targetAngle);
    
    setTimeout(() => {
      setSpinResult(result);
      setIsSpinning(false);
      setShowResult(true);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <Gift className="w-8 h-8 text-pink-500" />
          รางวัลรายวัน
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          กลับมาเล่นทุกวันเพื่อรับรางวัลสุดพิเศษ!
        </p>
      </animated.div>

      {/* Login Streak Section */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Login Streak
          </h2>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
            <Zap className="w-4 h-4" />
            {currentStreak} วันติดต่อกัน
          </div>
        </div>

        {/* Streak Days */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {DAILY_STREAK_REWARDS.map((reward) => {
            const isClaimed = reward.day <= currentStreak;
            const isToday = reward.day === currentStreak + 1;
            const isLocked = reward.day > currentStreak + 1;

            return (
              <div
                key={reward.day}
                className={`relative p-2 sm:p-4 rounded-2xl text-center transition-all duration-300
                  ${reward.special ? 'col-span-1 ring-2 ring-yellow-400 ring-offset-2 ring-offset-[hsl(var(--color-background))]' : ''}
                  ${isClaimed ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : ''}
                  ${isToday && !claimedToday ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white animate-pulse cursor-pointer hover:scale-105' : ''}
                  ${isToday && claimedToday ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : ''}
                  ${isLocked ? 'bg-[hsl(var(--color-surface))] opacity-50' : ''}
                `}
                onClick={() => isToday && !claimedToday && handleClaimDaily()}
              >
                <div className="text-2xl sm:text-3xl mb-1">{reward.icon}</div>
                <div className="text-[10px] sm:text-xs font-bold">Day {reward.day}</div>
                <div className="text-[10px] sm:text-sm font-medium">+{reward.coins}</div>
                
                {isClaimed && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Button */}
        {!claimedToday && currentStreak < 7 && (
          <button
            onClick={handleClaimDaily}
            className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white font-bold text-lg shadow-lg hover:shadow-xl 
                     hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              รับรางวัลวันที่ {currentStreak + 1}
            </span>
          </button>
        )}

        {claimedToday && (
          <div className="mt-4 py-3 text-center text-green-500 font-bold">
            ✅ รับรางวัลวันนี้แล้ว! กลับมาพรุ่งนี้นะ
          </div>
        )}
      </div>

      {/* Spin Wheel Section */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Lucky Spin
          </h2>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle font-medium">
            <RotateCw className="w-4 h-4" />
            {freeSpins} สปินฟรี
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Wheel */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] 
                            border-l-transparent border-r-transparent border-t-red-500 
                            drop-shadow-lg" />
            </div>

            {/* Spinning Wheel */}
            <animated.div
              style={{
                transform: wheelSpring.rotation.to(r => `rotate(${r}deg)`),
              }}
              className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {SPIN_WHEEL_PRIZES.map((prize, index) => {
                  const segmentAngle = 360 / SPIN_WHEEL_PRIZES.length;
                  const startAngle = index * segmentAngle - 90;
                  const endAngle = startAngle + segmentAngle;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);
                  
                  const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                  
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                  
                  // Text position
                  const textAngle = startAngle + segmentAngle / 2;
                  const textRad = (textAngle * Math.PI) / 180;
                  const textX = 50 + 30 * Math.cos(textRad);
                  const textY = 50 + 30 * Math.sin(textRad);
                  
                  return (
                    <g key={prize.id}>
                      <path
                        d={pathData}
                        fill={prize.color}
                        stroke="#fff"
                        strokeWidth="0.5"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="8"
                        transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                      >
                        {prize.icon}
                      </text>
                    </g>
                  );
                })}
                {/* Center circle */}
                <circle cx="50" cy="50" r="8" fill="#fff" stroke="#FFD700" strokeWidth="2" />
              </svg>
            </animated.div>
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || freeSpins <= 0}
            className={`mt-6 px-8 py-3 rounded-2xl font-bold text-lg shadow-lg transition-all
              ${isSpinning || freeSpins <= 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-xl hover:scale-105 active:scale-95'
              } text-white`}
          >
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <RotateCw className="w-5 h-5 animate-spin" />
                กำลังหมุน...
              </span>
            ) : freeSpins <= 0 ? (
              'หมดสปินฟรีแล้ว'
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                หมุนเลย!
              </span>
            )}
          </button>

          {/* Result Popup */}
          {showResult && spinResult && (
            <animated.div
              style={resultSpring}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl"
            >
              <div className="glass p-8 rounded-3xl text-center">
                <div className="text-6xl mb-4">{spinResult.icon}</div>
                <h3 className="text-2xl font-bold text-[hsl(var(--color-text-primary))]">
                  🎉 ยินดีด้วย!
                </h3>
                <p className="text-lg text-[hsl(var(--color-text-secondary))] mt-2">
                  คุณได้รับ <span className="font-bold text-yellow-500">{spinResult.name}</span>
                </p>
                <button
                  onClick={() => setShowResult(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                >
                  เยี่ยม!
                </button>
              </div>
            </animated.div>
          )}
        </div>
      </div>

      {/* Bonus Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">🎬</div>
          <h3 className="font-bold">ดูโฆษณา</h3>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">+1 สปิน</p>
          <button className="mt-2 px-4 py-1.5 rounded-xl bg-green-500 text-white text-sm font-medium">
            ดูเลย
          </button>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">💎</div>
          <h3 className="font-bold">ซื้อสปิน</h3>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">100 Gems = 5 Spins</p>
          <button className="mt-2 px-4 py-1.5 rounded-xl bg-purple-500 text-white text-sm font-medium">
            ซื้อเลย
          </button>
        </div>
      </div>
    </div>
  );
}
