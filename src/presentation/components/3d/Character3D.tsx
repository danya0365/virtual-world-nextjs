'use client';

import { ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface Character3DProps {
  bodyColor: string;
  eyeStyle?: 'normal' | 'happy' | 'cool' | 'sleepy';
  accessory?: string | null;
  autoRotate?: boolean;
}

// Character 3D Model Component
function CharacterModel({ bodyColor, eyeStyle = 'normal', accessory }: Omit<Character3DProps, 'autoRotate'>) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      // Subtle rotation when hovered
      if (hovered) {
        groupRef.current.rotation.y += 0.01;
      }
    }
  });

  // Convert hex color to THREE color
  const color = new THREE.Color(bodyColor);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group 
        ref={groupRef} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        {/* Head */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Eyes */}
        {eyeStyle === 'normal' && (
          <>
            <mesh position={[-0.2, 1.3, 0.46]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
            <mesh position={[0.2, 1.3, 0.46]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
          </>
        )}

        {eyeStyle === 'happy' && (
          <>
            <mesh position={[-0.2, 1.3, 0.46]} rotation={[0, 0, Math.PI / 6]}>
              <boxGeometry args={[0.15, 0.05, 0.05]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
            <mesh position={[0.2, 1.3, 0.46]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.15, 0.05, 0.05]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
          </>
        )}

        {eyeStyle === 'cool' && (
          <>
            <mesh position={[-0.2, 1.3, 0.46]}>
              <boxGeometry args={[0.2, 0.08, 0.05]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
            <mesh position={[0.2, 1.3, 0.46]}>
              <boxGeometry args={[0.2, 0.08, 0.05]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
          </>
        )}

        {eyeStyle === 'sleepy' && (
          <>
            <mesh position={[-0.2, 1.25, 0.46]}>
              <boxGeometry args={[0.15, 0.03, 0.05]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
            <mesh position={[0.2, 1.25, 0.46]}>
              <boxGeometry args={[0.15, 0.03, 0.05]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
          </>
        )}

        {/* Mouth */}
        <mesh position={[0, 1.0, 0.46]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#555" />
        </mesh>

        {/* Body */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.7, 0.9, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.5, 0.3, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 0.25]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0.5, 0.3, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 0.25]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.2, -0.5, 0]} castShadow>
          <boxGeometry args={[0.25, 0.6, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0.2, -0.5, 0]} castShadow>
          <boxGeometry args={[0.25, 0.6, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Accessory - Crown */}
        {accessory === 'crown' && (
          <mesh position={[0, 1.85, 0]}>
            <cylinderGeometry args={[0.35, 0.4, 0.3, 6]} />
            <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
          </mesh>
        )}

        {/* Accessory - Hat */}
        {accessory === 'hat' && (
          <group position={[0, 1.8, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
              <meshStandardMaterial color="#2d2d44" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.35, 32]} />
              <meshStandardMaterial color="#2d2d44" />
            </mesh>
          </group>
        )}

        {/* Accessory - Wings */}
        {accessory === 'wings' && (
          <>
            <mesh position={[-0.5, 0.5, -0.3]} rotation={[0, -0.3, 0.2]}>
              <planeGeometry args={[0.6, 0.8]} />
              <meshStandardMaterial color="#fff" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.5, 0.5, -0.3]} rotation={[0, 0.3, -0.2]}>
              <planeGeometry args={[0.6, 0.8]} />
              <meshStandardMaterial color="#fff" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          </>
        )}

        {/* Accessory - Star */}
        {accessory === 'star' && (
          <mesh position={[0, 1.85, 0]} rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.5} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// Main 3D Canvas Component
export function Character3D({ bodyColor, eyeStyle, accessory, autoRotate = true }: Character3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1, 4], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a78bfa" />
        <pointLight position={[5, 2, 5]} intensity={0.3} color="#60a5fa" />

        {/* Character */}
        <CharacterModel 
          bodyColor={bodyColor}
          eyeStyle={eyeStyle}
          accessory={accessory}
        />

        {/* Shadow */}
        <ContactShadows 
          position={[0, -0.8, 0]} 
          opacity={0.4} 
          scale={3} 
          blur={2} 
          far={4}
        />

        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={6}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />

        {/* Environment for reflections */}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
