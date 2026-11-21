import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ArchitectureComponent } from '@/types/architecture';

interface CameraControllerProps {
  selectedComponent: ArchitectureComponent | null;
  onResetView?: () => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  selectedComponent,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Overview default camera position & lookAt
  const defaultPos = useMemoVector(8.5, 3.5, 12.0);
  const defaultLookAt = useMemoVector(0.0, 0.0, 0.0);

  // Target vectors for lerping
  const targetCameraPos = useRef(new THREE.Vector3().copy(defaultPos));
  const targetLookAt = useRef(new THREE.Vector3().copy(defaultLookAt));

  useEffect(() => {
    if (selectedComponent) {
      const [cx, cy, cz] = selectedComponent.position;
      // Fly-to camera position focused on selected node
      targetCameraPos.current.set(cx + 2.4, cy + 1.2, cz + 3.2);
      targetLookAt.current.set(cx, cy + 0.2, cz);
    } else {
      // Return to overview
      targetCameraPos.current.copy(defaultPos);
      targetLookAt.current.copy(defaultLookAt);
    }
  }, [selectedComponent, defaultPos, defaultLookAt]);

  // Smooth camera glide animation in useFrame
  useFrame(() => {
    // Smoothly lerp camera position
    camera.position.lerp(targetCameraPos.current, 0.07);

    // Smoothly lerp orbit controls target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.07);
      controlsRef.current.update();
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={3}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2 + 0.15}
    />
  );
};

function useMemoVector(x: number, y: number, z: number): THREE.Vector3 {
  return React.useMemo(() => new THREE.Vector3(x, y, z), [x, y, z]);
}
