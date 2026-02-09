'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ChevronRight, Compass, Lock, Map, MapPin, Navigation, Sparkles, Users, Zap } from 'lucide-react';
import { useState } from 'react';

// Mock data for world locations
const WORLD_REGIONS = [
  {
    id: 'central',
    name: 'Central City',
    icon: '🏙️',
    description: 'เมืองหลักที่คึกคัก',
    players: 1250,
    unlocked: true,
    level: 1,
    locations: [
      { id: 'plaza', name: 'Central Plaza', icon: '⛲', players: 450 },
      { id: 'market', name: 'Grand Market', icon: '🏪', players: 320 },
      { id: 'park', name: 'City Park', icon: '🌳', players: 180 },
    ],
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    icon: '🌲',
    description: 'ป่าแห่งความลึกลับ',
    players: 890,
    unlocked: true,
    level: 5,
    locations: [
      { id: 'treehouse', name: 'Treehouse Village', icon: '🏡', players: 250 },
      { id: 'lake', name: 'Crystal Lake', icon: '💧', players: 340 },
      { id: 'cave', name: 'Secret Cave', icon: '🕳️', players: 120 },
    ],
  },
  {
    id: 'mountain',
    name: 'Dragon Peak',
    icon: '🏔️',
    description: 'ยอดเขาแห่งมังกร',
    players: 560,
    unlocked: true,
    level: 10,
    locations: [
      { id: 'summit', name: 'Mountain Summit', icon: '⛰️', players: 180 },
      { id: 'temple', name: 'Dragon Temple', icon: '🏯', players: 220 },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean Kingdom',
    icon: '🌊',
    description: 'อาณาจักรใต้ทะเล',
    players: 0,
    unlocked: false,
    level: 15,
    requiredLevel: 15,
  },
  {
    id: 'sky',
    name: 'Sky Islands',
    icon: '☁️',
    description: 'เกาะลอยฟ้า',
    players: 0,
    unlocked: false,
    level: 20,
    requiredLevel: 20,
  },
  {
    id: 'volcano',
    name: 'Volcanic Realm',
    icon: '🌋',
    description: 'ดินแดนภูเขาไฟ',
    players: 0,
    unlocked: false,
    level: 25,
    requiredLevel: 25,
  },
];

const QUICK_TRAVEL = [
  { id: 'home', name: 'บ้านของฉัน', icon: '🏠' },
  { id: 'friends', name: 'หาเพื่อน', icon: '👥' },
  { id: 'event', name: 'อีเวนต์', icon: '🎉' },
  { id: 'random', name: 'สุ่มไป', icon: '🎲' },
];

const CURRENT_LOCATION = {
  region: 'Central City',
  location: 'Central Plaza',
  players: 450,
};

export default function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const selectedRegionData = WORLD_REGIONS.find(r => r.id === selectedRegion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <Map className="w-8 h-8 text-blue-500" />
          แผนที่โลก
          <Compass className="w-8 h-8 text-green-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          สำรวจโลกกว้างและพบเพื่อนใหม่!
        </p>
      </animated.div>

      {/* Current Location */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <Navigation className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-[hsl(var(--color-text-muted))]">ตำแหน่งปัจจุบัน</div>
          <div className="font-bold">{CURRENT_LOCATION.location}</div>
          <div className="text-xs text-[hsl(var(--color-text-secondary))]">{CURRENT_LOCATION.region}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-green-500 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {CURRENT_LOCATION.players}
          </div>
          <div className="text-xs text-[hsl(var(--color-text-muted))]">คนอยู่ที่นี่</div>
        </div>
      </div>

      {/* Quick Travel */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_TRAVEL.map((item) => (
          <button
            key={item.id}
            className="glass rounded-2xl p-3 text-center hover:scale-105 transition-transform"
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs font-medium">{item.name}</div>
          </button>
        ))}
      </div>

      {/* World Map Grid */}
      <div className="glass rounded-3xl p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          เลือกภูมิภาค
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {WORLD_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => region.unlocked && setSelectedRegion(region.id)}
              disabled={!region.unlocked}
              className={`relative p-4 rounded-2xl text-center transition-all
                ${region.unlocked 
                  ? 'bg-[hsl(var(--color-surface))] hover:scale-105 cursor-pointer' 
                  : 'bg-[hsl(var(--color-surface))] opacity-50 cursor-not-allowed'
                }
                ${selectedRegion === region.id ? 'ring-2 ring-purple-500' : ''}
              `}
            >
              {!region.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                  <div className="text-center">
                    <Lock className="w-6 h-6 mx-auto text-white" />
                    <span className="text-xs text-white mt-1 block">Lv.{region.requiredLevel}</span>
                  </div>
                </div>
              )}
              <div className="text-4xl mb-2">{region.icon}</div>
              <div className="font-bold text-sm">{region.name}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))] mt-1">{region.description}</div>
              {region.unlocked && region.players > 0 && (
                <div className="mt-2 text-xs text-green-500 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  {region.players}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Region Details */}
      {selectedRegionData && selectedRegionData.locations && (
        <div className="glass rounded-3xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedRegionData.icon}</span>
            <div>
              <h3 className="font-bold">{selectedRegionData.name}</h3>
              <div className="text-sm text-[hsl(var(--color-text-muted))]">
                {selectedRegionData.locations.length} สถานที่
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {selectedRegionData.locations.map((location) => (
              <button
                key={location.id}
                className="w-full flex items-center gap-4 p-3 rounded-xl bg-[hsl(var(--color-surface))] hover:bg-[hsl(var(--color-primary)/0.05)] transition"
              >
                <div className="text-2xl">{location.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{location.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {location.players}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[hsl(var(--color-text-muted))]" />
                </div>
              </button>
            ))}
          </div>

          <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            เทเลพอร์ตไป {selectedRegionData.name}
          </button>
        </div>
      )}

      {/* Discover New Places */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          ค้นพบสถานที่ใหม่
        </h3>
        <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-4">
          ปลดล็อก 3 สถานที่ที่ซ่อนอยู่เพื่อรับรางวัลพิเศษ!
        </p>
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center text-2xl">❓</div>
          <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center text-2xl">❓</div>
          <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center text-2xl">❓</div>
          <div className="flex-1 flex items-center justify-end">
            <span className="text-sm text-purple-500 font-medium">0/3 ค้นพบ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
