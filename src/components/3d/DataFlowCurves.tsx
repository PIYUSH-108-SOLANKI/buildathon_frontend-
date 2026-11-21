import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LayerHealthState } from '@/context/OperationalContext';

interface DataFlowCurvesProps {
  selectedServiceId: string | null;
  layerHealth?: Record<string, LayerHealthState>;
}

interface ArchitecturalPathway {
  id: string;
  name: string;
  sourceLayer: string;
  targetLayer: string;
  curve: THREE.CatmullRomCurve3;
  baseColor: string;
}

export const DataFlowCurves: React.FC<DataFlowCurvesProps> = ({
  selectedServiceId,
  layerHealth = {},
}) => {
  const pulseGroupRef = useRef<THREE.Group>(null);
  const curvesGroupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef<number>(1.0);

  // Define 5 refined architectural 3D connection paths between components:
  // Layer 00 Base Git Sep VCS (y ~ -0.20)
  // Layer 01 Frontend (y ~ +0.22)
  // Layer 02 API Gateway (y ~ +0.64)
  // Layer 03 Backend (y ~ +1.06)
  // Layer 04 PatchUP AI Engine (y ~ +1.48)
  const pathways: ArchitecturalPathway[] = useMemo(() => {
    return [
      // 1. Foundational VCS Flow: Layer 00 (Git Sep VCS) <-> Layer 03 (Backend)
      {
        id: 'flow-git-backend',
        name: 'VCS Canary Rollback & Deployment Bus',
        sourceLayer: 'layer-git-sep',
        targetLayer: 'layer-backend',
        baseColor: '#F28C55',
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.02, -0.20, 0.92),
          new THREE.Vector3(-1.26, 0.22, 1.04),
          new THREE.Vector3(-1.24, 0.64, 0.98),
          new THREE.Vector3(-1.04, 1.06, 0.92),
        ]),
      },
      // 2. Ingress Flow: Layer 01 (Frontend) <-> Layer 02 (Gateway)
      {
        id: 'flow-frontend-gateway',
        name: 'Ingress & SSR Dispatch',
        sourceLayer: 'layer-frontend',
        targetLayer: 'layer-gateway',
        baseColor: '#F28C55',
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.08, 0.22, -0.92),
          new THREE.Vector3(-1.22, 0.43, -1.02),
          new THREE.Vector3(-1.18, 0.54, -0.98),
          new THREE.Vector3(-1.06, 0.64, -0.92),
        ]),
      },
      // 3. Microservice Dispatch: Layer 02 (Gateway) <-> Layer 03 (Backend)
      {
        id: 'flow-gateway-backend',
        name: 'Reverse Proxy Route Bus',
        sourceLayer: 'layer-gateway',
        targetLayer: 'layer-backend',
        baseColor: '#F28C55',
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.02, 0.64, 0.92),
          new THREE.Vector3(1.18, 0.85, 1.04),
          new THREE.Vector3(1.16, 0.96, 0.98),
          new THREE.Vector3(1.02, 1.06, 0.92),
        ]),
      },
      // 4. Telemetry & Decision Bus: Layer 03 (Backend) <-> Layer 04 (AI Engine)
      {
        id: 'flow-backend-ai',
        name: 'Autonomous Telemetry & Safety Bus',
        sourceLayer: 'layer-backend',
        targetLayer: 'layer-ai-engine',
        baseColor: '#F28C55',
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.96, 1.06, -0.96),
          new THREE.Vector3(1.12, 1.27, -1.06),
          new THREE.Vector3(1.08, 1.38, -1.02),
          new THREE.Vector3(0.94, 1.48, -0.94),
        ]),
      },
      // 5. Synthetic Prober Loop: Layer 04 (AI Engine) -> Layer 01 (Frontend Client)
      {
        id: 'flow-ai-synthetic-loop',
        name: 'Synthetic End-to-End Prober Loop',
        sourceLayer: 'layer-ai-engine',
        targetLayer: 'layer-frontend',
        baseColor: '#F28C55',
        curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.95, 1.48, 0.92),
          new THREE.Vector3(1.38, 0.95, 0.98),
          new THREE.Vector3(1.42, 0.52, 0.96),
          new THREE.Vector3(0.96, 0.22, 0.92),
        ]),
      },
    ];
  }, []);

  // Compute pathway colors according to the worst health state between connected layers
  const getPathColor = (path: ArchitecturalPathway) => {
    const srcHealth = layerHealth[path.sourceLayer] || 'HEALTHY';
    const tgtHealth = layerHealth[path.targetLayer] || 'HEALTHY';

    if (srcHealth === 'CRITICAL' || tgtHealth === 'CRITICAL') return '#EF4444'; // Red
    if (srcHealth === 'DEGRADED' || tgtHealth === 'DEGRADED') return '#F59E0B'; // Amber
    if (srcHealth === 'RECOVERING' || tgtHealth === 'RECOVERING') return '#FF5500'; // Restrained orange
    return '#F28C55'; // Nominal warm orange
  };

  // Animate traveling data packets and fade out during layer extraction
  useFrame((state, delta) => {
    const isInspecting = Boolean(selectedServiceId);
    const targetOpacity = isInspecting ? 0.0 : 1.0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 5.0);

    // Update visibility of the curves
    if (curvesGroupRef.current) {
      curvesGroupRef.current.visible = opacityRef.current > 0.02;
    }

    if (pulseGroupRef.current && opacityRef.current > 0.02) {
      const time = state.clock.getElapsedTime();

      pulseGroupRef.current.children.forEach((child, index) => {
        const path = pathways[index % pathways.length];
        const loopDuration = 2.8;
        // Stagger packet phase
        const progress = ((time * 0.42 + index * 0.35) % loopDuration) / loopDuration;
        const point = path.curve.getPointAt(progress);
        child.position.copy(point);
      });
    }
  });

  return (
    <group ref={curvesGroupRef}>
      {/* 1. Thin, Refined Tube Curves (Refined radius = 0.013) */}
      {pathways.map((path) => {
        const pathColor = getPathColor(path);
        const isRecovering =
          layerHealth[path.sourceLayer] === 'RECOVERING' ||
          layerHealth[path.targetLayer] === 'RECOVERING';

        return (
          <mesh key={path.id}>
            <tubeGeometry args={[path.curve, 36, 0.013, 8, false]} />
            <meshBasicMaterial
              color={pathColor}
              transparent
              opacity={isRecovering ? 0.65 : 0.40}
            />
          </mesh>
        );
      })}

      {/* 2. Small Traveling Data Packets (Refined radius = 0.036) */}
      <group ref={pulseGroupRef}>
        {pathways.map((path) => {
          const pathColor = getPathColor(path);
          return (
            <mesh key={`packet-${path.id}`}>
              <sphereGeometry args={[0.036, 12, 12]} />
              <meshBasicMaterial color={pathColor} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
