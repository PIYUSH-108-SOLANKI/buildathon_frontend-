import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ArchitectureTower } from './ArchitectureTower';
import { DataFlowCurves } from './DataFlowCurves';
import { ArchitectureComponent } from '@/types/architecture';
import { useOperational } from '@/context/OperationalContext';

interface ArchitectureSceneProps {
  hoveredServiceId: string | null;
  selectedServiceId: string | null;
  onHoverService: (serviceId: string | null) => void;
  onSelectService: (service: ArchitectureComponent) => void;
}

// ─────────────────────────────────────────────────────────
// CINEMATIC CAMERA CONFIGURATION
// Default overview is zoomed out with generous whitespace
// ─────────────────────────────────────────────────────────
const OVERVIEW_CAMERA_POS = new THREE.Vector3(9.2, 5.5, 9.2);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0.60, 0);

// Base Y coordinates of each layer inside ArchitectureTower (tower root is at y = -0.48)
const LAYER_BASE_Y: Record<string, number> = {
  // Layer 00 — Base (Git Sep: Microsoft VCS)
  'git-sep': 0.28,
  'github-service': 0.28,
  'layer-git-sep': 0.28,

  // Layer 01 — Frontend (Bottom platform)
  'frontend-service': 0.70,
  'layer-frontend': 0.70,

  // Layer 02 — API Gateway
  'gateway-service': 1.12,
  'layer-gateway': 1.12,

  // Layer 03 — Backend (Microservice Cluster: Orders, Payments, Inventory)
  'backend-service': 1.54,
  'orders-service': 1.54,
  'payments-service': 1.54,
  'inventory-service': 1.54,
  'layer-backend': 1.54,

  // Layer 04 — PatchUP AI Engine (Top platform)
  'ai-engine': 1.96,
  'gemini-brain': 1.96,
  'layer-ai': 1.96,
  'layer-ai-engine': 1.96,
};

// Framing offset for RIGHT-3D / LEFT-PANEL layout:
// The layer physically extracts toward SCREEN-LEFT to (-1.35, worldY, 1.35).
// By positioning the camera look target at (-1.95, worldY, 1.95)
// and camera at target + (5.5, 3.4, 5.5),
// the extracted 3D layer projects to x_ndc ~ +0.38,
// perfectly framing it in the visual center of the RIGHT ~58-62% inspection viewport,
// while leaving the LEFT ~38-42% open for the unified service inspection interface.
const DEDICATED_TARGET_OFFSET = new THREE.Vector3(-1.95, 0, 1.95);
const DEDICATED_CAMERA_OFFSET = new THREE.Vector3(5.5, 3.4, 5.5);

interface CameraControllerProps {
  selectedServiceId: string | null;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

const CameraController: React.FC<CameraControllerProps> = ({
  selectedServiceId,
  controlsRef,
}) => {
  const { camera } = useThree();
  const transitionRef = useRef<{
    isAnimating: boolean;
    startTime: number;
    duration: number;
    startPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endPos: THREE.Vector3;
    endTarget: THREE.Vector3;
  }>({
    isAnimating: false,
    startTime: 0,
    duration: 900,
    startPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
  });

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!controlsRef.current) return;

    const targetPos = new THREE.Vector3();
    const targetTarget = new THREE.Vector3();

    if (selectedServiceId && LAYER_BASE_Y[selectedServiceId] !== undefined) {
      const worldY = -0.48 + LAYER_BASE_Y[selectedServiceId];
      targetTarget.set(
        DEDICATED_TARGET_OFFSET.x,
        worldY + DEDICATED_TARGET_OFFSET.y,
        DEDICATED_TARGET_OFFSET.z
      );
      targetPos.copy(targetTarget).add(DEDICATED_CAMERA_OFFSET);
    } else {
      targetTarget.copy(OVERVIEW_TARGET);
      targetPos.copy(OVERVIEW_CAMERA_POS);
    }

    if (prefersReducedMotion) {
      camera.position.copy(targetPos);
      controlsRef.current.target.copy(targetTarget);
      controlsRef.current.update();
      return;
    }

    transitionRef.current = {
      isAnimating: true,
      startTime: performance.now(),
      duration: 950,
      startPos: camera.position.clone(),
      startTarget: controlsRef.current.target.clone(),
      endPos: targetPos,
      endTarget: targetTarget,
    };
  }, [selectedServiceId, camera, controlsRef, prefersReducedMotion]);

  useFrame(() => {
    const tr = transitionRef.current;
    if (!tr.isAnimating || !controlsRef.current) return;

    const elapsed = performance.now() - tr.startTime;
    const progress = Math.min(1, elapsed / tr.duration);

    // Polished cubic ease-out curve
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(tr.startPos, tr.endPos, ease);
    controlsRef.current.target.lerpVectors(tr.startTarget, tr.endTarget, ease);
    controlsRef.current.update();

    if (progress >= 1) {
      tr.isAnimating = false;
    }
  });

  return null;
};

// Enables soft studio PCF shadow filtering
const ShadowMapConfig: React.FC = () => {
  const { gl } = useThree();
  useEffect(() => {
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);
  return null;
};

export const ArchitectureScene: React.FC<ArchitectureSceneProps> = ({
  hoveredServiceId,
  selectedServiceId,
  onHoverService,
  onSelectService,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { layerHealth } = useOperational();

  return (
    <div className="w-full h-full relative select-none bg-[#FAF8F5]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.14,
          antialias: true,
        }}
        camera={{
          position: [OVERVIEW_CAMERA_POS.x, OVERVIEW_CAMERA_POS.y, OVERVIEW_CAMERA_POS.z],
          fov: 22,
          near: 0.1,
          far: 50,
        }}
        className="w-full h-full"
      >
        <ShadowMapConfig />

        {/* ─────────────────────────────────────────────────────────
            HIGH-KEY LUMINOUS STUDIO LIGHTING (Apple / Braun Studio)
           ───────────────────────────────────────────────────────── */}
        {/* Soft Ambient Fill (Softened to preserve shadow depth) */}
        <ambientLight color="#FFF8F2" intensity={1.5} />

        {/* Crisp Key Sunlight (Top-Left Forward Studio Softbox) */}
        <directionalLight
          position={[8, 14, 6]}
          intensity={2.3}
          color="#FFFFFF"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={1}
          shadow-camera-far={25}
          shadow-camera-left={-3.5}
          shadow-camera-right={3.5}
          shadow-camera-top={3.5}
          shadow-camera-bottom={-3.5}
          shadow-bias={-0.00015}
        />

        {/* Soft Left Fill Light (Warm ivory bounce) */}
        <directionalLight
          position={[-6, 7, 4]}
          intensity={0.9}
          color="#FFF5EE"
        />

        {/* Studio Rim Light (Gives delicate glint to beveled ceramic and glass) */}
        <directionalLight
          position={[2, 7, -7]}
          intensity={0.8}
          color="#FFEFE4"
        />

        {/* Floor Uplight Bounce */}
        <directionalLight
          position={[0, -3, 2]}
          intensity={0.25}
          color="#FFF8F2"
        />

        {/* ─────────────────────────────────────────────────────────
            ANIMATED ARCHITECTURAL DATA FLOW & DEPENDENCY PATHS
            (Thin, refined splines with traveling data packets between layers)
           ───────────────────────────────────────────────────────── */}
        <DataFlowCurves
          selectedServiceId={selectedServiceId}
          layerHealth={layerHealth}
        />

        {/* ─────────────────────────────────────────────────────────
            THE ROUNDED ARCHITECTURAL HARDWARE MODULE
           ───────────────────────────────────────────────────────── */}
        <ArchitectureTower
          hoveredServiceId={hoveredServiceId}
          selectedServiceId={selectedServiceId}
          layerHealth={layerHealth}
          onHoverService={onHoverService}
          onSelectService={onSelectService}
        />

        {/* ─────────────────────────────────────────────────────────
            CINEMATIC CAMERA CONTROLLER (Smooth Click-to-Zoom)
           ───────────────────────────────────────────────────────── */}
        <CameraController
          selectedServiceId={selectedServiceId}
          controlsRef={controlsRef}
        />

        {/* ─────────────────────────────────────────────────────────
            STUDIO FLOOR CONTACT SHADOW (Directly under stepped pedestal)
           ───────────────────────────────────────────────────────── */}
        <ContactShadows
          position={[0, -0.672, 0]}
          opacity={0.30}
          scale={7.5}
          blur={2.4}
          far={2.0}
          color="#3A2C21"
        />

        {/* Warm Architectural Floor Grid Helper (Seamlessly extends across entire viewport) */}
        <gridHelper
          args={[44, 22, '#E9B590', '#F3D4BF']}
          position={[0, -0.675, 0]}
        />

        {/* Orbit Controls (Drag to inspect; mouse wheel preserved for vertical page scrolling) */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          enableZoom={false}
          minDistance={3.2}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 - 0.08}
          minPolarAngle={Math.PI / 6}
          target={[OVERVIEW_TARGET.x, OVERVIEW_TARGET.y, OVERVIEW_TARGET.z]}
        />
      </Canvas>
    </div>
  );
};
