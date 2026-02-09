'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'glass' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `bg-gradient-to-r from-purple-500 to-blue-500 text-white 
            shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50`,
  secondary: `bg-gradient-to-r from-blue-400 to-cyan-400 text-white 
              shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50`,
  accent: `bg-gradient-to-r from-pink-500 to-orange-400 text-white 
           shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50`,
  glass: `glass text-[hsl(var(--color-text-primary))]`,
  ghost: `bg-transparent text-[hsl(var(--color-text-primary))]
          hover:bg-[hsl(var(--color-primary)/0.1)]`,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-2.5 text-base rounded-xl gap-2',
  lg: 'px-8 py-3 text-lg rounded-2xl gap-2.5',
};

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Spring animation for scale
  const spring = useSpring({
    transform: isPressed 
      ? 'scale(0.95)' 
      : isHovered 
        ? 'scale(1.02)' 
        : 'scale(1)',
    config: config.wobbly,
  });

  // Glow animation
  const glowSpring = useSpring({
    opacity: isHovered ? 1 : 0,
    config: { duration: 200 },
  });

  const isDisabled = disabled || loading;

  return (
    <animated.button
      style={spring}
      className={twMerge(
        'relative inline-flex items-center justify-center font-semibold',
        'transition-colors duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !isDisabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={isDisabled}
      {...props}
    >
      {/* Glow effect */}
      {variant !== 'ghost' && variant !== 'glass' && (
        <animated.div
          style={glowSpring}
          className="absolute inset-0 rounded-inherit blur-md -z-10"
          aria-hidden="true"
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent 
                        rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <span className={twMerge(
        'flex items-center gap-2',
        loading && 'opacity-0'
      )}>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </animated.button>
  );
}
