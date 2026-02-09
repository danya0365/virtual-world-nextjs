'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import { ArrowLeft, RotateCcw, Star, Timer, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Card icons
const CARD_ICONS = ['🌸', '🐉', '⭐', '🔥', '💎', '🦋', '🌙', '⚡'];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // Animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  // Initialize game
  const initGame = useCallback(() => {
    const shuffledIcons = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledIcons);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setIsComplete(false);
    setTimeLeft(60);
    setIsPlaying(true);
    setScore(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    if (!isPlaying || isComplete || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isComplete, timeLeft]);

  // Check for match
  useEffect(() => {
    if (flippedCards.length !== 2) return;

    const [first, second] = flippedCards;
    const firstCard = cards[first];
    const secondCard = cards[second];

    if (firstCard.icon === secondCard.icon) {
      // Match found
      setCards((prev) =>
        prev.map((card) =>
          card.id === first || card.id === second
            ? { ...card, isMatched: true }
            : card
        )
      );
      setMatches((prev) => prev + 1);
      setScore((prev) => prev + 100 + timeLeft * 2);
      setFlippedCards([]);

      // Check for win
      if (matches + 1 === CARD_ICONS.length) {
        setIsComplete(true);
        setIsPlaying(false);
        setScore((prev) => prev + timeLeft * 10);
      }
    } else {
      // No match - flip back
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedCards([]);
      }, 1000);
    }

    setMoves((prev) => prev + 1);
  }, [flippedCards, cards, matches, timeLeft]);

  const handleCardClick = (index: number) => {
    if (!isPlaying) return;
    if (flippedCards.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedCards((prev) => [...prev, index]);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/games')}
            className="p-2 rounded-xl glass hover:bg-[hsl(var(--color-primary)/0.1)]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span>🧠</span>
              <span className="text-[hsl(var(--color-text-primary))]">จับคู่ความจำ</span>
            </h1>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              จับคู่การ์ดที่เหมือนกัน
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Timer */}
          <GlassPanel padding="sm" className={`flex items-center gap-2 ${timeLeft <= 10 ? 'animate-pulse bg-red-500/20' : ''}`}>
            <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500' : 'text-[hsl(var(--color-primary))]'}`} />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </GlassPanel>

          {/* Score */}
          <GlassPanel padding="sm" className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </GlassPanel>
        </div>
      </animated.div>

      {/* Stats */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <p className="text-sm text-[hsl(var(--color-text-muted))]">จับคู่</p>
          <p className="text-2xl font-bold text-[hsl(var(--color-primary))]">
            {matches}/{CARD_ICONS.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-[hsl(var(--color-text-muted))]">จำนวนครั้ง</p>
          <p className="text-2xl font-bold">{moves}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-3 max-w-md">
          {cards.map((card, index) => (
            <MemoryCard
              key={card.id}
              card={card}
              onClick={() => handleCardClick(index)}
              disabled={!isPlaying || flippedCards.length === 2}
            />
          ))}
        </div>
      </div>

      {/* Game Over Modal */}
      {(!isPlaying || isComplete) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <GlassPanel className="p-8 text-center max-w-sm w-full">
            {isComplete ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-[hsl(var(--color-text-primary))] mb-2">
                  ยินดีด้วย!
                </h2>
                <p className="text-[hsl(var(--color-text-secondary))] mb-4">
                  คุณจับคู่ครบในเวลา {60 - timeLeft} วินาที
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">⏰</div>
                <h2 className="text-2xl font-bold text-[hsl(var(--color-text-primary))] mb-2">
                  หมดเวลา!
                </h2>
                <p className="text-[hsl(var(--color-text-secondary))] mb-4">
                  จับคู่ได้ {matches} จาก {CARD_ICONS.length} คู่
                </p>
              </>
            )}

            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-3xl font-bold text-yellow-500">{score}</span>
              <span className="text-[hsl(var(--color-text-muted))]">คะแนน</span>
            </div>

            <div className="flex gap-3">
              <AnimatedButton
                variant="ghost"
                fullWidth
                onClick={() => router.push('/games')}
              >
                กลับ
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                fullWidth
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={initGame}
              >
                เล่นอีก
              </AnimatedButton>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}

interface MemoryCardProps {
  card: Card;
  onClick: () => void;
  disabled: boolean;
}

function MemoryCard({ card, onClick, disabled }: MemoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: card.isFlipped || card.isMatched
      ? 'rotateY(180deg)'
      : isHovered && !disabled
        ? 'rotateY(10deg) scale(1.05)'
        : 'rotateY(0deg)',
    config: config.gentle,
  });

  return (
    <div
      className="relative w-20 h-20 cursor-pointer perspective-1000"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <animated.div
        style={spring}
        className="w-full h-full preserve-3d"
      >
        {/* Back of card */}
        <div
          className={`absolute inset-0 rounded-xl backface-hidden
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg
            flex items-center justify-center text-3xl text-white/50`}
        >
          ❓
        </div>

        {/* Front of card */}
        <div
          className={`absolute inset-0 rounded-xl backface-hidden rotateY-180
            ${card.isMatched ? 'bg-green-500/30 ring-2 ring-green-500' : 'glass'}
            flex items-center justify-center text-4xl shadow-lg`}
        >
          {card.icon}
        </div>
      </animated.div>
    </div>
  );
}
