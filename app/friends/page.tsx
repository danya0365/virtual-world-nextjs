import { FriendsView } from '@/src/presentation/components/friends/FriendsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เพื่อน | Virtual World',
  description: 'ดูและจัดการเพื่อนของคุณใน Virtual World',
};

export default function FriendsPage() {
  return <FriendsView />;
}
