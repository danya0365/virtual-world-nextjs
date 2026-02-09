'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface ColorPickerProps {
  colors: Array<{ id: string; color: string; name: string }>;
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function ColorPicker({
  colors,
  selectedId,
  onSelect,
  className,
}: ColorPickerProps) {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      {colors.map((item) => (
        <ColorDot
          key={item.id}
          color={item.color}
          name={item.name}
          isSelected={selectedId === item.id}
          onClick={() => onSelect?.(item.id)}
        />
      ))}
    </div>
  );
}

interface ColorDotProps {
  color: string;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
}

function ColorDot({ color, name, isSelected, onClick }: ColorDotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: isHovered ? 'scale(1.2)' : isSelected ? 'scale(1.1)' : 'scale(1)',
    boxShadow: isSelected
      ? `0 0 20px ${color}80`
      : isHovered
        ? `0 0 15px ${color}60`
        : `0 4px 10px ${color}40`,
    config: config.wobbly,
  });

  return (
    <animated.button
      style={spring}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={twMerge(
        'w-8 h-8 rounded-full border-2 transition-colors duration-200 cursor-pointer',
        isSelected 
          ? 'border-white' 
          : 'border-transparent hover:border-white/50'
      )}
      aria-label={name}
      title={name}
    >
      <div
        className="w-full h-full rounded-full"
        style={{ background: color }}
      />
    </animated.button>
  );
}
