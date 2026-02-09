import { ShopView } from '@/src/presentation/components/shop/ShopView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ร้านค้า | Virtual World',
  description: 'ซื้อไอเท็มและเครื่องประดับใน Virtual World',
};

export default function ShopPage() {
  return <ShopView />;
}
