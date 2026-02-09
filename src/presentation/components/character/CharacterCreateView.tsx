'use client';

import { ACCESSORIES, CHARACTER_COLORS, EYE_STYLES } from '@/src/infrastructure/repositories/mock/MockCharacterRepository';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { animated, config, useSpring } from '@react-spring/web';
import {
    ArrowLeft,
    Check, Palette,
    Sparkles,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CharacterCreateView() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [characterName, setCharacterName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedEye, setSelectedEye] = useState('normal');
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);

  // Page animation
  const pageSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    // In real app, this would save to backend
    alert(`สร้างตัวละคร ${displayName} สำเร็จ!`);
    router.push('/character');
  };

  const isStepValid = () => {
    if (step === 1) return characterName.length >= 3 && displayName.length >= 2;
    return true;
  };

  return (
    <animated.div style={pageSpring} className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/character">
          <button className="p-3 rounded-xl glass hover:bg-[hsl(var(--color-primary)/0.1)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--color-text-primary))]">
            {step === 1 ? 'ตั้งชื่อตัวละคร' : step === 2 ? 'เลือกหน้าตา' : 'เลือกเครื่องประดับ'}
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            ขั้นตอนที่ {step} จาก 3
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-[hsl(var(--color-surface))] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Preview */}
        <AnimatedCard variant="gradient" className="h-[400px] p-6">
          <div className="h-full flex flex-col items-center justify-center">
            <CharacterPreview 
              color={selectedColor}
              eyeStyle={selectedEye}
              accessory={selectedAccessory}
            />
            {displayName && (
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-[hsl(var(--color-text-primary))]">
                  {displayName}
                </h3>
                <p className="text-sm text-[hsl(var(--color-text-muted))]">@{characterName || '...'}</p>
              </div>
            )}
          </div>
        </AnimatedCard>

        {/* Step Content */}
        <AnimatedCard variant="glass" className="p-6">
          {step === 1 && (
            <Step1 
              characterName={characterName}
              setCharacterName={setCharacterName}
              displayName={displayName}
              setDisplayName={setDisplayName}
            />
          )}
          {step === 2 && (
            <Step2 
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedEye={selectedEye}
              setSelectedEye={setSelectedEye}
            />
          )}
          {step === 3 && (
            <Step3 
              selectedAccessory={selectedAccessory}
              setSelectedAccessory={setSelectedAccessory}
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-[hsl(var(--color-primary)/0.1)]">
            {step > 1 && (
              <AnimatedButton variant="ghost" size="lg" onClick={handleBack} fullWidth>
                ย้อนกลับ
              </AnimatedButton>
            )}
            {step < 3 ? (
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                onClick={handleNext}
                disabled={!isStepValid()}
                fullWidth
              >
                ถัดไป
              </AnimatedButton>
            ) : (
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                onClick={handleCreate}
                icon={<Sparkles className="w-5 h-5" />}
                fullWidth
              >
                สร้างตัวละคร!
              </AnimatedButton>
            )}
          </div>
        </AnimatedCard>
      </div>
    </animated.div>
  );
}

interface CharacterPreviewProps {
  color: string;
  eyeStyle: string;
  accessory: string | null;
}

function CharacterPreview({ color, eyeStyle, accessory }: CharacterPreviewProps) {
  const colorValue = CHARACTER_COLORS.find(c => c.id === color)?.color || '#e8e8f0';
  const accessoryIcon = ACCESSORIES.find(a => a.id === accessory)?.icon;

  const getEyeStyle = () => {
    switch (eyeStyle) {
      case 'happy': return { left: '•◡', right: '◡•' };
      case 'cool': return { left: '−', right: '−' };
      case 'sleepy': return { left: '−', right: '−' };
      default: return { left: '●', right: '●' };
    }
  };

  return (
    <div className="relative w-48 h-56" style={{ filter: 'drop-shadow(0 20px 40px rgba(100, 100, 200, 0.3))' }}>
      {/* Accessory on top */}
      {accessoryIcon && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl z-10">
          {accessoryIcon}
        </div>
      )}

      {/* Head */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 rounded-3xl shadow-lg"
        style={{ background: colorValue }}
      >
        {/* Eyes based on style */}
        {eyeStyle === 'happy' ? (
          <>
            <div className="absolute top-12 left-5 text-lg">◠</div>
            <div className="absolute top-12 right-5 text-lg">◠</div>
          </>
        ) : eyeStyle === 'cool' ? (
          <>
            <div className="absolute top-12 left-5 w-4 h-3 bg-gray-800 rounded-sm transform -rotate-6" />
            <div className="absolute top-12 right-5 w-4 h-3 bg-gray-800 rounded-sm transform rotate-6" />
          </>
        ) : eyeStyle === 'sleepy' ? (
          <>
            <div className="absolute top-13 left-6 w-3 h-0.5 bg-gray-800 rounded-full" />
            <div className="absolute top-13 right-6 w-3 h-0.5 bg-gray-800 rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute top-12 left-6 w-3 h-3 rounded-full bg-gray-800" />
            <div className="absolute top-12 right-6 w-3 h-3 rounded-full bg-gray-800" />
          </>
        )}

        {/* Mouth */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-gray-600" />
      </div>

      {/* Body */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-24 h-28 rounded-3xl shadow-lg" style={{ background: colorValue }} />
      
      {/* Arms */}
      <div className="absolute top-28 left-2 w-4 h-16 rounded-full shadow-md" style={{ background: colorValue }} />
      <div className="absolute top-28 right-2 w-4 h-16 rounded-full shadow-md" style={{ background: colorValue }} />

      {/* Legs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-[130%] w-6 h-12 rounded-xl shadow-md" style={{ background: colorValue }} />
      <div className="absolute bottom-0 left-1/2 translate-x-[30%] w-6 h-12 rounded-xl shadow-md" style={{ background: colorValue }} />

      {/* Sparkles */}
      <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-bounce-soft" />
    </div>
  );
}

interface Step1Props {
  characterName: string;
  setCharacterName: (v: string) => void;
  displayName: string;
  setDisplayName: (v: string) => void;
}

function Step1({ characterName, setCharacterName, displayName, setDisplayName }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[hsl(var(--color-text-secondary))] mb-2">
          ชื่อผู้ใช้ (ภาษาอังกฤษ)
        </label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          placeholder="my_character"
          className="w-full px-4 py-3 rounded-xl glass border-none outline-none
                   text-[hsl(var(--color-text-primary))] placeholder:text-[hsl(var(--color-text-muted))]
                   focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
        />
        <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
          ตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และ _ เท่านั้น (อย่างน้อย 3 ตัว)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[hsl(var(--color-text-secondary))] mb-2">
          ชื่อแสดง
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="ชื่อที่จะแสดงในเกม"
          className="w-full px-4 py-3 rounded-xl glass border-none outline-none
                   text-[hsl(var(--color-text-primary))] placeholder:text-[hsl(var(--color-text-muted))]
                   focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
        />
        <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
          ชื่อที่เพื่อนจะเห็น (อย่างน้อย 2 ตัว)
        </p>
      </div>
    </div>
  );
}

interface Step2Props {
  selectedColor: string;
  setSelectedColor: (v: string) => void;
  selectedEye: string;
  setSelectedEye: (v: string) => void;
}

function Step2({ selectedColor, setSelectedColor, selectedEye, setSelectedEye }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[hsl(var(--color-text-secondary))] mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          สีตัวละคร
        </label>
        <div className="flex flex-wrap gap-3">
          {CHARACTER_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center
                ${selectedColor === color.id 
                  ? 'border-[hsl(var(--color-primary))] scale-110 shadow-lg' 
                  : 'border-transparent hover:scale-105'
                }`}
              style={{ background: color.color }}
              title={color.name}
            >
              {selectedColor === color.id && <Check className="w-5 h-5 text-gray-600" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[hsl(var(--color-text-secondary))] mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          สไตล์ตา
        </label>
        <div className="grid grid-cols-2 gap-3">
          {EYE_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedEye(style.id)}
              className={`p-4 rounded-xl glass transition-all duration-200 flex items-center gap-3
                ${selectedEye === style.id 
                  ? 'ring-2 ring-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)]' 
                  : 'hover:bg-[hsl(var(--color-primary)/0.05)]'
                }`}
            >
              <span className="text-2xl">{style.preview}</span>
              <span className="text-sm font-medium">{style.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Step3Props {
  selectedAccessory: string | null;
  setSelectedAccessory: (v: string | null) => void;
}

function Step3({ selectedAccessory, setSelectedAccessory }: Step3Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-[hsl(var(--color-text-secondary))] mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        เครื่องประดับ (เลือกได้ 1 ชิ้น)
      </label>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedAccessory(null)}
          className={`p-4 rounded-xl glass transition-all duration-200 flex flex-col items-center gap-2
            ${selectedAccessory === null 
              ? 'ring-2 ring-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)]' 
              : 'hover:bg-[hsl(var(--color-primary)/0.05)]'
            }`}
        >
          <span className="text-2xl">❌</span>
          <span className="text-xs">ไม่ใส่</span>
        </button>
        {ACCESSORIES.map((acc) => (
          <button
            key={acc.id}
            onClick={() => setSelectedAccessory(acc.id)}
            className={`p-4 rounded-xl glass transition-all duration-200 flex flex-col items-center gap-2
              ${selectedAccessory === acc.id 
                ? 'ring-2 ring-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)]' 
                : 'hover:bg-[hsl(var(--color-primary)/0.05)]'
              }`}
          >
            <span className="text-2xl">{acc.icon}</span>
            <span className="text-xs">{acc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
