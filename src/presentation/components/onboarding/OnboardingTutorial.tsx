'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ChevronLeft, ChevronRight, Gamepad2, Gift, Map, Sparkles, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  animation?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'ยินดีต้อนรับสู่ Virtual World! 🌍',
    description: 'โลกเสมือนจริงที่คุณสามารถสำรวจ พบเพื่อนใหม่ และสร้างความทรงจำ',
    icon: <Sparkles className="w-12 h-12" />,
    bgColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: 'สร้างตัวละครของคุณ',
    description: 'ปรับแต่ง Avatar ให้เป็นตัวคุณเอง เลือกเสื้อผ้า ทรงผม และอุปกรณ์ต่างๆ',
    icon: <Users className="w-12 h-12" />,
    bgColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: 'สำรวจโลกกว้าง',
    description: 'เดินทางไปยังสถานที่ต่างๆ พบสิ่งลับซ่อน และทำภารกิจ',
    icon: <Map className="w-12 h-12" />,
    bgColor: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    title: 'เล่นมินิเกม',
    description: 'ท้าทายตัวเองกับเกมสนุกๆ มากมาย รับรางวัลและอัพอันดับ',
    icon: <Gamepad2 className="w-12 h-12" />,
    bgColor: 'from-orange-500 to-red-500',
  },
  {
    id: 5,
    title: 'รับของขวัญรายวัน',
    description: 'อย่าลืมเข้ามาทุกวันเพื่อรับรางวัลพิเศษและ Lucky Spin!',
    icon: <Gift className="w-12 h-12" />,
    bgColor: 'from-yellow-500 to-orange-500',
  },
  {
    id: 6,
    title: 'พร้อมเริ่มต้นแล้ว! 🚀',
    description: 'ขอให้สนุกกับการผจญภัยใน Virtual World!',
    icon: <Trophy className="w-12 h-12" />,
    bgColor: 'from-purple-500 to-blue-500',
  },
];

interface OnboardingTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTutorial({ isOpen, onComplete, onSkip }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  });

  const modalSpring = useSpring({
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  });

  const step = ONBOARDING_STEPS[currentStep];

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onSkip]);

  if (!isOpen) return null;

  return (
    <animated.div 
      style={backdropSpring}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <animated.div 
        style={modalSpring}
        className="w-full max-w-md bg-[hsl(var(--color-background))] rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Skip Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onSkip}
            className="text-sm text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text-primary))] transition"
          >
            ข้าม
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Icon */}
          <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${step.bgColor} 
            flex items-center justify-center text-white shadow-lg animate-pulse`}>
            {step.icon}
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl font-bold text-center mb-3">{step.title}</h2>
          <p className="text-center text-[hsl(var(--color-text-secondary))] mb-8">
            {step.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentStep 
                    ? 'w-6 bg-gradient-to-r from-purple-500 to-pink-500' 
                    : index < currentStep 
                      ? 'bg-purple-500' 
                      : 'bg-[hsl(var(--color-surface))]'
                  }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex-1 py-3 rounded-xl glass font-medium flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                ย้อนกลับ
              </button>
            )}
            <button
              onClick={nextStep}
              className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${step.bgColor} text-white font-bold flex items-center justify-center gap-2`}
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>
                  เริ่มเลย!
                  <Sparkles className="w-5 h-5" />
                </>
              ) : (
                <>
                  ถัดไป
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    // Check localStorage for onboarding status
    const seen = localStorage.getItem('vw_onboarding_complete');
    if (!seen) {
      setHasSeenOnboarding(false);
      // Delay showing onboarding
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('vw_onboarding_complete', 'true');
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  const skipOnboarding = () => {
    localStorage.setItem('vw_onboarding_complete', 'true');
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('vw_onboarding_complete');
    setHasSeenOnboarding(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}
