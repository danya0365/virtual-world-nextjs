'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

const roundedStyles = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
  full: 'rounded-full',
};

export function GlassPanel({
  children,
  hover = true,
  glow = false,
  glowColor = 'hsl(var(--color-primary))',
  padding = 'md',
  rounded = 'xl',
  className,
  ...props
}: GlassPanelProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Hover animation
  const spring = useSpring({
    transform: hover && isHovered ? 'translateY(-4px)' : 'translateY(0px)',
    boxShadow: hover && isHovered
      ? '0 20px 40px rgba(100, 100, 200, 0.2)'
      : '0 8px 32px rgba(100, 100, 200, 0.1)',
    config: config.gentle,
  });

  // Glow animation
  const glowSpring = useSpring({
    opacity: glow && isHovered ? 0.4 : glow ? 0.2 : 0,
    config: { duration: 300 },
  });

  return (
    <animated.div
      style={spring}
      className={twMerge(
        'glass relative overflow-hidden',
        paddingStyles[padding],
        roundedStyles[rounded],
        hover && 'cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Glow effect */}
      {glow && (
        <animated.div
          style={{ 
            opacity: glowSpring.opacity,
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          }}
          className="absolute inset-0 -z-10 blur-xl"
          aria-hidden="true"
        />
      )}

      {/* Content */}
      {children}
    </animated.div>
  );
}
