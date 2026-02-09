'use client';

/**
 * Gacha Animation Component
 * Custom animations for different rarity reveals
 */

import { RARITIES } from '@/src/domain/entities/Currency';
import { GACHA_ANIMATIONS, GachaItem } from '@/src/domain/entities/Gacha';
import { sfxGenerator } from '@/src/infrastructure/sound/SFXGenerator';
import { animated, config, useSpring, useTrail } from '@react-spring/web';
import { useEffect, useState } from 'react';

interface GachaRevealProps {
  item: GachaItem;
  isNew: boolean;
  isPity: boolean;
  isRateUp: boolean;
  onComplete: () => void;
  index?: number;
  skipAnimation?: boolean;
}

export function GachaReveal({
  item,
  isNew,
  isPity,
  isRateUp,
  onComplete,
  index = 0,
  skipAnimation = false,
}: GachaRevealProps) {
  const rarity = RARITIES[item.rarity];
  const animation = GACHA_ANIMATIONS[item.rarity];
  const [phase, setPhase] = useState<'initial' | 'glow' | 'reveal' | 'complete'>('initial');

  // Main reveal animation
  const revealSpring = useSpring({
    from: { scale: 0, rotate: 0, opacity: 0 },
    to: {
      scale: phase === 'reveal' || phase === 'complete' ? 1 : 0.5,
      rotate: phase === 'reveal' ? 360 : 0,
      opacity: phase === 'complete' ? 1 : phase === 'reveal' ? 1 : 0.5,
    },
    config: config.wobbly,
    delay: index * 150,
  });

  // Glow animation
  const glowSpring = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: {
      opacity: phase === 'glow' || phase === 'reveal' ? 0.8 : 0,
      scale: phase === 'glow' ? 1.5 : phase === 'reveal' ? 2 : 0.5,
    },
    config: { tension: 120, friction: 14 },
  });

  // Flash effect for high rarity
  const flashSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: phase === 'glow' && animation.hasFlash ? 1 : 0 },
    config: { duration: 100 },
  });

  // Shake effect
  const [shakeX, setShakeX] = useState(0);
  
  useEffect(() => {
    if (skipAnimation) {
      setPhase('complete');
      return;
    }

    // Start animation sequence
    const timer1 = setTimeout(() => setPhase('glow'), 100 + index * 150);
    const timer2 = setTimeout(() => {
      setPhase('reveal');
      // Play sound effect
      if (item.rarity === 'legendary' || item.rarity === 'mythic') {
        sfxGenerator.play('levelup');
      } else if (item.rarity === 'epic') {
        sfxGenerator.play('achievement');
      } else {
        sfxGenerator.play('success');
      }
      
      // Screen shake for high rarity
      if (animation.hasScreenShake) {
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
          setShakeX(Math.random() * 10 - 5);
          shakeCount++;
          if (shakeCount > 10) {
            clearInterval(shakeInterval);
            setShakeX(0);
          }
        }, 50);
      }
    }, 500 + index * 150);
    const timer3 = setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, animation.duration + index * 150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [animation.duration, animation.hasScreenShake, index, item.rarity, onComplete, skipAnimation]);

  return (
    <animated.div
      style={{
        transform: revealSpring.scale.to((s) => `scale(${s}) translateX(${shakeX}px)`),
        opacity: revealSpring.opacity,
      }}
      className="relative flex flex-col items-center"
    >
      {/* Flash overlay */}
      {animation.hasFlash && (
        <animated.div
          style={{ opacity: flashSpring.opacity }}
          className="absolute inset-0 bg-white rounded-3xl z-10 pointer-events-none"
        />
      )}

      {/* Glow effect */}
      <animated.div
        style={{
          opacity: glowSpring.opacity,
          transform: glowSpring.scale.to((s) => `scale(${s})`),
          background: `radial-gradient(circle, ${rarity.glowColor} 0%, transparent 70%)`,
        }}
        className="absolute inset-0 rounded-full blur-xl z-0"
      />

      {/* Particles */}
      <Particles 
        count={animation.particleCount} 
        color={rarity.color} 
        isActive={phase === 'reveal' || phase === 'complete'}
      />

      {/* Item Card */}
      <div
        className={`relative z-10 p-6 rounded-3xl backdrop-blur-xl border-2 text-center
                   bg-gradient-to-br ${rarity.gradient} bg-opacity-20`}
        style={{
          borderColor: rarity.color,
          boxShadow: `0 0 30px ${rarity.glowColor}`,
        }}
      >
        {/* Badges */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
          {isNew && (
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold">
              NEW!
            </span>
          )}
          {isPity && (
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold">
              PITY!
            </span>
          )}
          {isRateUp && (
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs font-bold">
              RATE UP!
            </span>
          )}
        </div>

        {/* Icon */}
        <div className="text-6xl mb-4">{item.icon}</div>

        {/* Name */}
        <h3 className="font-bold text-lg mb-1">{item.nameTH}</h3>

        {/* Rarity */}
        <div
          className="text-sm font-medium px-3 py-1 rounded-full inline-block"
          style={{ backgroundColor: `${rarity.color}30`, color: rarity.color }}
        >
          ⭐ {rarity.nameTH}
        </div>

        {/* Category */}
        <p className="text-xs text-[hsl(var(--color-text-muted))] mt-2 capitalize">
          {item.category}
        </p>
      </div>
    </animated.div>
  );
}

// Particle effect component
function Particles({ count, color, isActive }: { count: number; color: string; isActive: boolean }) {
  const particles = Array.from({ length: Math.min(count, 30) }, (_, i) => ({
    id: i,
    angle: (360 / count) * i,
    distance: 50 + Math.random() * 100,
    size: 3 + Math.random() * 5,
    duration: 500 + Math.random() * 500,
  }));

  const trail = useTrail(particles.length, {
    from: { opacity: 0, scale: 0 },
    to: { opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 },
    config: { tension: 200, friction: 20 },
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {trail.map((style, i) => {
        const particle = particles[i];
        const x = Math.cos((particle.angle * Math.PI) / 180) * particle.distance;
        const y = Math.sin((particle.angle * Math.PI) / 180) * particle.distance;

        return (
          <animated.div
            key={particle.id}
            style={{
              ...style,
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
              borderRadius: '50%',
              transform: style.scale.to(
                (s) => `translate(${x * s}px, ${y * s}px) scale(${s})`
              ),
              boxShadow: `0 0 ${particle.size * 2}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}

// Rainbow background effect for legendary+
interface RainbowBackgroundProps {
  isActive: boolean;
  intensity: 'low' | 'medium' | 'high';
}

export function RainbowBackground({ isActive, intensity }: RainbowBackgroundProps) {
  const spring = useSpring({
    from: { opacity: 0, rotate: 0 },
    to: { opacity: isActive ? 0.3 : 0, rotate: isActive ? 360 : 0 },
    config: { duration: 3000 },
    loop: isActive,
  });

  const intensityScale = {
    low: 0.3,
    medium: 0.5,
    high: 0.8,
  };

  return (
    <animated.div
      style={{
        opacity: spring.opacity.to((o) => o * intensityScale[intensity]),
        transform: spring.rotate.to((r) => `rotate(${r}deg)`),
      }}
      className="absolute inset-0 pointer-events-none"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(
            from 0deg,
            #ff0000,
            #ff8000,
            #ffff00,
            #00ff00,
            #00ffff,
            #0080ff,
            #8000ff,
            #ff0080,
            #ff0000
          )`,
          filter: 'blur(60px)',
        }}
      />
    </animated.div>
  );
}

// Cosmic/Galaxy effect for mythic
export function CosmicBackground({ isActive }: { isActive: boolean }) {
  const [stars] = useState(() =>
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 2000,
    }))
  );

  const spring = useSpring({
    from: { opacity: 0 },
    to: { opacity: isActive ? 1 : 0 },
    config: { duration: 500 },
  });

  return (
    <animated.div
      style={{ opacity: spring.opacity }}
      className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black"
    >
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}ms`,
            boxShadow: '0 0 10px #fff',
          }}
        />
      ))}
    </animated.div>
  );
}

export default GachaReveal;
