'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { GripVertical, X } from 'lucide-react';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface FloatingPanelProps {
  children: ReactNode;
  title?: string;
  initialPosition?: { x: number; y: number };
  draggable?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function FloatingPanel({
  children,
  title,
  initialPosition = { x: 20, y: 20 },
  draggable = true,
  closable = true,
  onClose,
  className,
  style,
}: FloatingPanelProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Entry animation
  const entrySpring = useSpring({
    from: { opacity: 0, scale: 0.9, y: 20 },
    to: isVisible 
      ? { opacity: 1, scale: 1, y: 0 }
      : { opacity: 0, scale: 0.9, y: 20 },
    config: config.wobbly,
    onRest: () => {
      if (!isVisible && onClose) {
        onClose();
      }
    },
  });

  // Drag animation
  const dragSpring = useSpring({
    boxShadow: isDragging
      ? '0 30px 60px rgba(100, 100, 200, 0.3)'
      : '0 15px 40px rgba(100, 100, 200, 0.15)',
    config: config.gentle,
  });

  // Simple position without gesture library for now
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;
    
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible && !onClose) return null;

  return (
    <animated.div
      style={{
        ...entrySpring,
        ...dragSpring,
        left: position.x,
        top: position.y,
        ...style,
      }}
      className={twMerge(
        'fixed z-50 glass rounded-2xl overflow-hidden',
        'min-w-[200px] max-w-[400px]',
        isDragging && 'cursor-grabbing',
        className
      )}
    >
      {/* Header */}
      {(title || draggable || closable) && (
        <div 
          className={twMerge(
            'flex items-center justify-between px-4 py-3',
            'border-b border-[hsl(var(--color-primary)/0.1)]',
            'bg-gradient-to-r from-purple-500/10 to-blue-500/10',
            draggable && 'cursor-grab'
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            {draggable && (
              <GripVertical className="w-4 h-4 text-[hsl(var(--color-text-muted))]" />
            )}
            {title && (
              <h3 className="font-semibold text-[hsl(var(--color-text-primary))]">
                {title}
              </h3>
            )}
          </div>

          {closable && (
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-[hsl(var(--color-primary)/0.1)] 
                       transition-colors duration-200"
              aria-label="ปิด"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </animated.div>
  );
}
