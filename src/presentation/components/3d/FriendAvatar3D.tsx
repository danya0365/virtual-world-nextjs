'use client';

import { Environment, Float } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FriendAvatar3DProps {
  color?: string;
  status?: 'online' | 'offline' | 'playing';
}

// 3D Avatar Head
function AvatarHead({ color = '#f472b6', status = 'online' }: FriendAvatar3DProps) {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const statusColor = status === 'online' ? '#22c55e' : status === 'playing' ? '#3b82f6' : '#9ca3af';

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={headRef}>
        {/* Head - Block style */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.41]}>
          <boxGeometry args={[0.12, 0.12, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.41]}>
          <boxGeometry args={[0.12, 0.12, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Blush */}
        <mesh position={[-0.25, -0.05, 0.41]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#fda4af" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.25, -0.05, 0.41]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#fda4af" transparent opacity={0.6} />
        </mesh>

        {/* Smile */}
        <mesh position={[0, -0.15, 0.41]}>
          <boxGeometry args={[0.2, 0.06, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Status indicator */}
        <mesh position={[0.35, 0.35, 0.35]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color={statusColor} 
            emissive={statusColor}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Ears (small cubes) */}
        <mesh position={[-0.45, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.45, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </Float>
  );
}

// Main 3D Canvas Component
export function FriendAvatar3D({ color = '#f472b6', status = 'online' }: FriendAvatar3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        
        <AvatarHead color={color} status={status} />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
