import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { ArchitectureLayer } from '@/types/architecture';

interface ArchitecturalSlabProps {
  layer: ArchitectureLayer;
  onLayerClick?: (layer: ArchitectureLayer) => void;
}

export const ArchitecturalSlab: React.FC<ArchitecturalSlabProps> = ({
  layer,
  onLayerClick,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  // Subtle floating oscillation
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y =
        layer.yPosition + Math.sin(t * 0.8 + layer.levelNumber * 0.6) * 0.04;
    }
  });

  return (
    <group
      ref={meshRef}
      position={[0, layer.yPosition, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onLayerClick?.(layer);
      }}
    >
      {/* 1. Base Layer Slab (Main Floating Rounded Platform) */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[7.2, 0.22, 5.0]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.3}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* 2. Soft Peach Architectural Rim / Chamfer Frame */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[7.32, 0.16, 5.12]} />
        <meshStandardMaterial
          color="#F9DDCA"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Subtle Warm Under-glow Accent Strip */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[6.8, 0.05, 4.6]} />
        <meshBasicMaterial color="#F28C55" transparent opacity={0.35} />
      </mesh>

      {/* 4. Layer Identification Label in 3D */}
      <Text
        position={[-3.3, 0.22, 2.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.22}
        color="#292623"
        anchorX="left"
        anchorY="bottom"
      >
        {layer.name}
      </Text>

      {/* 5. Level Indicator Pill */}
      <Text
        position={[3.3, 0.22, 2.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.18}
        color="#79716B"
        anchorX="right"
        anchorY="bottom"
      >
        {`L${layer.levelNumber} // ACTIVE`}
      </Text>
    </group>
  );
};
