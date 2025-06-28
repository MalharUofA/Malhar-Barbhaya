import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../hooks/store'

const vec = new THREE.Vector3()

const Explosion = ({ beat = 0, ...props }) => {
  const sphere = useRef()
  const [size, setSize] = useState(0)
  const [visible, setVisible] = useState(false)
  
  const { drums, snare } = useStore((state) => state.audio)
  const track = useStore((state) => state.track)
  const clicked = useStore((state) => state.clicked)

  // Reset state on click changes
  useEffect(() => {
    if (!clicked && sphere.current) {
      setSize(0);
      sphere.current.scale.set(0, 0, 0);
      const light = sphere.current.children.find(child => child.isLight);
      if (light) light.intensity = 0;
      // setVisible(false);
    }
  }, [clicked]);


  useFrame(() => {
    if (!sphere.current || !visible) return

    // Glow pulse on correct beat
    if (clicked && drums.signal && track.kicks - 1 === beat && drums.gain > 0) {
      setSize(1)
    }

    if (!clicked || snare.signal) {
      setSize(0)
    }

    sphere.current.scale.lerp(vec.set(size, size, size), 0.2)

    const light = sphere.current.children.find(child => child.isLight)
    if (light) {
      light.intensity = clicked ? drums.avg * drums.gain * 10 : 0
    }
  })

  // Don't render if not visible
  if (!visible) return null

  return (
    <group {...props}>
      <mesh ref={sphere}>
        <sphereGeometry args={[1.5, 34, 32]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.95} />
        <pointLight color="red" distance={2} intensity={0} decay={2} />
      </mesh>
    </group>
  )
}

export default Explosion
