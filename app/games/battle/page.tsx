'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ArrowLeft, Heart, Shield, Sparkles, Swords, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const CHARACTERS = [
  { id: 1, name: 'Knight', emoji: '⚔️', hp: 100, atk: 15, def: 10, special: 'Shield Bash', specialDmg: 25 },
  { id: 2, name: 'Mage', emoji: '🧙', hp: 70, atk: 20, def: 5, special: 'Fireball', specialDmg: 40 },
  { id: 3, name: 'Archer', emoji: '🏹', hp: 80, atk: 18, def: 7, special: 'Arrow Rain', specialDmg: 30 },
  { id: 4, name: 'Ninja', emoji: '🥷', hp: 75, atk: 22, def: 6, special: 'Shadow Strike', specialDmg: 35 },
];

const ENEMIES = [
  { id: 1, name: 'Dragon', emoji: '🐉', hp: 150, atk: 20, def: 12 },
  { id: 2, name: 'Dark Knight', emoji: '🛡️', hp: 120, atk: 18, def: 15 },
  { id: 3, name: 'Demon', emoji: '👹', hp: 100, atk: 25, def: 8 },
  { id: 4, name: 'Golem', emoji: '🗿', hp: 200, atk: 12, def: 20 },
];

interface BattleState {
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  specialReady: boolean;
  specialCooldown: number;
  turn: 'player' | 'enemy';
  log: string[];
}

export default function BattleArenaPage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'won' | 'lost'>('menu');
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [currentEnemy, setCurrentEnemy] = useState(ENEMIES[0]);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [battle, setBattle] = useState<BattleState>({
    playerHp: 100,
    playerMaxHp: 100,
    enemyHp: 150,
    enemyMaxHp: 150,
    specialReady: true,
    specialCooldown: 0,
    turn: 'player',
    log: [],
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const playerHpSpring = useSpring({
    width: `${(battle.playerHp / battle.playerMaxHp) * 100}%`,
    config: config.gentle,
  });

  const enemyHpSpring = useSpring({
    width: `${(battle.enemyHp / battle.enemyMaxHp) * 100}%`,
    config: config.gentle,
  });

  const startBattle = useCallback(() => {
    const enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
    setCurrentEnemy(enemy);
    setBattle({
      playerHp: selectedChar.hp,
      playerMaxHp: selectedChar.hp,
      enemyHp: enemy.hp,
      enemyMaxHp: enemy.hp,
      specialReady: true,
      specialCooldown: 0,
      turn: 'player',
      log: [`${enemy.emoji} ${enemy.name} ปรากฏตัว!`],
    });
    setGameState('playing');
  }, [selectedChar]);

  const addLog = (message: string) => {
    setBattle(prev => ({
      ...prev,
      log: [...prev.log.slice(-4), message],
    }));
  };

  const calculateDamage = (atk: number, def: number) => {
    const baseDmg = Math.max(atk - def / 2, 5);
    const variance = Math.random() * 10 - 5;
    return Math.round(baseDmg + variance);
  };

  const playerAttack = (isSpecial: boolean = false) => {
    if (isAnimating || battle.turn !== 'player') return;
    
    setIsAnimating(true);
    setEnemyShake(true);
    
    setTimeout(() => {
      setEnemyShake(false);
      
      let damage: number;
      if (isSpecial) {
        damage = selectedChar.specialDmg;
        addLog(`💥 ${selectedChar.special}! ${damage} ดาเมจ!`);
        setBattle(prev => ({ ...prev, specialReady: false, specialCooldown: 3 }));
      } else {
        damage = calculateDamage(selectedChar.atk, currentEnemy.def);
        addLog(`⚔️ โจมตี! ${damage} ดาเมจ!`);
      }

      const newEnemyHp = Math.max(0, battle.enemyHp - damage);
      
      if (newEnemyHp <= 0) {
        setBattle(prev => ({ ...prev, enemyHp: 0 }));
        setEnemiesDefeated(d => d + 1);
        setTotalScore(s => s + currentEnemy.hp * 10);
        addLog(`🎉 ${currentEnemy.name} ถูกกำจัด!`);
        setTimeout(() => setGameState('won'), 1000);
      } else {
        setBattle(prev => ({ ...prev, enemyHp: newEnemyHp, turn: 'enemy' }));
      }
      
      setIsAnimating(false);
    }, 500);
  };

  // Enemy turn
  useEffect(() => {
    if (battle.turn === 'enemy' && gameState === 'playing' && !isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        setPlayerShake(true);
        
        setTimeout(() => {
          setPlayerShake(false);
          
          const damage = calculateDamage(currentEnemy.atk, selectedChar.def);
          addLog(`👹 ${currentEnemy.name} โจมตี! ${damage} ดาเมจ!`);
          
          const newPlayerHp = Math.max(0, battle.playerHp - damage);
          
          if (newPlayerHp <= 0) {
            setBattle(prev => ({ ...prev, playerHp: 0 }));
            addLog(`💀 คุณพ่ายแพ้...`);
            setTimeout(() => setGameState('lost'), 1000);
          } else {
            setBattle(prev => ({
              ...prev,
              playerHp: newPlayerHp,
              turn: 'player',
              specialCooldown: Math.max(0, prev.specialCooldown - 1),
              specialReady: prev.specialCooldown <= 1,
            }));
          }
          
          setIsAnimating(false);
        }, 500);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [battle.turn, battle.playerHp, battle.specialCooldown, currentEnemy, gameState, isAnimating, selectedChar.def]);

  const defend = () => {
    if (isAnimating || battle.turn !== 'player') return;
    
    setIsAnimating(true);
    addLog(`🛡️ ตั้งรับ! ลดดาเมจครึ่งหนึ่ง`);
    
    setTimeout(() => {
      // Simulate enemy attack with reduced damage
      setPlayerShake(true);
      
      setTimeout(() => {
        setPlayerShake(false);
        
        const reducedDamage = Math.floor(calculateDamage(currentEnemy.atk, selectedChar.def * 2) / 2);
        addLog(`👹 ${currentEnemy.name} โจมตี! ${reducedDamage} ดาเมจ (ลดแล้ว)`);
        
        const newPlayerHp = Math.max(0, battle.playerHp - reducedDamage);
        setBattle(prev => ({
          ...prev,
          playerHp: newPlayerHp,
          specialCooldown: Math.max(0, prev.specialCooldown - 1),
          specialReady: prev.specialCooldown <= 1,
        }));
        
        if (newPlayerHp <= 0) {
          setTimeout(() => setGameState('lost'), 1000);
        }
        
        setIsAnimating(false);
      }, 500);
    }, 500);
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
              ⚔️ Battle Arena
            </h1>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              ต่อสู้กับมอนสเตอร์!
            </p>
          </div>
        </div>
      </animated.div>

      {/* Menu State */}
      {gameState === 'menu' && (
        <div className="space-y-6">
          {/* Select Character */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4">เลือกตัวละคร</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(char)}
                  className={`p-4 rounded-2xl text-center transition-all
                    ${selectedChar.id === char.id 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white ring-4 ring-yellow-400' 
                      : 'bg-[hsl(var(--color-surface))] hover:scale-105'
                    }`}
                >
                  <div className="text-4xl mb-2">{char.emoji}</div>
                  <div className="font-medium">{char.name}</div>
                  <div className="text-xs mt-1 opacity-80">
                    ❤️{char.hp} ⚔️{char.atk} 🛡️{char.def}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Character Info */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-3">สกิลพิเศษ</h3>
            <div className="flex items-center gap-4 p-4 bg-[hsl(var(--color-surface))] rounded-2xl">
              <div className="text-4xl">{selectedChar.emoji}</div>
              <div>
                <div className="font-bold text-purple-500">{selectedChar.special}</div>
                <div className="text-sm text-[hsl(var(--color-text-muted))]">
                  สร้างดาเมจ {selectedChar.specialDmg} หน่วย (ใช้ได้ทุก 3 เทิร์น)
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startBattle}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Swords className="w-6 h-6" />
            เริ่มต่อสู้!
          </button>

          {enemiesDefeated > 0 && (
            <div className="text-center text-[hsl(var(--color-text-muted))]">
              🏆 ชนะ: {enemiesDefeated} | คะแนน: {totalScore}
            </div>
          )}
        </div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Battle Field */}
          <div className="glass rounded-3xl p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Player */}
              <div className={`text-center ${playerShake ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
                <div className="text-6xl mb-2">{selectedChar.emoji}</div>
                <div className="font-bold">{selectedChar.name}</div>
                <div className="mt-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{battle.playerHp}/{battle.playerMaxHp}</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <animated.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={playerHpSpring}
                    />
                  </div>
                </div>
              </div>

              {/* Enemy */}
              <div className={`text-center ${enemyShake ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
                <div className="text-6xl mb-2">{currentEnemy.emoji}</div>
                <div className="font-bold">{currentEnemy.name}</div>
                <div className="mt-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{battle.enemyHp}/{battle.enemyMaxHp}</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <animated.div 
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                      style={enemyHpSpring}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VS */}
            <div className="text-center my-4">
              <span className="text-2xl font-bold text-yellow-500">⚡ VS ⚡</span>
            </div>

            {/* Battle Log */}
            <div className="bg-black/20 rounded-xl p-3 h-24 overflow-y-auto">
              {battle.log.map((log, i) => (
                <div key={i} className="text-sm text-[hsl(var(--color-text-secondary))]">{log}</div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => playerAttack(false)}
              disabled={isAnimating || battle.turn !== 'player'}
              className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
            >
              <Swords className="w-6 h-6 mx-auto mb-1" />
              โจมตี
            </button>
            <button
              onClick={defend}
              disabled={isAnimating || battle.turn !== 'player'}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
            >
              <Shield className="w-6 h-6 mx-auto mb-1" />
              ตั้งรับ
            </button>
            <button
              onClick={() => playerAttack(true)}
              disabled={isAnimating || battle.turn !== 'player' || !battle.specialReady}
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform relative"
            >
              <Sparkles className="w-6 h-6 mx-auto mb-1" />
              สกิล
              {!battle.specialReady && (
                <span className="absolute top-1 right-1 text-xs bg-black/50 px-1 rounded">
                  {battle.specialCooldown}
                </span>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-[hsl(var(--color-text-muted))]">
            {battle.turn === 'player' ? 'ถึงตาคุณ!' : 'ศัตรูกำลังโจมตี...'}
          </p>
        </div>
      )}

      {/* Won State */}
      {gameState === 'won' && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">ชัยชนะ!</h2>
          <p className="text-[hsl(var(--color-text-secondary))] mb-4">
            คุณกำจัด {currentEnemy.name} สำเร็จ!
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-500">+{currentEnemy.hp * 10}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startBattle}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold"
            >
              สู้ต่อ!
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 py-3 rounded-xl glass font-medium"
            >
              เปลี่ยนตัวละคร
            </button>
          </div>
        </div>
      )}

      {/* Lost State */}
      {gameState === 'lost' && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold mb-2">พ่ายแพ้...</h2>
          <p className="text-[hsl(var(--color-text-secondary))] mb-4">
            {currentEnemy.name} เอาชนะคุณ
          </p>
          
          <div className="mb-6">
            <div className="text-sm text-[hsl(var(--color-text-muted))]">คะแนนรวม</div>
            <div className="text-2xl font-bold">{totalScore}</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setEnemiesDefeated(0); setTotalScore(0); startBattle(); }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold"
            >
              เริ่มใหม่
            </button>
            <button
              onClick={() => { setEnemiesDefeated(0); setTotalScore(0); setGameState('menu'); }}
              className="flex-1 py-3 rounded-xl glass font-medium"
            >
              กลับเมนู
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
