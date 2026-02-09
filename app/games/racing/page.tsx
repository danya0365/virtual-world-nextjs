'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, Flag, RotateCcw, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  { id: 1, name: 'Speed Circuit', emoji: '🏎️', color: 'from-red-500 to-orange-500', laps: 3 },
  { id: 2, name: 'Mountain Pass', emoji: '🏔️', color: 'from-blue-500 to-cyan-500', laps: 2 },
  { id: 3, name: 'Night City', emoji: '🌃', color: 'from-purple-500 to-pink-500', laps: 3 },
];

const CARS = [
  { id: 1, emoji: '🏎️', name: 'F1 Car', speed: 10, handling: 8 },
  { id: 2, emoji: '🚗', name: 'Sports Car', speed: 8, handling: 9 },
  { id: 3, emoji: '🚙', name: 'SUV', speed: 6, handling: 7 },
  { id: 4, emoji: '🏍️', name: 'Motorcycle', speed: 9, handling: 10 },
];

const TRACK_WIDTH = 600;
const TRACK_HEIGHT = 400;
const CAR_SIZE = 30;

interface Position {
  x: number;
  y: number;
  angle: number;
}

export default function RacingGamePage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const [selectedCar, setSelectedCar] = useState(CARS[0]);
  const [position, setPosition] = useState<Position>({ x: 300, y: 350, angle: -90 });
  const [speed, setSpeed] = useState(0);
  const [lap, setLap] = useState(1);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [checkpoints, setCheckpoints] = useState<boolean[]>([false, false, false, false]);
  
  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>();

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setTime(t => t + 100), 100);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const maxSpeed = selectedCar.speed;
    const handling = selectedCar.handling / 10;

    const gameLoop = () => {
      setPosition(prev => {
        let newSpeed = speed;
        let newAngle = prev.angle;

        // Acceleration
        if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w')) {
          newSpeed = Math.min(speed + 0.5, maxSpeed);
        } else if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s')) {
          newSpeed = Math.max(speed - 0.3, -maxSpeed / 2);
        } else {
          newSpeed = speed * 0.98; // Friction
        }

        // Steering
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
          newAngle = prev.angle - 3 * handling * (Math.abs(speed) / maxSpeed + 0.1);
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
          newAngle = prev.angle + 3 * handling * (Math.abs(speed) / maxSpeed + 0.1);
        }

        // Movement
        const radians = (newAngle * Math.PI) / 180;
        let newX = prev.x + Math.cos(radians) * newSpeed;
        let newY = prev.y + Math.sin(radians) * newSpeed;

        // Track boundaries (oval track)
        const centerX = TRACK_WIDTH / 2;
        const centerY = TRACK_HEIGHT / 2;
        const outerRadiusX = TRACK_WIDTH / 2 - 20;
        const outerRadiusY = TRACK_HEIGHT / 2 - 20;
        const innerRadiusX = TRACK_WIDTH / 4;
        const innerRadiusY = TRACK_HEIGHT / 4;

        const normalizedX = (newX - centerX) / outerRadiusX;
        const normalizedY = (newY - centerY) / outerRadiusY;
        const distFromCenter = Math.sqrt(normalizedX ** 2 + normalizedY ** 2);

        // Keep on track
        if (distFromCenter > 1) {
          newX = centerX + (normalizedX / distFromCenter) * outerRadiusX;
          newY = centerY + (normalizedY / distFromCenter) * outerRadiusY;
          newSpeed *= 0.5;
        }

        setSpeed(newSpeed);
        return { x: newX, y: newY, angle: newAngle };
      });

      // Check checkpoints
      const checkpointPositions = [
        { x: TRACK_WIDTH / 2, y: 50 },      // Top
        { x: TRACK_WIDTH - 50, y: TRACK_HEIGHT / 2 }, // Right
        { x: TRACK_WIDTH / 2, y: TRACK_HEIGHT - 50 }, // Bottom
        { x: 50, y: TRACK_HEIGHT / 2 },     // Left
      ];

      setCheckpoints(prev => {
        const newCheckpoints = [...prev];
        checkpointPositions.forEach((cp, i) => {
          const dist = Math.sqrt((position.x - cp.x) ** 2 + (position.y - cp.y) ** 2);
          if (dist < 40 && (i === 0 || prev[i - 1])) {
            newCheckpoints[i] = true;
          }
        });

        // Check lap completion (pass start after all checkpoints)
        if (newCheckpoints.every(c => c) && position.y > TRACK_HEIGHT - 80 && position.y < TRACK_HEIGHT - 20) {
          if (lap >= selectedTrack.laps) {
            setGameState('finished');
            if (!bestTime || time < bestTime) {
              setBestTime(time);
            }
          } else {
            setLap(l => l + 1);
            return [false, false, false, false];
          }
        }
        return newCheckpoints;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, speed, selectedCar, selectedTrack.laps, lap, position, time, bestTime]);

  const startGame = () => {
    setPosition({ x: TRACK_WIDTH / 2, y: TRACK_HEIGHT - 60, angle: -90 });
    setSpeed(0);
    setLap(1);
    setTime(0);
    setCheckpoints([false, false, false, false]);
    setGameState('playing');
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const decimals = Math.floor((ms % 1000) / 100);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}.${decimals}`;
  };

  // Touch controls for mobile
  const handleControl = (direction: 'up' | 'down' | 'left' | 'right', isPressed: boolean) => {
    const keyMap = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    if (isPressed) {
      keysPressed.current.add(keyMap[direction]);
    } else {
      keysPressed.current.delete(keyMap[direction]);
    }
  };

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
              🏎️ Racing Game
            </h1>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              แข่งรถสุดมันส์!
            </p>
          </div>
        </div>
      </animated.div>

      {/* Menu State */}
      {gameState === 'menu' && (
        <div className="space-y-6">
          {/* Select Track */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4">เลือกสนาม</h3>
            <div className="grid grid-cols-3 gap-4">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
                  className={`p-4 rounded-2xl text-center transition-all
                    ${selectedTrack.id === track.id 
                      ? `bg-gradient-to-br ${track.color} text-white ring-4 ring-yellow-400` 
                      : 'bg-[hsl(var(--color-surface))] hover:scale-105'
                    }`}
                >
                  <div className="text-3xl mb-2">{track.emoji}</div>
                  <div className="text-sm font-medium">{track.name}</div>
                  <div className="text-xs opacity-80">{track.laps} รอบ</div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Car */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4">เลือกรถ</h3>
            <div className="grid grid-cols-4 gap-4">
              {CARS.map((car) => (
                <button
                  key={car.id}
                  onClick={() => setSelectedCar(car)}
                  className={`p-4 rounded-2xl text-center transition-all
                    ${selectedCar.id === car.id 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white ring-4 ring-yellow-400' 
                      : 'bg-[hsl(var(--color-surface))] hover:scale-105'
                    }`}
                >
                  <div className="text-3xl mb-2">{car.emoji}</div>
                  <div className="text-xs font-medium">{car.name}</div>
                  <div className="text-xs opacity-80 mt-1">
                    ⚡{car.speed} 🎮{car.handling}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Flag className="w-6 h-6" />
            เริ่มแข่ง!
          </button>

          {bestTime && (
            <div className="text-center text-[hsl(var(--color-text-muted))]">
              🏆 เวลาที่ดีที่สุด: {formatTime(bestTime)}
            </div>
          )}
        </div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="glass rounded-xl p-2 text-center">
              <Clock className="w-4 h-4 mx-auto text-blue-500" />
              <div className="text-sm font-bold">{formatTime(time)}</div>
            </div>
            <div className="glass rounded-xl p-2 text-center">
              <Flag className="w-4 h-4 mx-auto text-green-500" />
              <div className="text-sm font-bold">{lap}/{selectedTrack.laps}</div>
            </div>
            <div className="glass rounded-xl p-2 text-center">
              <Zap className="w-4 h-4 mx-auto text-yellow-500" />
              <div className="text-sm font-bold">{Math.abs(Math.round(speed * 10))} km/h</div>
            </div>
            <button
              onClick={() => setGameState('menu')}
              className="glass rounded-xl p-2 text-center hover:bg-[hsl(var(--color-surface))]"
            >
              <RotateCcw className="w-4 h-4 mx-auto text-red-500" />
              <div className="text-xs">หยุด</div>
            </button>
          </div>

          {/* Track View */}
          <div className="glass rounded-3xl p-4 overflow-hidden">
            <div 
              className={`relative bg-gradient-to-br ${selectedTrack.color} rounded-2xl mx-auto`}
              style={{ width: '100%', maxWidth: TRACK_WIDTH, aspectRatio: `${TRACK_WIDTH}/${TRACK_HEIGHT}` }}
            >
              {/* Track markings */}
              <div className="absolute inset-8 border-4 border-white/30 rounded-full" />
              <div className="absolute inset-16 sm:inset-24 border-4 border-white/30 rounded-full" />
              
              {/* Start/Finish line */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/50 rounded" />
              
              {/* Checkpoints */}
              {[0, 1, 2, 3].map(i => (
                <div 
                  key={i}
                  className={`absolute w-4 h-4 rounded-full transition-all
                    ${checkpoints[i] ? 'bg-green-400 scale-125' : 'bg-white/30'}`}
                  style={{
                    top: i === 0 ? '8%' : i === 2 ? '88%' : '48%',
                    left: i === 1 ? '92%' : i === 3 ? '4%' : '48%',
                  }}
                />
              ))}

              {/* Car */}
              <div
                className="absolute transition-transform"
                style={{
                  left: `${(position.x / TRACK_WIDTH) * 100}%`,
                  top: `${(position.y / TRACK_HEIGHT) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${position.angle + 90}deg)`,
                }}
              >
                <span className="text-3xl drop-shadow-lg">{selectedCar.emoji}</span>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div />
            <button
              className="p-4 glass rounded-xl active:bg-purple-500/30"
              onTouchStart={() => handleControl('up', true)}
              onTouchEnd={() => handleControl('up', false)}
              onMouseDown={() => handleControl('up', true)}
              onMouseUp={() => handleControl('up', false)}
            >
              <ChevronUp className="w-6 h-6 mx-auto" />
            </button>
            <div />
            <button
              className="p-4 glass rounded-xl active:bg-purple-500/30"
              onTouchStart={() => handleControl('left', true)}
              onTouchEnd={() => handleControl('left', false)}
              onMouseDown={() => handleControl('left', true)}
              onMouseUp={() => handleControl('left', false)}
            >
              <ChevronLeft className="w-6 h-6 mx-auto" />
            </button>
            <button
              className="p-4 glass rounded-xl active:bg-purple-500/30"
              onTouchStart={() => handleControl('down', true)}
              onTouchEnd={() => handleControl('down', false)}
              onMouseDown={() => handleControl('down', true)}
              onMouseUp={() => handleControl('down', false)}
            >
              <ChevronDown className="w-6 h-6 mx-auto" />
            </button>
            <button
              className="p-4 glass rounded-xl active:bg-purple-500/30"
              onTouchStart={() => handleControl('right', true)}
              onTouchEnd={() => handleControl('right', false)}
              onMouseDown={() => handleControl('right', true)}
              onMouseUp={() => handleControl('right', false)}
            >
              <ChevronRight className="w-6 h-6 mx-auto" />
            </button>
          </div>

          <p className="text-center text-xs text-[hsl(var(--color-text-muted))]">
            ใช้ลูกศร หรือ WASD ในการควบคุม
          </p>
        </div>
      )}

      {/* Finished State */}
      {gameState === 'finished' && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🏁</div>
          <h2 className="text-2xl font-bold mb-2">เข้าเส้นชัย!</h2>
          
          <div className="text-4xl font-bold text-purple-500 my-6">
            {formatTime(time)}
          </div>

          {bestTime === time && (
            <div className="px-4 py-2 bg-yellow-400/20 text-yellow-500 rounded-full inline-flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5" />
              สถิติใหม่!
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={startGame}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold"
            >
              แข่งอีกครั้ง
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 py-3 rounded-xl glass font-medium"
            >
              เปลี่ยนสนาม
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
