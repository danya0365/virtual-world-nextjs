'use client';

import { animated, config, useSpring, useTrail } from '@react-spring/web';
import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  variant?: 'default' | 'glass' | 'gradient';
}

export function AnimatedCard({
  children,
  delay = 0,
  variant = 'default',
  className,
  ...props
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Entry animation
  const entrySpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay,
    config: config.gentle,
  });

  // Hover animation
  const hoverSpring = useSpring({
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0px)',
    boxShadow: isHovered
      ? '0 25px 50px rgba(100, 100, 200, 0.25)'
      : '0 10px 30px rgba(100, 100, 200, 0.1)',
    config: config.wobbly,
  });

  const variantStyles = {
    default: 'bg-[hsl(var(--color-surface-elevated))] border border-[hsl(var(--color-primary)/0.1)]',
    glass: 'glass',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/20',
  };

  return (
    <animated.div
      style={{
        opacity: entrySpring.opacity,
        transform: entrySpring.y.to((y) => `translateY(${y}px)`),
        ...hoverSpring,
      }}
      className={twMerge(
        'rounded-2xl overflow-hidden transition-colors duration-200',
        variantStyles[variant],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </animated.div>
  );
}

// Staggered list of cards
interface AnimatedCardListProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function AnimatedCardList({ 
  children, 
  staggerDelay = 100,
  className 
}: AnimatedCardListProps) {
  const trail = useTrail(children.length, {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  return (
    <div className={className}>
      {trail.map((style, index) => (
        <animated.div
          key={index}
          style={{
            opacity: style.opacity,
            transform: style.y.to((y) => `translateY(${y}px)`),
          }}
        >
          {children[index]}
        </animated.div>
      ))}
    </div>
  );
}
