import { CharacterCreateView } from '@/src/presentation/components/character/CharacterCreateView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'สร้างตัวละคร | Virtual World',
  description: 'สร้างตัวละครใหม่ใน Virtual World - ปรับแต่งหน้าตาและเครื่องประดับ',
};

export default function CharacterCreatePage() {
  return <CharacterCreateView />;
}
