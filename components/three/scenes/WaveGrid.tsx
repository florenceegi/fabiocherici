/**
 * @package fabiocherici.com — WaveGrid Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Flat grid of points undulating in sine/cosine waves — bronzo accent glow.
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRID = 80;
const SPACING = 0.22;
const HALF = (GRID - 1) * SPACING * 0.5;

function Grid() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, basePositions } = useMemo(() => {
    const count = GRID * GRID;
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);

    for (let ix = 0; ix < GRID; ix++) {
      for (let iz = 0; iz < GRID; iz++) {
        const i = (ix * GRID + iz) * 3;
        const x = ix * SPACING - HALF;
        const z = iz * SPACING - HALF;
        pos[i] = x;
        pos[i + 1] = 0;
        pos[i + 2] = z;
        base[i] = x;
        base[i + 1] = 0;
        base[i + 2] = z;
      }
    }
    return { positions: pos, basePositions: base };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.5;
    const attr = pointsRef.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < GRID * GRID; i++) {
      const i3 = i * 3;
      const x = basePositions[i3];
      const z = basePositions[i3 + 2];
      const d = Math.sqrt(x * x + z * z);
      arr[i3 + 1] =
        Math.sin(d * 0.8 - t * 2) * 0.6 +
        Math.cos(x * 0.5 + t) * Math.sin(z * 0.5 + t * 0.7) * 0.4;
    }
    attr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={GRID * GRID}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C8A96E"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function WaveGridScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Grid />
      </Canvas>
    </div>
  );
}
