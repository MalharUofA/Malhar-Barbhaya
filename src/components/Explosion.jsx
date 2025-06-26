import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../hooks/store'

const vec = new THREE.Vector3()

const Explosion = ({ beat = 0, ...props }) => {
  const sphere = useRef()
  const { drums, snare } = useStore((state) => state.audio)
  const track = useStore((state) => state.track)

  const [size, setSize] = useState(0)

  useFrame(() => {
    // Trigger glow only on correct beat
    if (drums.signal && track.kicks - 1 === beat && drums.gain) {
      setSize(1)
    }

    if (snare.signal) setSize(0)

    // Glow pulse animation
    if (sphere.current) {
      sphere.current.scale.lerp(vec.set(size * drums.gain, size * drums.gain, size * drums.gain), 0.2)
      if (sphere.current.children[0]) {
        sphere.current.children[0].intensity = drums.avg * drums.gain * 10
      }
    }
  })

  return (
    <group {...props}>
      {/* Glowing red lamp effect */}
      <mesh ref={sphere}>
        <sphereGeometry args={[1.5, 34, 32]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.95} />
        <pointLight color="red" distance={2} intensity={100} decay={2} />
      </mesh>
    </group>
  )
}

export default Explosion
