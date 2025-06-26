import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../hooks/store';

const obj = new THREE.Object3D();

export default function Graph(props) {
  const { synth } = useStore((state) => state.audio);
  const ref = useRef();

  useFrame(() => {
    for (let i = 0; i < 64; i++) {
      obj.position.set(i * 0.04, synth.data[i] / 1000, 0);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, 64]} {...props}>
      <planeGeometry args={[0.02, 0.05]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={1} />
    </instancedMesh>
  );
}
