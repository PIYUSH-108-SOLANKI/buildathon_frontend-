import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { ArchitectureComponent } from '@/types/architecture';

interface ComponentBlockProps {
  component: ArchitectureComponent;
  isSelected: boolean;
  onSelect: (comp: ArchitectureComponent) => void;
}

export const ComponentBlock: React.FC<ComponentBlockProps> = ({
  component,
  isSelected,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Status LED color mapping
  const statusColors = {
    HEALTHY: '#10B981',
    WARNING: '#F59E0B',
    DEGRADED: '#E11D48',
    DOWN: '#E11D48',
  };

  const ledColor = statusColors[component.status];

  // Smooth hover and selection animation
  useFrame(() => {
    if (groupRef.current) {
      const targetY = isSelected ? 0.35 : hovered ? 0.18 : 0;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.15;
    }
  });

  return (
    <group
      position={component.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <group ref={groupRef}>
        {/* Main Component Chassis (Stacked architectural rounded server module) */}
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.48, 0.9]} />
          <meshPhysicalMaterial
            color={isSelected ? '#FFFDFB' : hovered ? '#FFF8F4' : '#FFFFFF'}
            roughness={0.3}
            metalness={0.08}
            clearcoat={0.2}
          />
        </mesh>

        {/* Peach Layer Accent Core */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.26, 0.12, 0.94]} />
          <meshStandardMaterial
            color={isSelected ? '#F28C55' : '#F9DDCA'}
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>

        {/* Component Base Rim */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.15, 0.1, 0.85]} />
          <meshStandardMaterial color="#EFE8E1" roughness={0.5} />
        </mesh>

        {/* Front Face Status Indicator Pip (LED) */}
        <mesh position={[0.42, 0.35, 0.46]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={ledColor} />
        </mesh>

        {/* Front Grille Slits (Industrial Server Chassis Detail) */}
        <mesh position={[-0.1, 0.35, 0.455]}>
          <planeGeometry args={[0.65, 0.16]} />
          <meshBasicMaterial color="#EFE8E1" />
        </mesh>

        {/* Component Name Label in 3D */}
        <Text
          position={[0, 0.72, 0]}
          fontSize={0.16}
          color="#292623"
          anchorX="center"
          anchorY="bottom"
          maxWidth={1.4}
          textAlign="center"
        >
          {component.name}
        </Text>

        {/* Status Text Label */}
        <Text
          position={[0, 0.92, 0]}
          fontSize={0.11}
          color={isSelected ? '#C2410C' : '#79716B'}
          anchorX="center"
          anchorY="bottom"
        >
          {isSelected ? '● FOCUSED' : `${component.metrics.p95LatencyMs}ms`}
        </Text>

        {/* Selection Ground Halo */}
        {isSelected && (
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.7, 0.85, 32]} />
            <meshBasicMaterial color="#F28C55" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    </group>
  );
};
