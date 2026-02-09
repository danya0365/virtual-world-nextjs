'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { Check, Crown, Gift, Rocket, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

// VIP Benefits
const VIP_BENEFITS = [
  { id: 1, name: 'XP Boost +50%', icon: '⚡', description: 'รับ XP เพิ่มจากทุกกิจกรรม' },
  { id: 2, name: 'Coins Boost +25%', icon: '🪙', description: 'รับเหรียญเพิ่มจากทุกกิจกรรม' },
  { id: 3, name: 'Exclusive Items', icon: '👑', description: 'เข้าถึงไอเทม VIP เท่านั้น' },
  { id: 4, name: 'Priority Support', icon: '💬', description: 'รับการช่วยเหลือก่อนใคร' },
  { id: 5, name: 'VIP Badge', icon: '⭐', description: 'แสดงป้าย VIP สุดพิเศษ' },
  { id: 6, name: 'Ad-Free', icon: '🚫', description: 'ไม่มีโฆษณารบกวน' },
  { id: 7, name: 'Early Access', icon: '🎮', description: 'เล่นฟีเจอร์ใหม่ก่อนใคร' },
  { id: 8, name: 'Custom Avatar', icon: '🎨', description: 'ตกแต่งอวาตาร์พิเศษ' },
];

const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'รายเดือน',
    price: 99,
    period: 'เดือน',
    popular: false,
    savings: null,
  },
  {
    id: 'quarterly',
    name: '3 เดือน',
    price: 249,
    period: '3 เดือน',
    popular: true,
    savings: '17%',
  },
  {
    id: 'yearly',
    name: 'รายปี',
    price: 799,
    period: 'ปี',
    popular: false,
    savings: '33%',
  },
];

const VIP_EXCLUSIVE_ITEMS = [
  { id: 1, name: 'Crown of Kings', icon: '👑', rarity: 'legendary' },
  { id: 2, name: 'Golden Wings', icon: '✨', rarity: 'legendary' },
  { id: 3, name: 'Diamond Sword', icon: '💎', rarity: 'epic' },
  { id: 4, name: 'VIP Pet', icon: '🦄', rarity: 'legendary' },
];

export default function VIPPage() {
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [isVIP] = useState(false);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20, scale: 0.9 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: config.gentle,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold mb-4">
          <Crown className="w-5 h-5" />
          VIP MEMBERSHIP
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          ปลดล็อกพลังพิเศษ
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          รับสิทธิประโยชน์มากมายและไอเทมสุดพิเศษ!
        </p>
      </animated.div>

      {/* VIP Status Card */}
      {isVIP ? (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 text-white text-center">
            <Crown className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">คุณเป็น VIP!</h2>
            <p className="opacity-80 mt-1">หมดอายุ: 30 วัน</p>
          </div>
        </div>
      ) : (
        /* Subscription Plans */
        <div className="grid grid-cols-3 gap-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-4 rounded-2xl text-center transition-all
                ${selectedPlan === plan.id 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-105 shadow-lg' 
                  : 'glass hover:scale-102'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  ยอดนิยม
                </div>
              )}
              {plan.savings && (
                <div className={`absolute -top-2 right-2 px-2 py-0.5 ${
                  selectedPlan === plan.id ? 'bg-white/30' : 'bg-green-500 text-white'
                } text-[10px] font-bold rounded-full`}>
                  ประหยัด {plan.savings}
                </div>
              )}
              <div className="text-sm font-medium mb-1">{plan.name}</div>
              <div className="text-2xl font-bold">฿{plan.price}</div>
              <div className={`text-xs ${selectedPlan === plan.id ? 'opacity-80' : 'text-[hsl(var(--color-text-muted))]'}`}>
                /{plan.period}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Benefits */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-500" />
          สิทธิประโยชน์ VIP
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {VIP_BENEFITS.map((benefit) => (
            <div key={benefit.id} className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--color-surface))]">
              <div className="text-2xl">{benefit.icon}</div>
              <div>
                <div className="font-medium text-sm">{benefit.name}</div>
                <div className="text-xs text-[hsl(var(--color-text-muted))]">{benefit.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Items */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          ไอเทม VIP Exclusive
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {VIP_EXCLUSIVE_ITEMS.map((item) => (
            <div key={item.id} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl
                ${item.rarity === 'legendary' 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                  : 'bg-gradient-to-br from-purple-400 to-pink-500'
                }`}>
                {item.icon}
              </div>
              <div className="text-xs font-medium mt-2">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="grid grid-cols-3 text-center text-sm font-bold">
          <div className="p-3 bg-[hsl(var(--color-surface))]">ฟีเจอร์</div>
          <div className="p-3 bg-[hsl(var(--color-surface))]">ฟรี</div>
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">VIP</div>
        </div>
        {[
          { name: 'เล่นเกม', free: true, vip: true },
          { name: 'XP Boost', free: false, vip: true },
          { name: 'ไอเทมพิเศษ', free: false, vip: true },
          { name: 'ไม่มีโฆษณา', free: false, vip: true },
          { name: 'เข้าถึงก่อน', free: false, vip: true },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-3 text-center text-sm border-t border-[hsl(var(--color-primary)/0.1)]">
            <div className="p-3 text-left">{row.name}</div>
            <div className="p-3">
              {row.free ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <span className="text-gray-400">—</span>}
            </div>
            <div className="p-3 bg-yellow-500/5">
              <Check className="w-5 h-5 mx-auto text-yellow-500" />
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      {!isVIP && (
        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <Rocket className="w-6 h-6" />
          อัพเกรดเป็น VIP
        </button>
      )}

      {/* Terms */}
      <p className="text-center text-xs text-[hsl(var(--color-text-muted))]">
        ชำระเงินผ่าน App Store • ต่ออายุอัตโนมัติ • ยกเลิกได้ทุกเมื่อ
      </p>
    </div>
  );
}
