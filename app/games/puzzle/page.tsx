'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ArrowLeft, Clock, RotateCcw, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

// Puzzle pieces configuration
const PUZZLE_IMAGES = [
  { id: 1, name: 'ปราสาทมังกร', emoji: '🏰', color: 'from-purple-500 to-pink-500' },
  { id: 2, name: 'ป่าลึก', emoji: '🌲', color: 'from-green-500 to-emerald-500' },
  { id: 3, name: 'มหาสมุทร', emoji: '🌊', color: 'from-blue-500 to-cyan-500' },
  { id: 4, name: 'ภูเขาไฟ', emoji: '🌋', color: 'from-orange-500 to-red-500' },
];

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'ง่าย', grid: 3, timeBonus: 100 },
  { id: 'medium', name: 'ปานกลาง', grid: 4, timeBonus: 200 },
  { id: 'hard', name: 'ยาก', grid: 5, timeBonus: 300 },
];

interface PuzzlePiece {
  id: number;
  currentPos: number;
  correctPos: number;
}

export default function PuzzleGamePage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'won'>('menu');
  const [selectedImage, setSelectedImage] = useState(PUZZLE_IMAGES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS[0]);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const gridSize = difficulty.grid;
  const totalPieces = gridSize * gridSize;

  // Initialize puzzle
  const initializePuzzle = useCallback(() => {
    const newPieces: PuzzlePiece[] = [];
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({ id: i, currentPos: i, correctPos: i });
    }
    
    // Shuffle pieces (Fisher-Yates)
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentPos, newPieces[j].currentPos] = [newPieces[j].currentPos, newPieces[i].currentPos];
    }
    
    setPieces(newPieces);
    setMoves(0);
    setTime(0);
    setGameState('playing');
    setSelectedPiece(null);
  }, [totalPieces]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Check win condition
  useEffect(() => {
    if (gameState === 'playing' && pieces.length > 0) {
      const isWon = pieces.every(p => p.currentPos === p.correctPos);
      if (isWon) {
        const timeBonus = Math.max(0, difficulty.timeBonus - time);
        const moveBonus = Math.max(0, 500 - moves * 5);
        setScore(1000 + timeBonus + moveBonus);
        setGameState('won');
      }
    }
  }, [pieces, gameState, time, moves, difficulty.timeBonus]);

  // Handle piece click
  const handlePieceClick = (pieceId: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else {
      // Swap pieces
      setPieces(prev => prev.map(p => {
        if (p.id === selectedPiece) {
          const targetPiece = prev.find(pp => pp.id === pieceId);
          return { ...p, currentPos: targetPiece!.currentPos };
        }
        if (p.id === pieceId) {
          const sourcePiece = prev.find(pp => pp.id === selectedPiece);
          return { ...p, currentPos: sourcePiece!.currentPos };
        }
        return p;
      }));
      setMoves(m => m + 1);
      setSelectedPiece(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Sort pieces by current position for rendering
  const sortedPieces = [...pieces].sort((a, b) => a.currentPos - b.currentPos);

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring}>
        <div className="flex items-center gap-4">
          <Link href="/games" className="p-2 glass rounded-xl hover:bg-[hsl(var(--color-surface))] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
              🧩 Puzzle Game
            </h1>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              เรียงภาพให้ถูกต้อง!
            </p>
          </div>
        </div>
      </animated.div>

      {/* Menu State */}
      {gameState === 'menu' && (
        <div className="space-y-6">
          {/* Select Image */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4">เลือกภาพ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PUZZLE_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`p-6 rounded-2xl text-center transition-all
                    ${selectedImage.id === img.id 
                      ? `bg-gradient-to-br ${img.color} text-white ring-4 ring-yellow-400` 
                      : 'bg-[hsl(var(--color-surface))] hover:scale-105'
                    }`}
                >
                  <div className="text-4xl mb-2">{img.emoji}</div>
                  <div className="text-sm font-medium">{img.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Difficulty */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4">เลือกความยาก</h3>
            <div className="grid grid-cols-3 gap-4">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setDifficulty(level)}
                  className={`p-4 rounded-2xl text-center transition-all
                    ${difficulty.id === level.id 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                      : 'bg-[hsl(var(--color-surface))] hover:scale-105'
                    }`}
                >
                  <div className="text-lg font-bold">{level.grid}x{level.grid}</div>
                  <div className="text-sm">{level.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={initializePuzzle}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-6 h-6" />
            เริ่มเกม!
          </button>
        </div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-2xl p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="font-bold">{formatTime(time)}</div>
            </div>
            <div className="glass rounded-2xl p-3 text-center">
              <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="font-bold">{moves} ครั้ง</div>
            </div>
            <button
              onClick={initializePuzzle}
              className="glass rounded-2xl p-3 text-center hover:bg-[hsl(var(--color-surface))] transition"
            >
              <RotateCcw className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <div className="text-sm font-medium">เริ่มใหม่</div>
            </button>
          </div>

          {/* Puzzle Grid */}
          <div className="glass rounded-3xl p-4">
            <div 
              className="grid gap-1 aspect-square"
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {sortedPieces.map((piece) => {
                const isSelected = selectedPiece === piece.id;
                const isCorrect = piece.currentPos === piece.correctPos;
                const row = Math.floor(piece.correctPos / gridSize);
                const col = piece.correctPos % gridSize;
                
                return (
                  <button
                    key={piece.id}
                    onClick={() => handlePieceClick(piece.id)}
                    className={`aspect-square rounded-xl transition-all flex items-center justify-center text-white font-bold
                      bg-gradient-to-br ${selectedImage.color}
                      ${isSelected ? 'ring-4 ring-yellow-400 scale-95' : 'hover:scale-95'}
                      ${isCorrect ? 'opacity-100' : 'opacity-80'}
                    `}
                    style={{
                      backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                    }}
                  >
                    <span className="text-2xl drop-shadow-lg">{selectedImage.emoji}</span>
                    <span className="absolute bottom-1 right-1 text-xs opacity-50">{piece.correctPos + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-center text-sm text-[hsl(var(--color-text-muted))]">
            แตะ 2 ชิ้นเพื่อสลับตำแหน่ง
          </p>
        </div>
      )}

      {/* Won State */}
      {gameState === 'won' && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">ยอดเยี่ยม!</h2>
          <p className="text-[hsl(var(--color-text-secondary))] mb-6">
            คุณเรียงภาพสำเร็จ!
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[hsl(var(--color-surface))] rounded-2xl">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="font-bold">{formatTime(time)}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">เวลา</div>
            </div>
            <div className="p-4 bg-[hsl(var(--color-surface))] rounded-2xl">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <div className="font-bold">{moves}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">ครั้งสลับ</div>
            </div>
            <div className="p-4 bg-[hsl(var(--color-surface))] rounded-2xl">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="font-bold">{score}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">คะแนน</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={initializePuzzle}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
            >
              เล่นอีกครั้ง
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 py-3 rounded-xl glass font-medium"
            >
              เปลี่ยนภาพ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
