'use client';

/**
 * Currency Display - Shows currency with icon and animated value
 */

import { CURRENCIES, CurrencyType, formatCurrency } from '@/src/domain/entities/Currency';
import { useWalletStore } from '@/src/stores/walletStore';
import { animated, useSpring } from '@react-spring/web';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CurrencyDisplayProps {
  currency: CurrencyType;
  showAdd?: boolean;
  onAdd?: () => void;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export function CurrencyDisplay({ 
  currency, 
  showAdd = false, 
  onAdd,
  size = 'md',
  compact = false,
}: CurrencyDisplayProps) {
  const balance = useWalletStore((state) => state.wallet[currency]);
  const currencyInfo = CURRENCIES[currency];
  const [prevBalance, setPrevBalance] = useState(balance);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate when balance changes
  useEffect(() => {
    if (balance !== prevBalance) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevBalance(balance);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [balance, prevBalance]);

  const countSpring = useSpring({
    number: balance,
    from: { number: prevBalance },
    config: { tension: 200, friction: 20 },
  });

  const pulseSpring = useSpring({
    scale: isAnimating ? 1.1 : 1,
    config: { tension: 300, friction: 10 },
  });

  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1.5',
    lg: 'text-base gap-2',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <animated.div 
      style={{ scale: pulseSpring.scale }}
      className={`flex items-center ${sizeClasses[size]} 
                 px-3 py-1.5 rounded-full glass-subtle
                 ${isAnimating ? 'ring-2 ring-offset-1' : ''}`}
      style={{
        ...pulseSpring,
        // @ts-expect-error - ring color
        '--tw-ring-color': currencyInfo.color,
      }}
    >
      {/* Icon */}
      <span className={iconSizes[size]}>{currencyInfo.icon}</span>

      {/* Value */}
      <animated.span 
        className="font-bold tabular-nums"
        style={{ color: currencyInfo.color }}
      >
        {countSpring.number.to((n) => 
          compact ? formatCurrency(Math.floor(n), true) : formatCurrency(Math.floor(n))
        )}
      </animated.span>

      {/* Add button */}
      {showAdd && (
        <button
          onClick={onAdd}
          className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center
                     bg-gradient-to-r ${currencyInfo.gradient} text-white
                     hover:scale-110 active:scale-95 transition-transform`}
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </animated.div>
  );
}

// Compact inline version
interface CurrencyInlineProps {
  currency: CurrencyType;
  amount?: number;
  size?: 'xs' | 'sm' | 'md';
}

export function CurrencyInline({ currency, amount, size = 'sm' }: CurrencyInlineProps) {
  const balance = useWalletStore((state) => state.wallet[currency]);
  const displayAmount = amount ?? balance;
  const currencyInfo = CURRENCIES[currency];

  const sizeClasses = {
    xs: 'text-xs gap-0.5',
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]}`}>
      <span>{currencyInfo.icon}</span>
      <span className="font-semibold" style={{ color: currencyInfo.color }}>
        {formatCurrency(displayAmount, true)}
      </span>
    </span>
  );
}

// Full wallet display
interface WalletDisplayProps {
  currencies?: CurrencyType[];
  onAddClick?: (currency: CurrencyType) => void;
}

export function WalletDisplay({ 
  currencies = ['gems', 'coins', 'tickets'],
  onAddClick,
}: WalletDisplayProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {currencies.map((currency) => (
        <CurrencyDisplay
          key={currency}
          currency={currency}
          size="sm"
          compact
          showAdd={CURRENCIES[currency].isPremium}
          onAdd={() => onAddClick?.(currency)}
        />
      ))}
    </div>
  );
}

export default CurrencyDisplay;
