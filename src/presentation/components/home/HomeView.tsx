'use client';

import { siteConfig } from '@/src/config/site.config';
import { CHARACTER_COLORS } from '@/src/infrastructure/repositories/mock/MockCharacterRepository';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { ColorPicker } from '@/src/presentation/components/common/ColorPicker';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import { Box, Coins, Gem, Layers, Play, Sparkles, Star, Users } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

// Lazy load 3D component
const Character3D = lazy(() => 
  import('@/src/presentation/components/3d/Character3D').then(mod => ({ default: mod.Character3D }))
);

type ViewMode = 'css' | '3d';

export function HomeView() {
  const [selectedColor, setSelectedColor] = useState('white');
  const [isCharacterHovered, setIsCharacterHovered] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('css');

  // Character animation
  const characterSpring = useSpring({
    transform: isCharacterHovered 
      ? 'scale(1.05) rotateY(10deg)' 
      : 'scale(1) rotateY(0deg)',
    config: config.wobbly,
  });

  // Title animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    delay: 100,
    config: config.gentle,
  });

  const stats = siteConfig.defaultStats;
  const currentColor = CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0';

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-8">
      {/* Welcome Section */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="text-text-primary">
              ยินดีต้อนรับกลับมา,{' '}
            </span>
            <span className="gradient-text">Mike!</span>
            <span className="ml-2 inline-block animate-bounce-soft">👋</span>
          </h1>
          <p className="text-text-secondary">
            พร้อมที่จะสำรวจโลกใหม่แล้วหรือยัง?
          </p>
        </div>
        
        {/* View Mode Toggle */}
        <GlassPanel padding="none" className="flex rounded-xl overflow-hidden self-start">
          <button
            onClick={() => setViewMode('css')}
            className={`px-4 py-2 flex items-center gap-2 transition-all duration-200
              ${viewMode === 'css' 
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:bg-primary/10'
              }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-sm font-medium">CSS</span>
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-4 py-2 flex items-center gap-2 transition-all duration-200
              ${viewMode === '3d' 
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:bg-primary/10'
              }`}
          >
            <Box className="w-4 h-4" />
            <span className="text-sm font-medium">3D</span>
          </button>
        </GlassPanel>
      </animated.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Color Picker */}
        <div className="lg:col-span-2">
          <AnimatedCard delay={200} variant="glass" className="p-4">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              สีตัวละคร
            </h2>
            <ColorPicker
              colors={CHARACTER_COLORS}
              selectedId={selectedColor}
              onSelect={setSelectedColor}
              className="items-center"
            />
          </AnimatedCard>
        </div>

        {/* Center - Character Display */}
        <div className="lg:col-span-6">
          <AnimatedCard delay={300} variant="gradient" className="h-full min-h-[400px] p-8">
            <div 
              className="h-full flex flex-col items-center justify-center relative"
              onMouseEnter={() => setIsCharacterHovered(true)}
              onMouseLeave={() => setIsCharacterHovered(false)}
            >
              {viewMode === '3d' ? (
                /* 3D Character */
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64 w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                  </div>
                }>
                  <div className="w-full h-72">
                    <Character3D 
                      color={currentColor}
                      accessories={[]}
                    />
                  </div>
                </Suspense>
              ) : (
                /* CSS Character */
                <animated.div 
                  style={characterSpring}
                  className="relative"
                >
                  {/* Character Body - Simple CSS representation */}
                  <div 
                    className="relative w-48 h-56 sm:w-56 sm:h-64 md:w-64 md:h-72"
                    style={{
                      filter: 'drop-shadow(0 20px 40px rgba(100, 100, 200, 0.3))',
                    }}
                  >
                    {/* Head */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 
                                rounded-3xl shadow-lg"
                      style={{
                        background: currentColor,
                      }}
                    >
                      {/* Eyes */}
                      <div className="absolute top-12 left-6 w-3 h-3 rounded-full bg-gray-800" />
                      <div className="absolute top-12 right-6 w-3 h-3 rounded-full bg-gray-800" />
                      {/* Mouth */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-gray-600" />
                    </div>

                    {/* Body */}
                    <div 
                      className="absolute top-24 left-1/2 -translate-x-1/2 w-24 h-28 sm:w-28 sm:h-32 
                                rounded-3xl shadow-lg"
                      style={{
                        background: currentColor,
                      }}
                    />

                    {/* Left Arm */}
                    <div 
                      className="absolute top-28 left-2 w-4 h-16 rounded-full shadow-md"
                      style={{
                        background: currentColor,
                      }}
                    />

                    {/* Right Arm */}
                    <div 
                      className="absolute top-28 right-2 w-4 h-16 rounded-full shadow-md"
                      style={{
                        background: currentColor,
                      }}
                    />

                    {/* Legs */}
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-[130%] w-6 h-12 rounded-xl shadow-md"
                      style={{
                        background: currentColor,
                      }}
                    />
                    <div 
                      className="absolute bottom-0 left-1/2 translate-x-[30%] w-6 h-12 rounded-xl shadow-md"
                      style={{
                        background: currentColor,
                      }}
                    />
                  </div>

                  {/* Floating sparkles */}
                  <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-bounce-soft" />
                  <Sparkles 
                    className="absolute top-1/2 -left-8 w-5 h-5 text-pink-400 animate-float" 
                    style={{ animationDelay: '-1s' }}
                  />
                </animated.div>
              )}

              {/* Hover instruction */}
              <p className="mt-8 text-sm text-text-muted text-center">
                {viewMode === '3d' ? '🖱️ ลากเพื่อหมุนตัวละคร' : 'เลื่อนเมาส์ไปบนตัวละครเพื่อดูการหมุน'}
              </p>
            </div>
          </AnimatedCard>
        </div>

        {/* Right Sidebar - Stats & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Stars */}
          <AnimatedCard delay={400} variant="glass" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">ดาว</span>
              <div className="flex gap-0.5">
                {Array.from({ length: stats.maxStars }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < stats.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </AnimatedCard>

          {/* Coins */}
          <AnimatedCard delay={500} variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 
                            flex items-center justify-center shadow-lg">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-text-primary">
                  {stats.coins}
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full mt-1">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Gems */}
          <AnimatedCard delay={600} variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 
                            flex items-center justify-center shadow-lg">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-text-primary">
                  {stats.gems}
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full mt-1">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-red-400 to-pink-500"
                    style={{ width: '24%' }}
                  />
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Play Button */}
          <AnimatedCard delay={700} variant="default" className="p-4 mt-auto">
            <AnimatedButton
              variant="primary"
              size="lg"
              fullWidth
              icon={<Play className="w-5 h-5" />}
            >
              เล่นเลย!
            </AnimatedButton>
          </AnimatedCard>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassPanel padding="sm" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600
                        flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">1,234</div>
            <div className="text-xs text-text-muted">เพื่อนออนไลน์</div>
          </div>
        </GlassPanel>

        <GlassPanel padding="sm" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500
                        flex items-center justify-center">
            <span className="text-lg">🎮</span>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">56</div>
            <div className="text-xs text-text-muted">ด่านที่ผ่าน</div>
          </div>
        </GlassPanel>

        <GlassPanel padding="sm" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500
                        flex items-center justify-center">
            <span className="text-lg">🏆</span>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">12</div>
            <div className="text-xs text-text-muted">รางวัล</div>
          </div>
        </GlassPanel>

        <GlassPanel padding="sm" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500
                        flex items-center justify-center">
            <span className="text-lg">💝</span>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">89</div>
            <div className="text-xs text-text-muted">ไอเท็ม</div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
