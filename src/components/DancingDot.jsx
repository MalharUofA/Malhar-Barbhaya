import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../hooks/store';

export default function DancingDot() {
  const { drums, snare } = useStore((state) => state.audio);
  const dot = useRef();

  useFrame((state) => {
    if (!dot.current) return;

    const time = state.clock.elapsedTime;
    const radius = 4; // Increase this for wider orbit
    const bounce = Math.sin(time * 6) * 0.3 + (drums.avg * drums.gain) / 60;

    // Set x and z to make it orbit, y to bounce
    dot.current.position.set(
      Math.cos(time * 1.5) * radius, // x
      -4 + bounce,                // y (bouncing)
      Math.sin(time * 1.5) * radius  // z
    );
  });

  return (
    <mesh ref={dot} scale={6}>
      <sphereGeometry args={[0.03, 32, 32]} />
      <meshBasicMaterial toneMapped={false} color="white" />
    </mesh>
  );
}
