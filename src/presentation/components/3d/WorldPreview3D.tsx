'use client';

import { Cloud, Environment, Float, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface WorldPreview3DProps {
  worldType: 'meadow' | 'crystal' | 'forest' | 'floating' | 'volcano' | 'ice';
}

// Meadow World - Green landscape with trees
function MeadowWorld() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      
      {/* Trees */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 0.8;
        return (
          <group key={i} position={[Math.cos(angle) * radius, -0.3, Math.sin(angle) * radius]}>
            {/* Trunk */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.05, 0.07, 0.3, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 0.4, 0]}>
              <coneGeometry args={[0.2, 0.4, 8]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          </group>
        );
      })}
      
      {/* Flower decorations */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.3;
        const radius = 0.5;
        return (
          <mesh key={`flower-${i}`} position={[Math.cos(angle) * radius, -0.45, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#f472b6' : '#fbbf24'} />
          </mesh>
        );
      })}
    </group>
  );
}

// Crystal Cave World
function CrystalWorld() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cave base */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      
      {/* Crystals */}
      {[...Array(7)].map((_, i) => {
        const angle = (i / 7) * Math.PI * 2;
        const radius = 0.6 + (i % 3) * 0.2;
        const height = 0.3 + (i % 3) * 0.15;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * radius, height / 2 - 0.4, Math.sin(angle) * radius]}
            rotation={[0, angle, 0.1 * (i % 2 === 0 ? 1 : -1)]}
          >
            <coneGeometry args={[0.08, height, 6]} />
            <meshStandardMaterial 
              color="#67e8f9" 
              transparent 
              opacity={0.8}
              metalness={0.5}
              roughness={0.1}
            />
          </mesh>
        );
      })}
      
      {/* Central large crystal */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial 
          color="#22d3ee" 
          emissive="#22d3ee"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Magic Forest World
function ForestWorld() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#065f46" roughness={0.8} />
      </mesh>
      
      {/* Magic trees with glowing tops */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 0.7;
        return (
          <group key={i} position={[Math.cos(angle) * radius, -0.3, Math.sin(angle) * radius]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.4, 8]} />
              <meshStandardMaterial color="#5b21b6" />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial 
                color="#a855f7" 
                emissive="#a855f7"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 1.5, 
            Math.random() * 0.5, 
            (Math.random() - 0.5) * 1.5
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial 
            color="#e879f9" 
            emissive="#e879f9"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating Island World
function FloatingWorld() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main floating island */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#84cc16" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <coneGeometry args={[0.6, 0.8, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
      
      {/* Small floating rocks */}
      <Float speed={3} floatIntensity={0.5}>
        <mesh position={[-0.8, 0.2, 0.3]}>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#a8a29e" />
        </mesh>
      </Float>
      <Float speed={2} floatIntensity={0.3}>
        <mesh position={[0.7, 0.1, -0.4]}>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#a8a29e" />
        </mesh>
      </Float>
      
      {/* Cloud */}
      <Cloud position={[0, 0.6, 0]} opacity={0.5} speed={0.2} segments={10} />
    </group>
  );
}

// Volcano World
function VolcanoWorld() {
  const groupRef = useRef<THREE.Group>(null);
  const lavaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (lavaRef.current) {
      const material = lavaRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      
      {/* Volcano */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.8, 1, 8, 1, true]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Lava pool */}
      <mesh ref={lavaRef} position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
        <meshStandardMaterial 
          color="#f97316" 
          emissive="#f97316"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Lava rocks */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1, -0.4, Math.sin(angle) * 1]}>
            <dodecahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#292524" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

// Ice World
function IceWorld() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Snow ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Ice formations */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 0.7;
        const height = 0.3 + (i % 2) * 0.2;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * radius, height / 2 - 0.4, Math.sin(angle) * radius]}
          >
            <coneGeometry args={[0.1, height, 4]} />
            <meshStandardMaterial 
              color="#bae6fd" 
              transparent 
              opacity={0.7}
              metalness={0.3}
              roughness={0.1}
            />
          </mesh>
        );
      })}
      
      {/* Igloo */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f0f9ff" roughness={0.4} />
      </mesh>
      
      {/* Snowflakes */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 2,
            Math.random() * 0.8,
            (Math.random() - 0.5) * 2
          ]}
        >
          <octahedronGeometry args={[0.02, 0]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

// World component selector
function WorldModel({ worldType }: WorldPreview3DProps) {
  switch (worldType) {
    case 'meadow':
      return <MeadowWorld />;
    case 'crystal':
      return <CrystalWorld />;
    case 'forest':
      return <ForestWorld />;
    case 'floating':
      return <FloatingWorld />;
    case 'volcano':
      return <VolcanoWorld />;
    case 'ice':
      return <IceWorld />;
    default:
      return <MeadowWorld />;
  }
}

// Main 3D Canvas Component
export function WorldPreview3D({ worldType }: WorldPreview3DProps) {
  // Background color based on world type
  const bgColors = useMemo(() => ({
    meadow: '#86efac',
    crystal: '#1e293b',
    forest: '#4c1d95',
    floating: '#93c5fd',
    volcano: '#7c2d12',
    ice: '#e0f2fe',
  }), []);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: bgColors[worldType] }}>
      <Canvas
        shadows
        camera={{ position: [1.5, 1.5, 1.5], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} castShadow />
        
        {worldType === 'ice' && <Stars radius={50} depth={20} count={100} factor={2} />}
        
        <WorldModel worldType={worldType} />

        <Environment preset={worldType === 'volcano' ? 'dawn' : worldType === 'crystal' ? 'night' : 'sunset'} />
      </Canvas>
    </div>
  );
}
