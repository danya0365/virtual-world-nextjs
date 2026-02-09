'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ArrowLeft, Clock, Crosshair, Target, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TargetObject {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  type: 'normal' | 'golden' | 'bomb';
  points: number;
}

const GAME_MODES = [
  { id: 'classic', name: 'คลาสสิค', duration: 30, description: 'ยิงให้มากที่สุดใน 30 วินาที' },
  { id: 'precision', name: 'แม่นยำ', duration: 45, description: 'โดน 3 ครั้งก็จบเกม' },
  { id: 'speed', name: 'ความเร็ว', duration: 20, description: 'เป้ามาเร็วมาก!' },
];

export default function ShootingGalleryPage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [selectedMode, setSelectedMode] = useState(GAME_MODES[0]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [time, setTime] = useState(30);
  const [targets, setTargets] = useState<TargetObject[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [shots, setShots] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [clickEffects, setClickEffects] = useState<{x: number, y: number, id: number}[]>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextTargetId = useRef(0);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const spawnTarget = useCallback(() => {
    const isGolden = Math.random() < 0.1;
    const isBomb = !isGolden && Math.random() < 0.15;
    const speedMultiplier = selectedMode.id === 'speed' ? 2 : 1;
    
    const newTarget: TargetObject = {
      id: nextTargetId.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      size: isGolden ? 30 : isBomb ? 40 : Math.random() * 20 + 30,
      speed: (Math.random() * 2 + 1) * speedMultiplier,
      direction: Math.random() * 360,
      type: isGolden ? 'golden' : isBomb ? 'bomb' : 'normal',
      points: isGolden ? 50 : isBomb ? -30 : 10,
    };
    
    setTargets(prev => [...prev, newTarget]);
    
    // Remove target after a while if not hit
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 3000 / speedMultiplier);
  }, [selectedMode.id]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState]);

  // Spawn targets
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const spawnRate = selectedMode.id === 'speed' ? 400 : 800;
    const interval = setInterval(spawnTarget, spawnRate);
    
    return () => clearInterval(interval);
  }, [gameState, spawnTarget, selectedMode.id]);

  // Move targets
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const moveInterval = setInterval(() => {
      setTargets(prev => prev.map(target => {
        const radians = (target.direction * Math.PI) / 180;
        let newX = target.x + Math.cos(radians) * target.speed * 0.5;
        let newY = target.y + Math.sin(radians) * target.speed * 0.5;
        let newDirection = target.direction;
        
        // Bounce off walls
        if (newX < 5 || newX > 95) {
          newDirection = 180 - target.direction;
          newX = Math.max(5, Math.min(95, newX));
        }
        if (newY < 5 || newY > 85) {
          newDirection = -target.direction;
          newY = Math.max(5, Math.min(85, newY));
        }
        
        return { ...target, x: newX, y: newY, direction: newDirection };
      }));
    }, 50);
    
    return () => clearInterval(moveInterval);
  }, [gameState]);

  const handleClick = (e: React.MouseEvent) => {
    if (gameState !== 'playing') return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Add click effect
    const effectId = Date.now();
    setClickEffects(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id: effectId }]);
    setTimeout(() => setClickEffects(prev => prev.filter(ef => ef.id !== effectId)), 300);
    
    setShots(prev => prev + 1);
    
    // Check if hit any target
    let hitTarget: TargetObject | null = null;
    
    for (const target of targets) {
      const distance = Math.sqrt((clickX - target.x) ** 2 + (clickY - target.y) ** 2);
      if (distance < target.size / 6) {
        hitTarget = target;
        break;
      }
    }
    
    if (hitTarget) {
      setTargets(prev => prev.filter(t => t.id !== hitTarget!.id));
      
      if (hitTarget.type === 'bomb') {
        setScore(prev => Math.max(0, prev + hitTarget!.points));
        setCombo(0);
        setMisses(prev => prev + 1);
        
        if (selectedMode.id === 'precision' && misses >= 2) {
          setGameState('finished');
        }
      } else {
        const newCombo = combo + 1;
        const comboMultiplier = Math.min(newCombo, 10) * 0.1 + 1;
        const points = Math.round(hitTarget.points * comboMultiplier);
        
        setScore(prev => prev + points);
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));
        setHits(prev => prev + 1);
      }
    } else {
      setCombo(0);
      setMisses(prev => prev + 1);
      
      if (selectedMode.id === 'precision' && misses >= 2) {
        setGameState('finished');
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTime(selectedMode.duration);
    setTargets([]);
    setHits(0);
    setMisses(0);
    setShots(0);
    nextTargetId.current = 0;
    setGameState('playing');
  };

  // Update high score
  useEffect(() => {
    if (gameState === 'finished' && score > highScore) {
      setHighScore(score);
    }
  }, [gameState, score, highScore]);

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring}>
        <div className="flex items-center gap-4">
          <Link href="/games" className="p-2 glass rounded-xl hover:bg-[hsl(var(--color-surface))] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
              🎯 Shooting Gallery
            </h1>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              ยิงเป้าให้แม่น!
            </p>
          </div>
        </div>
      </animated.div>

      {/* Menu State */}
      {gameState === 'menu' && (
        <div className="space-y-6">
          {/* Select Mode */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4">เลือกโหมด</h3>
            <div className="space-y-3">
              {GAME_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4
                    ${selectedMode.id === mode.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-4 ring-yellow-400' 
                      : 'bg-[hsl(var(--color-surface))] hover:scale-[1.02]'
                    }`}
                >
                  <div className="text-3xl">
                    {mode.id === 'classic' ? '🎯' : mode.id === 'precision' ? '🎪' : '⚡'}
                  </div>
                  <div>
                    <div className="font-bold">{mode.name}</div>
                    <div className="text-sm opacity-80">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Guide */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4">ประเภทเป้า</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-[hsl(var(--color-surface))] rounded-2xl">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-sm font-medium">ปกติ</div>
                <div className="text-xs text-green-500">+10</div>
              </div>
              <div className="p-4 bg-[hsl(var(--color-surface))] rounded-2xl">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-sm font-medium">ทอง</div>
                <div className="text-xs text-yellow-500">+50</div>
              </div>
              <div className="p-4 bg-[hsl(var(--color-surface))] rounded-2xl">
                <div className="text-4xl mb-2">💣</div>
                <div className="text-sm font-medium">ระเบิด</div>
                <div className="text-xs text-red-500">-30</div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Crosshair className="w-6 h-6" />
            เริ่มเกม!
          </button>

          {highScore > 0 && (
            <div className="text-center text-[hsl(var(--color-text-muted))]">
              🏆 สถิติสูงสุด: {highScore}
            </div>
          )}
        </div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="glass rounded-xl p-2 text-center">
              <Clock className="w-4 h-4 mx-auto text-blue-500" />
              <div className="text-lg font-bold">{time}</div>
            </div>
            <div className="glass rounded-xl p-2 text-center">
              <Trophy className="w-4 h-4 mx-auto text-yellow-500" />
              <div className="text-lg font-bold">{score}</div>
            </div>
            <div className="glass rounded-xl p-2 text-center">
              <Zap className="w-4 h-4 mx-auto text-purple-500" />
              <div className="text-lg font-bold">x{combo}</div>
            </div>
            <div className="glass rounded-xl p-2 text-center">
              <Target className="w-4 h-4 mx-auto text-green-500" />
              <div className="text-lg font-bold">{accuracy}%</div>
            </div>
          </div>

          {/* Game Area */}
          <div 
            ref={gameAreaRef}
            onClick={handleClick}
            className="glass rounded-3xl relative overflow-hidden cursor-crosshair"
            style={{ aspectRatio: '4/3', minHeight: '300px' }}
          >
            {/* Targets */}
            {targets.map((target) => (
              <div
                key={target.id}
                className={`absolute transition-transform duration-100 animate-pulse
                  ${target.type === 'golden' ? 'text-yellow-400' : 
                    target.type === 'bomb' ? 'text-red-500' : 'text-blue-500'}`}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  fontSize: `${target.size}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {target.type === 'golden' ? '⭐' : target.type === 'bomb' ? '💣' : '🎯'}
              </div>
            ))}

            {/* Click Effects */}
            {clickEffects.map(effect => (
              <div
                key={effect.id}
                className="absolute pointer-events-none text-yellow-400 animate-ping"
                style={{ left: effect.x, top: effect.y, transform: 'translate(-50%, -50%)' }}
              >
                ✦
              </div>
            ))}

            {/* Crosshair cursor hint */}
            {targets.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-[hsl(var(--color-text-muted))]">
                <Crosshair className="w-12 h-12 opacity-20" />
              </div>
            )}
          </div>

          {selectedMode.id === 'precision' && (
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all
                    ${i < misses ? 'bg-red-500' : 'bg-green-500'}`}
                />
              ))}
              <span className="text-sm text-[hsl(var(--color-text-muted))] ml-2">
                ชีวิต: {3 - misses}/3
              </span>
            </div>
          )}
        </div>
      )}

      {/* Finished State */}
      {gameState === 'finished' && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">จบเกม!</h2>
          
          <div className="text-4xl font-bold text-purple-500 my-4">
            {score} คะแนน
          </div>

          {score === highScore && score > 0 && (
            <div className="px-4 py-2 bg-yellow-400/20 text-yellow-500 rounded-full inline-flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5" />
              สถิติใหม่!
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="p-3 bg-[hsl(var(--color-surface))] rounded-xl">
              <div className="text-2xl font-bold text-green-500">{hits}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">ยิงโดน</div>
            </div>
            <div className="p-3 bg-[hsl(var(--color-surface))] rounded-xl">
              <div className="text-2xl font-bold text-red-500">{misses}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">พลาด</div>
            </div>
            <div className="p-3 bg-[hsl(var(--color-surface))] rounded-xl">
              <div className="text-2xl font-bold text-purple-500">x{maxCombo}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">คอมโบสูงสุด</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
            >
              เล่นอีกครั้ง
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 py-3 rounded-xl glass font-medium"
            >
              เปลี่ยนโหมด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
