'use client';

/**
 * Currency Bar - Header component showing player's currencies
 */

import { CurrencyType } from '@/src/domain/entities/Currency';
import { useState } from 'react';
import { CurrencyDisplay } from './CurrencyDisplay';
import { CurrencyShop } from './CurrencyShop';

interface CurrencyBarProps {
  currencies?: CurrencyType[];
}

export function CurrencyBar({ currencies = ['gems', 'coins'] }: CurrencyBarProps) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopCurrency, setShopCurrency] = useState<CurrencyType>('gems');

  const handleAddClick = (currency: CurrencyType) => {
    setShopCurrency(currency);
    setIsShopOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {currencies.map((currency) => (
          <CurrencyDisplay
            key={currency}
            currency={currency}
            size="sm"
            compact
            showAdd={currency === 'gems' || currency === 'tickets'}
            onAdd={() => handleAddClick(currency)}
          />
        ))}
      </div>

      <CurrencyShop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        initialCurrency={shopCurrency}
      />
    </>
  );
}

export default CurrencyBar;
