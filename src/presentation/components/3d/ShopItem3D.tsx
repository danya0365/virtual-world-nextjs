'use client';

import { ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface ShopItem3DProps {
  itemType: 'hat' | 'outfit' | 'accessory' | 'effect';
  color?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

// Hat Item
function HatModel({ color = '#ffd700' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hat brim */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        <meshStandardMaterial color="#2d2d44" roughness={0.4} />
      </mesh>
      {/* Hat top */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.5, 32]} />
        <meshStandardMaterial color="#2d2d44" roughness={0.4} />
      </mesh>
      {/* Hat band */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.08, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Outfit Item (simplified shirt/dress)
function OutfitModel({ color = '#8b5cf6' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.4, 0.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 0.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.45, 0]}>
        <torusGeometry args={[0.15, 0.05, 8, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Accessory Item (wings/jewelry)
function AccessoryModel({ color = '#60a5fa' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      // Wing flap animation
      groupRef.current.children.forEach((child, index) => {
        if (child.position.x !== 0) {
          child.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.3 * (index === 0 ? 1 : -1);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left wing */}
      <mesh position={[-0.4, 0, 0]} rotation={[0.2, 0, 0.3]} castShadow>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          side={THREE.DoubleSide} 
          transparent 
          opacity={0.8}
          metalness={0.3}
        />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.4, 0, 0]} rotation={[0.2, 0, -0.3]} castShadow>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          side={THREE.DoubleSide} 
          transparent 
          opacity={0.8}
          metalness={0.3}
        />
      </mesh>
      {/* Center gem */}
      <mesh position={[0, 0, 0.1]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Effect Item (sparkles/aura)
function EffectModel({ color = '#f59e0b' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main orb */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Rotating rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 16, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.5, 0.02, 16, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.4,
            Math.sin((i / 6) * Math.PI * 2) * 0.4,
            0
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}

// Item component selector
function ItemModel({ itemType, color, rarity }: ShopItem3DProps) {
  const rarityColors = {
    common: '#94a3b8',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
  };

  const itemColor = color || rarityColors[rarity || 'common'];

  switch (itemType) {
    case 'hat':
      return <HatModel color={itemColor} />;
    case 'outfit':
      return <OutfitModel color={itemColor} />;
    case 'accessory':
      return <AccessoryModel color={itemColor} />;
    case 'effect':
      return <EffectModel color={itemColor} />;
    default:
      return <HatModel color={itemColor} />;
  }
}

// Main 3D Canvas Component
export function ShopItem3D({ itemType, color, rarity }: ShopItem3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 2.5], fov: 40 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} castShadow />
        <pointLight position={[-3, 3, -3]} intensity={0.3} color="#a78bfa" />
        <pointLight position={[3, 2, 3]} intensity={0.2} color="#60a5fa" />

        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <ItemModel itemType={itemType} color={color} rarity={rarity} />
        </Float>

        {/* Shadow */}
        <ContactShadows 
          position={[0, -0.6, 0]} 
          opacity={0.3} 
          scale={2} 
          blur={2} 
          far={2}
        />

        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
