'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { Calendar, ChevronRight, Clock, Crown, Flame, Gift, PartyPopper, Sparkles, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data for events
const LIVE_EVENTS = [
  {
    id: 1,
    name: 'Winter Wonderland Festival',
    nameIcon: '❄️',
    description: 'สำรวจโลกแห่งหิมะและรับรางวัลพิเศษ!',
    image: '🏔️',
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    rewards: ['Limited Ice Crown', '1000 Coins', 'Snowflake Pet'],
    progress: 65,
    color: 'from-blue-400 to-cyan-500',
    participants: 12543,
  },
  {
    id: 2,
    name: 'Dragon Hunt Challenge',
    nameIcon: '🐉',
    description: 'ล่ามังกรและรับอาวุธในตำนาน!',
    image: '🔥',
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
    rewards: ['Dragon Slayer Sword', '500 XP'],
    progress: 30,
    color: 'from-orange-500 to-red-600',
    participants: 8721,
  },
];

const UPCOMING_EVENTS = [
  {
    id: 3,
    name: 'Valentine\'s Day Special',
    nameIcon: '💝',
    description: 'งานแห่งความรักกำลังจะมา!',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    rewards: ['Heart Wings', 'Love Potion x5'],
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 4,
    name: 'Champion\'s Arena',
    nameIcon: '⚔️',
    description: 'การแข่งขัน PvP ครั้งยิ่งใหญ่',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    rewards: ['Champion Title', 'Golden Armor'],
    color: 'from-purple-500 to-indigo-600',
  },
];

const DAILY_CHALLENGES = [
  { id: 1, name: 'เล่นเกม 3 ครั้ง', icon: '🎮', reward: 100, progress: 2, total: 3 },
  { id: 2, name: 'ส่งข้อความให้เพื่อน 5 คน', icon: '💬', reward: 50, progress: 5, total: 5, completed: true },
  { id: 3, name: 'ชนะการต่อสู้ 2 ครั้ง', icon: '⚔️', reward: 150, progress: 0, total: 2 },
  { id: 4, name: 'สำรวจโลกใหม่ 1 แห่ง', icon: '🗺️', reward: 200, progress: 0, total: 1 },
];

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <div className="bg-black/30 rounded-lg px-2 py-1 font-mono font-bold">{timeLeft.days}</div>
          <div className="text-[10px] opacity-80">วัน</div>
        </div>
      )}
      <div className="text-center">
        <div className="bg-black/30 rounded-lg px-2 py-1 font-mono font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-[10px] opacity-80">ชม.</div>
      </div>
      <div className="text-center">
        <div className="bg-black/30 rounded-lg px-2 py-1 font-mono font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-[10px] opacity-80">นาที</div>
      </div>
      <div className="text-center">
        <div className="bg-black/30 rounded-lg px-2 py-1 font-mono font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-[10px] opacity-80">วิ</div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <PartyPopper className="w-8 h-8 text-pink-500" />
          อีเวนต์พิเศษ
          <Flame className="w-8 h-8 text-orange-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          ร่วมกิจกรรมสุดพิเศษและรับรางวัลมากมาย!
        </p>
      </animated.div>

      {/* Live Events */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-500" />
          กำลังจัดอยู่ตอนนี้
          <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs animate-pulse">LIVE</span>
        </h2>
        
        <div className="space-y-4">
          {LIVE_EVENTS.map((event) => (
            <div
              key={event.id}
              className={`glass rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className={`bg-gradient-to-r ${event.color} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{event.nameIcon}</span>
                      <h3 className="text-xl font-bold">{event.name}</h3>
                    </div>
                    <p className="opacity-90 mb-3">{event.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        เหลือเวลา:
                      </div>
                      <CountdownTimer targetDate={event.endTime} />
                    </div>
                  </div>
                  <div className="text-6xl">{event.image}</div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>ความคืบหน้า</span>
                    <span>{event.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${event.progress}%` }}
                    />
                  </div>
                </div>

                {/* Rewards Preview */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.rewards.map((reward, i) => (
                    <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {reward}
                    </span>
                  ))}
                </div>

                {/* Participants */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm opacity-80">
                    👥 {event.participants.toLocaleString()} คนกำลังเข้าร่วม
                  </span>
                  <button className="px-4 py-2 bg-white text-gray-800 rounded-xl font-bold hover:bg-white/90 transition flex items-center gap-2">
                    เข้าร่วม
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          ภารกิจประจำวัน
        </h2>

        <div className="space-y-3">
          {DAILY_CHALLENGES.map((challenge) => (
            <div
              key={challenge.id}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all
                ${challenge.completed 
                  ? 'bg-green-500/10 border-2 border-green-500' 
                  : 'bg-[hsl(var(--color-surface))] hover:bg-[hsl(var(--color-primary)/0.05)]'
                }`}
            >
              <div className="text-2xl">{challenge.icon}</div>
              <div className="flex-1">
                <div className="font-medium">{challenge.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-[hsl(var(--color-surface-elevated))] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${challenge.completed ? 'bg-green-500' : 'bg-purple-500'}`}
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-[hsl(var(--color-text-muted))]">
                    {challenge.progress}/{challenge.total}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {challenge.completed ? (
                  <span className="px-3 py-1.5 bg-green-500 text-white rounded-xl text-sm font-bold">
                    ✓ รับแล้ว
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl text-sm font-bold">
                    +{challenge.reward} 🪙
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-500" />
          กำลังจะมาเร็วๆ นี้
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="glass rounded-2xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className={`bg-gradient-to-r ${event.color} p-4 text-white`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{event.nameIcon}</span>
                  <h3 className="font-bold">{event.name}</h3>
                </div>
                <p className="text-sm opacity-90 mb-3">{event.description}</p>
                
                <div className="flex items-center gap-2 text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  เริ่มใน:
                  <CountdownTimer targetDate={event.startTime} />
                </div>

                <div className="flex flex-wrap gap-1">
                  {event.rewards.map((reward, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Season Pass Teaser */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-6 text-white text-center">
          <Crown className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Season Pass</h2>
          <p className="opacity-90 mb-4">ปลดล็อครางวัลพิเศษมากกว่า 50+ ไอเทม!</p>
          <button className="px-6 py-3 bg-white text-amber-600 rounded-xl font-bold hover:bg-white/90 transition flex items-center gap-2 mx-auto">
            <Sparkles className="w-5 h-5" />
            ดูรายละเอียด
          </button>
        </div>
      </div>
    </div>
  );
}
