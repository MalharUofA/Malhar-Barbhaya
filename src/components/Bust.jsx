import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../hooks/store';

const red = new THREE.Color('#900909');

const Bust = (props) => {
  const group = useRef();
  const time = useRef(0);
  const floatOffset = useRef(0);
  const floatSpeed = useRef(Math.random() * 0.01 + 0.005);

  const { nodes, materials, animations } = useGLTF('/models/bust.glb');
  const { actions, mixer } = useAnimations(animations, group);

  const { drums, synth } = useStore((state) => state.audio);
  const track = useStore.getState().track;
 const clicked = useStore((state) => state.clicked);
  const prevClicked = useRef(clicked);

  const floatFrame = useRef(0);
  const lastSynthState = useRef(false);
  const synthIdleTransition = useRef(false);

  const initialPos = useRef(new THREE.Vector3(...(props.position || [0, 0, 0])));
  const initialRot = useRef(new THREE.Euler(...(props.rotation || [0, 0, 0])));
  const rotationSpeeds = useRef({});
  // Start all actions once
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopRepeat;
      action.play();
    });
  }, [actions]);
  useEffect(() => {
      if (materials['default']) {
        materials['default'].color = new THREE.Color('#FFFAFA'); // Change to desired color
      }
  }, [materials]);


  useFrame((_, delta) => {
    if (!mixer || !materials.inner || !drums || !synth) return;
    // Detect rising edge: when clicked becomes true again
    if (!prevClicked.current && clicked) {
      time.current = 0;
      mixer.setTime(0);
    }
    prevClicked.current = clicked;

    const beat = (drums.avg * drums.gain) / 30;
    materials.inner.color.copy(red).multiplyScalar(beat);

    // === Case 1: Reset state ===
    if (!clicked) {
      time.current = THREE.MathUtils.lerp(time.current, 0, 0.1);
      mixer.setTime(time.current);
      group.current.position.lerp(initialPos.current, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, initialRot.current.x, 0.1);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, initialRot.current.y, 0.1);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, initialRot.current.z, 0.1);
      group.current.traverse((child) => {
        if (child.isMesh && child.userData.originalRotation) {
          child.rotation.x = child.userData.originalRotation.x;
          child.rotation.y = child.userData.originalRotation.y;
          child.rotation.z = child.userData.originalRotation.z;
          child.userData.rotationSpeed = null;
        }
      });
      return;
    }

    // === Case 2: Floating idle (synth only) ===
    if (track.synthonly && synth.gain > 0) {
      if (!lastSynthState.current) {
        floatFrame.current = time.current;
        synthIdleTransition.current = true;
        lastSynthState.current = true;
      }

      if (synthIdleTransition.current) {
        mixer.setTime(floatFrame.current);

        // Gentle idle motion for exploded pieces (slight rotations)
        group.current.traverse((child) => {
          if (child.isMesh) {
              if (!child.userData.originalRotation) {
                child.userData.originalRotation = {
                  x: child.rotation.x,
                  y: child.rotation.y,
                  z: child.rotation.z,
                };
              }
            // Initialize random rotation data for each mesh once
            if (!child.userData.rotationSpeed) {
              child.userData.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.003, // small value around 0
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.003,
              };
            }

            // Slightly rotate each fragment in place
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
            child.rotation.z += child.userData.rotationSpeed.z;
          }
        });


        floatOffset.current += delta;
        return;
      }
    } else {
      lastSynthState.current = false;
      synthIdleTransition.current = false;
      group.current.traverse((child) => {
      if (child.isMesh && child.userData.originalRotation) {
        child.rotation.x = child.userData.originalRotation.x;
        child.rotation.y = child.userData.originalRotation.y;
        child.rotation.z = child.userData.originalRotation.z;
      }
    });
    }

    // === Case 3: Beat-based animation ===
    const targetTime = track.kicks * 1.25;
    time.current = THREE.MathUtils.lerp(time.current, targetTime, 0.15);
    mixer.setTime(time.current);
  });
  return (
    <group ref={group} {...props} dispose={null}>
        
      <group name="Scene">
        <group name="Mesh_0001_cell001" position={[1.166, 5.663, 0.045]}>
          <mesh
            name="Mesh_0001_cell079"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell079.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell079_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell079_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell002" position={[-0.997, 2.381, -1.007]}>
          <mesh
            name="Mesh_0001_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell009" position={[-0.594, 5.22, 0.689]}>
          <mesh
            name="Mesh_0001_cell004"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell012" position={[-0.954, 0.658, -0.844]}>
          <mesh
            name="Mesh_0001_cell005"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell014" position={[0.018, 6.089, -0.132]}>
          <mesh
            name="Mesh_0001_cell006"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell015" position={[0.311, 5.051, 0.985]}>
          <mesh
            name="Mesh_0001_cell007"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell017" position={[0.841, 0.729, -0.065]}>
          <mesh
            name="Mesh_0001_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell018" position={[-0.047, 2.91, -1.072]}>
          <mesh
            name="Mesh_0001_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell009_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell009_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell009_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell020" position={[-0.108, 4.995, -1.676]}>
          <mesh
            name="Mesh_0001_cell011"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell021" position={[0.443, 0.497, -1.307]}>
          <mesh
            name="Mesh_0001_cell012_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell012_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell012_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell012_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell023" position={[-1.134, 4.636, -0.741]}>
          <mesh
            name="Mesh_0001_cell013"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell013.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell013_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell013_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell024" position={[1.004, 0.487, 0.851]}>
          <mesh
            name="Mesh_0001_cell014_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell014_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell014_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell014_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell025" position={[-0.392, 3.99, -1.228]}>
          <mesh
            name="Mesh_0001_cell015_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell015_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell015_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell015_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell026" position={[0.335, 1.719, 0.668]}>
          <mesh
            name="Mesh_0001_cell016_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell016_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell016_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell016_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell028" position={[0.101, 1.696, -0.356]}>
          <mesh
            name="Mesh_0001_cell018_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell018_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell018_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell018_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell029" position={[0.88, 5.129, -1.446]}>
          <mesh
            name="Mesh_0001_cell019"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell030" position={[0.344, 2.296, 1.241]}>
          <mesh
            name="Mesh_0001_cell020_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell020_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell020_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell020_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell031" position={[-0.88, 4.004, -0.926]}>
          <mesh
            name="Mesh_0001_cell021_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell021_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell021_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell021_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell033" position={[1.229, 3.197, -0.851]}>
          <mesh
            name="Mesh_0001_cell023_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell023_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell023_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell023_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell034" position={[-0.233, 3.98, 0.699]}>
          <mesh
            name="Mesh_0001_cell024_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell024_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell024_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell024_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell036" position={[0.675, 3.49, 0.634]}>
          <mesh
            name="Mesh_0001_cell026_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell026_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell026_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell026_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell037" position={[1.497, 4.352, -0.32]}>
          <mesh
            name="Mesh_0001_cell027"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell039" position={[-1.271, 0.318, 0.306]}>
          <mesh
            name="Mesh_0001_cell028_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell028_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell028_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell028_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell040" position={[-0.8, 1.368, 0.384]}>
          <mesh
            name="Mesh_0001_cell029_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell029_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell029_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell029_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell041" position={[0.13, 2.218, -0.884]}>
          <mesh
            name="Mesh_0001_cell030_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell030_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell030_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell030_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell045" position={[-0.741, 3.113, -0.64]}>
          <mesh
            name="Mesh_0001_cell031_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell031_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell031_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell031_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell046" position={[0.205, 3.578, -1.278]}>
          <mesh
            name="Mesh_0001_cell032"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell032.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell032_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell032_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell048" position={[-1.342, 2.104, 0.118]}>
          <mesh
            name="Mesh_0001_cell034_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell034_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell034_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell034_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell050" position={[-0.615, 5.476, -1.012]}>
          <mesh
            name="Mesh_0001_cell035"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell053" position={[-1.042, 4.667, 0.252]}>
          <mesh
            name="Mesh_0001_cell036_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell036_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell036_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell036_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell054" position={[0.398, 1.766, 2.394]}>
          <mesh
            name="Mesh_0001_cell037_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell037_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell037_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell037_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell055" position={[-0.292, 0.464, 1.257]}>
          <mesh
            name="Mesh_0001_cell038"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell038.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell038_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell038_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell057" position={[0.843, 4.865, 0.807]}>
          <mesh
            name="Mesh_0001_cell039_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell039_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell039_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell039_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell058" position={[-0.727, 3.142, 0.175]}>
          <mesh
            name="Mesh_0001_cell040_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell040_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell040_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell040_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell059" position={[0.411, 1.574, 1.753]}>
          <mesh
            name="Mesh_0001_cell041_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell041_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell041_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell041_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell060" position={[-1.444, 1.812, -0.811]}>
          <mesh
            name="Mesh_0001_cell042"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell042.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell042_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell042_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell061" position={[1.423, 5.206, -0.915]}>
          <mesh
            name="Mesh_0001_cell043"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell043.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell043_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell043_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell063" position={[0.606, 4.145, -1.409]}>
          <mesh
            name="Mesh_0001_cell045_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell045_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell045_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell045_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell064" position={[-0.233, 1.527, 2.204]}>
          <mesh
            name="Mesh_0001_cell046_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell046_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell046_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell046_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell065" position={[-0.201, 4.707, 0.965]}>
          <mesh
            name="Mesh_0001_cell047"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell068" position={[1.055, 3.019, -0.127]}>
          <mesh
            name="Mesh_0001_cell048_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell048_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell048_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell048_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell073" position={[0.65, 5.7, -1.342]}>
          <mesh
            name="Mesh_0001_cell050_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell050_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell050_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell050_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell074" position={[-0.699, 2.564, 0.83]}>
          <mesh
            name="Mesh_0001_cell051"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell051.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell051_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell051_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell003" position={[1.339, 2.93, -0.057]}>
          <mesh
            name="Mesh_0001_cell052"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell052.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell052_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell052_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell016" position={[-0.637, 1.913, 1.319]}>
          <mesh
            name="Mesh_0001_cell059_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell059_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell059_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell059_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell002" position={[-0.659, 1.877, 1.823]}>
          <mesh
            name="Mesh_0001_cell011_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell005" position={[-0.686, 1.908, 1.763]}>
          <mesh
            name="Mesh_0001_cell011_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell007" position={[-0.677, 1.753, 1.722]}>
          <mesh
            name="Mesh_0001_cell011_cell004"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell" position={[-1.594, 0.947, -0.828]}>
          <mesh
            name="Mesh_0001_cell010_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell008_cell" position={[0.17, 1.023, 1.132]}>
          <mesh
            name="Mesh_0001_cell008_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell008_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell008_cell003" position={[0.347, 1.004, 1.139]}>
          <mesh
            name="Mesh_0001_cell008_cell002"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell002.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell008_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell002_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell008_cell004" position={[0.274, 0.922, 1.163]}>
          <mesh
            name="Mesh_0001_cell008_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell008_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell008_cell006" position={[0.168, 0.987, 1.191]}>
          <mesh
            name="Mesh_0001_cell008_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell008_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell008_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell" position={[0.316, 1.012, -0.993]}>
          <mesh
            name="Mesh_0001_cell007_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell001" position={[0.544, 1.016, -1.041]}>
          <mesh
            name="Mesh_0001_cell007_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell002" position={[0.841, 0.989, -1.082]}>
          <mesh
            name="Mesh_0001_cell007_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell003" position={[0.662, 1.021, -0.968]}>
          <mesh
            name="Mesh_0001_cell007_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell006" position={[0.65, 1.031, -1.244]}>
          <mesh
            name="Mesh_0001_cell007_cell004"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell062_cell" position={[-1.012, 0.933, 1.459]}>
          <mesh
            name="Mesh_0001_cell062_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell062_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell062_cell001" position={[-1.11, 0.949, 1.213]}>
          <mesh
            name="Mesh_0001_cell062_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell062_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell062_cell002" position={[-0.856, 0.919, 1.461]}>
          <mesh
            name="Mesh_0001_cell062_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell062_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell062_cell004" position={[-1.104, 0.762, 1.217]}>
          <mesh
            name="Mesh_0001_cell062_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell062_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell062_cell005" position={[-0.806, 0.984, 1.357]}>
          <mesh
            name="Mesh_0001_cell062_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell062_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell062_cell007" position={[-1.015, 0.923, 1.31]}>
          <mesh
            name="Mesh_0001_cell062_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell062_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell062_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell047_cell" position={[-1.094, 3.75, -0.184]}>
          <mesh
            name="Mesh_0001_cell047_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell047_cell002" position={[-1.138, 3.778, 0.047]}>
          <mesh
            name="Mesh_0001_cell047_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell047_cell003" position={[-1.152, 3.991, -0.193]}>
          <mesh
            name="Mesh_0001_cell047_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell047_cell004" position={[-0.928, 3.827, 0.409]}>
          <mesh
            name="Mesh_0001_cell047_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell047_cell005" position={[-1.113, 4.036, 0.126]}>
          <mesh
            name="Mesh_0001_cell047_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell047_cell006" position={[-1.098, 3.809, 0.306]}>
          <mesh
            name="Mesh_0001_cell047_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell005_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_cell005_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell005_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell047_cell007" position={[-1.046, 4.019, 0.197]}>
          <mesh
            name="Mesh_0001_cell047_cell006_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell006_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell047_cell006_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell047_cell006_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell" position={[-0.92, 0.222, 1.496]}>
          <mesh
            name="Mesh_0001_cell035_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell001" position={[-1, 0.101, 1.471]}>
          <mesh
            name="Mesh_0001_cell035_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell003" position={[-1.013, 0.307, 1.429]}>
          <mesh
            name="Mesh_0001_cell035_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell004" position={[-1.059, 0.178, 1.287]}>
          <mesh
            name="Mesh_0001_cell035_cell002"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell002.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell002_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell005" position={[-0.911, 0.086, 1.483]}>
          <mesh
            name="Mesh_0001_cell035_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell002" position={[0.131, 1.131, 2.903]}>
          <mesh
            name="Mesh_0001_cell027_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell003" position={[0.246, 1.257, 2.878]}>
          <mesh
            name="Mesh_0001_cell027_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell004" position={[-0.038, 5.811, 0.626]}>
          <mesh
            name="Mesh_0001_cell019_cell002"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell005" position={[-0.19, 5.861, 0.491]}>
          <mesh
            name="Mesh_0001_cell019_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell006" position={[-0.184, 5.819, 0.545]}>
          <mesh
            name="Mesh_0001_cell019_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell007" position={[0.149, 5.82, 0.627]}>
          <mesh
            name="Mesh_0001_cell019_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell005_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell005_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell005_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell005_cell001" position={[0.714, 6.149, -0.726]}>
          <mesh
            name="Mesh_0001_cell005_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell005_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell005_cell004" position={[0.995, 6.042, -0.792]}>
          <mesh
            name="Mesh_0001_cell005_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell005_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell005_cell006" position={[0.464, 6.089, -0.916]}>
          <mesh
            name="Mesh_0001_cell005_cell002"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005_cell002.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell005_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell005_cell002_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell004_cell" position={[-1.005, 0.636, 1.497]}>
          <mesh
            name="Mesh_0001_cell004_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell004_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell004_cell001" position={[-1.085, 0.632, 1.299]}>
          <mesh
            name="Mesh_0001_cell004_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell004_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell004_cell002" position={[-0.908, 0.54, 1.463]}>
          <mesh
            name="Mesh_0001_cell004_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell004_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell004_cell004" position={[-0.959, 0.448, 1.499]}>
          <mesh
            name="Mesh_0001_cell004_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell004_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell004_cell005" position={[-0.937, 0.745, 1.489]}>
          <mesh
            name="Mesh_0001_cell004_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell004_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell004_cell007" position={[-1.077, 0.464, 1.32]}>
          <mesh
            name="Mesh_0001_cell004_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell004_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell004_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell002_cell" position={[-0.291, 5.797, 0.509]}>
          <mesh
            name="Mesh_0001_cell019_cell002_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell002_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell002_cell001" position={[-0.407, 5.773, 0.438]}>
          <mesh
            name="Mesh_0001_cell019_cell002_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell002_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell002_cell002" position={[-0.395, 5.771, 0.458]}>
          <mesh
            name="Mesh_0001_cell019_cell002_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell002_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell002_cell004" position={[-0.362, 5.782, 0.476]}>
          <mesh
            name="Mesh_0001_cell019_cell002_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell002_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell019_cell002_cell005" position={[-0.289, 5.754, 0.47]} />
        <group name="Mesh_0001_cell019_cell002_cell007" position={[-0.316, 5.792, 0.486]}>
          <mesh
            name="Mesh_0001_cell019_cell002_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell019_cell002_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell019_cell002_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell007_cell" position={[0.232, 1.154, 2.795]}>
          <mesh
            name="Mesh_0001_cell027_cell007_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell007_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell027_cell007_cell001"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell027_cell007_cell001.geometry}
          material={materials.inner}
          position={[0.288, 1.19, 2.801]}
        />
        <group name="Mesh_0001_cell027_cell007_cell002" position={[0.216, 1.149, 2.789]}>
          <mesh
            name="Mesh_0001_cell027_cell007_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell007_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell007_cell003" position={[0.2, 1.14, 2.804]}>
          <mesh
            name="Mesh_0001_cell027_cell007_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell007_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell027_cell007_cell004"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell027_cell007_cell004.geometry}
          material={materials.inner}
          position={[0.207, 1.165, 2.798]}
        />
        <group name="Mesh_0001_cell027_cell007_cell005" position={[0.236, 1.163, 2.8]}>
          <mesh
            name="Mesh_0001_cell027_cell007_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell007_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell007_cell006" position={[0.185, 1.121, 2.805]}>
          <mesh
            name="Mesh_0001_cell027_cell007_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell005_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell007_cell005_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell005_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell007_cell007" position={[0.267, 1.177, 2.798]}>
          <mesh
            name="Mesh_0001_cell027_cell007_cell006_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell006_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell007_cell006_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell007_cell006_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell027_cell004_cell"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell027_cell004_cell.geometry}
          material={materials['default']}
          position={[0.083, 0.664, 2.885]}
        />
        <group name="Mesh_0001_cell027_cell004_cell001" position={[0.092, 1.048, 2.869]} />
        <group name="Mesh_0001_cell027_cell004_cell002" position={[0.082, 1.052, 2.876]}>
          <mesh
            name="Mesh_0001_cell027_cell004_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell004_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell004_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell004_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell004_cell003" position={[0.089, 1.05, 2.888]}>
          <mesh
            name="Mesh_0001_cell027_cell004_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell004_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell004_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell004_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell027_cell004_cell004"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell027_cell004_cell004.geometry}
          material={materials.inner}
          position={[0.083, 0.669, 2.888]}
        />
        <group name="Mesh_0001_cell027_cell004_cell005" position={[0.09, 1.048, 2.878]}>
          <mesh
            name="Mesh_0001_cell027_cell004_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell004_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell004_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell004_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell027_cell004_cell006"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell027_cell004_cell006.geometry}
          material={materials['default']}
          position={[0.075, 0.672, 2.883]}
        />
        <group name="Mesh_0001_cell027_cell001_cell001" position={[0.254, 1.161, 2.947]}>
          <mesh
            name="Mesh_0001_cell027_cell001_cell007"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell001_cell007.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell001_cell007_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell001_cell007_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell027_cell001_cell003"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell027_cell001_cell003.geometry}
          material={materials.inner}
          position={[0.249, 1.156, 2.944]}
        />
        <group name="Mesh_0001_cell027_cell001_cell004" position={[0.246, 1.163, 2.948]} />
        <group name="Mesh_0001_cell027_cell001_cell005" position={[0.239, 1.163, 2.949]}>
          <mesh
            name="Mesh_0001_cell027_cell001_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell001_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell001_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell001_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell001_cell006" position={[0.243, 1.153, 2.951]} />
        <group name="Mesh_0001_cell027_cell_cell" position={[0.449, 1.337, 2.868]}>
          <mesh
            name="Mesh_0001_cell027_cell_cell006"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell_cell006.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell_cell006_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell_cell006_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell027_cell_cell001"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell027_cell_cell001.geometry}
          material={materials['default']}
          position={[0.445, 1.323, 2.875]}
        />
        <group name="Mesh_0001_cell027_cell_cell002" position={[0.448, 1.33, 2.868]}>
          <mesh
            name="Mesh_0001_cell027_cell_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell027_cell_cell004" position={[0.444, 1.319, 2.864]}>
          <mesh
            name="Mesh_0001_cell027_cell_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell027_cell_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell027_cell_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell007_cell" position={[-1.103, 0.357, 1.213]}>
          <mesh
            name="Mesh_0001_cell035_cell007_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell007_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell035_cell007_cell001"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell035_cell007_cell001.geometry}
          material={materials.inner}
          position={[-1.119, 0.308, 1.158]}
        />
        <group name="Mesh_0001_cell035_cell007_cell003" position={[-1.11, 0.346, 1.202]}>
          <mesh
            name="Mesh_0001_cell035_cell007_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell007_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell007_cell004" position={[-1.109, 0.363, 1.202]}>
          <mesh
            name="Mesh_0001_cell035_cell007_cell002"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell002.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell007_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell002_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell007_cell005" position={[-1.113, 0.338, 1.182]}>
          <mesh
            name="Mesh_0001_cell035_cell007_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell007_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell007_cell006" position={[-1.115, 0.36, 1.183]}>
          <mesh
            name="Mesh_0001_cell035_cell007_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell007_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell007_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell006_cell" position={[-0.89, 0.341, 1.5]}>
          <mesh
            name="Mesh_0001_cell035_cell006_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell006_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell006_cell001" position={[-0.885, 0.311, 1.511]}>
          <mesh
            name="Mesh_0001_cell035_cell006_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell006_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell006_cell003" position={[-0.869, 0.314, 1.499]}>
          <mesh
            name="Mesh_0001_cell035_cell006_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell006_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell035_cell006_cell004"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell035_cell006_cell004.geometry}
          material={materials.inner}
          position={[-0.904, 0.368, 1.461]}
        />
        <group name="Mesh_0001_cell035_cell006_cell005" position={[-0.925, 0.376, 1.504]}>
          <mesh
            name="Mesh_0001_cell035_cell006_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell006_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell035_cell006_cell007" position={[-0.892, 0.369, 1.501]}>
          <mesh
            name="Mesh_0001_cell035_cell006_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell035_cell006_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell035_cell006_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell069_cell007_cell"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell069_cell007_cell.geometry}
          material={materials.inner}
          position={[-0.731, 1.011, 1.288]}
        />
        <mesh
          name="Mesh_0001_cell069_cell007_cell001"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell069_cell007_cell001.geometry}
          material={materials.inner}
          position={[-0.763, 1.008, 1.287]}
        />
        <group name="Mesh_0001_cell069_cell007_cell004" position={[-0.747, 1.008, 1.292]}>
          <mesh
            name="Mesh_0001_cell069_cell007_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell007_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell007_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell007_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell069_cell005_cell"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell069_cell005_cell.geometry}
          material={materials.inner}
          position={[-0.679, 0.997, 1.341]}
        />
        <mesh
          name="Mesh_0001_cell069_cell005_cell001"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell069_cell005_cell001.geometry}
          material={materials.inner}
          position={[-0.688, 1.009, 1.336]}
        />
        <group name="Mesh_0001_cell069_cell005_cell002" position={[-0.653, 1.009, 1.358]}>
          <mesh
            name="Mesh_0001_cell069_cell005_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell005_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell005_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell005_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell069_cell005_cell003"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell069_cell005_cell003.geometry}
          material={materials['default']}
          position={[-0.678, 0.627, 1.343]}
        />
        <mesh
          name="Mesh_0001_cell069_cell005_cell004"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell069_cell005_cell004.geometry}
          material={materials.inner}
          position={[-0.669, 1, 1.345]}
        />
        <group name="Mesh_0001_cell069_cell005_cell006" position={[-0.682, 1.008, 1.341]}>
          <mesh
            name="Mesh_0001_cell069_cell005_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell005_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell005_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell005_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell005_cell007" position={[-0.666, 1.008, 1.349]}>
          <mesh
            name="Mesh_0001_cell069_cell005_cell005"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell005_cell005.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell005_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell005_cell005_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell001_cell" position={[-0.676, 1.01, 1.296]}>
          <mesh
            name="Mesh_0001_cell069_cell001_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell001_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell001_cell002" position={[-0.621, 1.014, 1.327]}>
          <mesh
            name="Mesh_0001_cell069_cell001_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell001_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell069_cell001_cell004"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell069_cell001_cell004.geometry}
          material={materials.inner}
          position={[-0.694, 0.999, 1.3]}
        />
        <group name="Mesh_0001_cell069_cell001_cell005" position={[-0.662, 1.006, 1.312]}>
          <mesh
            name="Mesh_0001_cell069_cell001_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell001_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell001_cell007" position={[-0.655, 1.013, 1.344]}>
          <mesh
            name="Mesh_0001_cell069_cell001_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell001_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell001_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell_cell002" position={[-0.713, 1.005, 1.308]}>
          <mesh
            name="Mesh_0001_cell069_cell_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell_cell003" position={[-0.708, 1.007, 1.295]}>
          <mesh
            name="Mesh_0001_cell069_cell_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell_cell004" position={[-0.693, 0.996, 1.322]}>
          <mesh
            name="Mesh_0001_cell069_cell_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell069_cell_cell006" position={[-0.702, 0.976, 1.317]} />
        <group name="Mesh_0001_cell069_cell_cell007" position={[-0.703, 1, 1.324]}>
          <mesh
            name="Mesh_0001_cell069_cell_cell005"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell005.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell069_cell_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell069_cell_cell005_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell006_cell005_cell" position={[0.693, 3.053, -1.203]} />
        <group name="Mesh_0001_cell006_cell005_cell002" position={[0.694, 3.052, -1.196]}>
          <mesh
            name="Mesh_0001_cell006_cell005_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell005_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell005_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell005_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell006_cell005_cell003" position={[0.697, 3.041, -1.186]} />
        <mesh
          name="Mesh_0001_cell006_cell005_cell004"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell006_cell005_cell004.geometry}
          material={materials.inner}
          position={[0.693, 3.057, -1.188]}
        />
        <group name="Mesh_0001_cell006_cell005_cell005" position={[0.694, 3.048, -1.189]}>
          <mesh
            name="Mesh_0001_cell006_cell005_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell005_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell005_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell005_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell006_cell004_cell" position={[0.692, 3.042, -1.196]} />
        <group name="Mesh_0001_cell006_cell004_cell002" position={[0.69, 3.038, -1.191]}>
          <mesh
            name="Mesh_0001_cell006_cell004_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell004_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell004_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell004_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell006_cell004_cell003" position={[0.692, 3.036, -1.185]}>
          <mesh
            name="Mesh_0001_cell006_cell004_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell004_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell004_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell004_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell006_cell004_cell006" position={[0.69, 3.041, -1.183]} />
        <group name="Mesh_0001_cell006_cell002_cell001" position={[0.696, 3.06, -1.182]}>
          <mesh
            name="Mesh_0001_cell006_cell002_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell002_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell002_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell002_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell006_cell002_cell002" position={[0.697, 3.05, -1.177]}>
          <mesh
            name="Mesh_0001_cell006_cell002_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell002_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell002_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell002_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell006_cell002_cell003" position={[0.695, 3.042, -1.18]}>
          <mesh
            name="Mesh_0001_cell006_cell002_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell002_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell002_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell002_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell006_cell002_cell007"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell006_cell002_cell007.geometry}
          material={materials['default']}
          position={[0.697, 2.688, -1.179]}
        />
        <group name="Mesh_0001_cell006_cell_cell" position={[0.697, 3.067, -1.204]} />
        <mesh
          name="Mesh_0001_cell006_cell_cell001"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell006_cell_cell001.geometry}
          material={materials.inner}
          position={[0.696, 3.066, -1.192]}
        />
        <mesh
          name="Mesh_0001_cell006_cell_cell002"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell006_cell_cell002.geometry}
          material={materials.inner}
          position={[0.696, 3.061, -1.205]}
        />
        <group name="Mesh_0001_cell006_cell_cell004" position={[0.698, 3.074, -1.194]}>
          <mesh
            name="Mesh_0001_cell006_cell_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell006_cell_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell006_cell_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell007_cell" position={[0.723, 1.04, -1.241]}>
          <mesh
            name="Mesh_0001_cell007_cell007_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell007_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell007_cell002" position={[0.755, 1.027, -1.256]}>
          <mesh
            name="Mesh_0001_cell007_cell007_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell007_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell007_cell003" position={[0.783, 1.018, -1.291]}>
          <mesh
            name="Mesh_0001_cell007_cell007_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell007_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell007_cell004" position={[0.804, 1, -1.283]}>
          <mesh
            name="Mesh_0001_cell007_cell007_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell007_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell007_cell007_cell005"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell007_cell007_cell005.geometry}
          material={materials.inner}
          position={[0.735, 1.013, -1.251]}
        />
        <mesh
          name="Mesh_0001_cell007_cell007_cell006"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell007_cell007_cell006.geometry}
          material={materials.inner}
          position={[0.773, 1.005, -1.268]}
        />
        <group name="Mesh_0001_cell007_cell007_cell007" position={[0.737, 1.034, -1.279]}>
          <mesh
            name="Mesh_0001_cell007_cell007_cell006_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell006_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell007_cell006_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell007_cell006_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell004_cell" position={[0.802, 1.027, -1.155]}>
          <mesh
            name="Mesh_0001_cell007_cell004_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell004_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell007_cell004_cell002"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell007_cell004_cell002.geometry}
          material={materials.inner}
          position={[0.734, 0.984, -1.193]}
        />
        <group name="Mesh_0001_cell007_cell004_cell004" position={[0.819, 0.997, -1.23]}>
          <mesh
            name="Mesh_0001_cell007_cell004_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell004_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell004_cell005" position={[0.749, 1.007, -1.234]}>
          <mesh
            name="Mesh_0001_cell007_cell004_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell004_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell004_cell006" position={[0.776, 1.019, -1.21]}>
          <mesh
            name="Mesh_0001_cell007_cell004_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell004_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell007_cell004_cell007" position={[0.741, 1.024, -1.178]}>
          <mesh
            name="Mesh_0001_cell007_cell004_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell005_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell007_cell004_cell005_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell007_cell004_cell005_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell007_cell001" position={[-1.657, 0.903, -0.85]}>
          <mesh
            name="Mesh_0001_cell010_cell007_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell007_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell007_cell002" position={[-1.636, 0.923, -0.782]}>
          <mesh
            name="Mesh_0001_cell010_cell007_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell007_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell007_cell003" position={[-1.624, 0.908, -0.893]}>
          <mesh
            name="Mesh_0001_cell010_cell007_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell007_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell007_cell004" position={[-1.621, 0.923, -0.87]}>
          <mesh
            name="Mesh_0001_cell010_cell007_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell007_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell007_cell006" position={[-1.655, 0.904, -0.769]}>
          <mesh
            name="Mesh_0001_cell010_cell007_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell007_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell007_cell007" position={[-1.657, 0.935, -0.833]}>
          <mesh
            name="Mesh_0001_cell010_cell007_cell005"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell005.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell007_cell005_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell007_cell005_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell006_cell" position={[-1.626, 0.919, -0.689]}>
          <mesh
            name="Mesh_0001_cell010_cell006_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell006_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell010_cell006_cell001"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell010_cell006_cell001.geometry}
          material={materials.inner}
          position={[-1.584, 0.937, -0.727]}
        />
        <group name="Mesh_0001_cell010_cell006_cell002" position={[-1.622, 0.913, -0.718]}>
          <mesh
            name="Mesh_0001_cell010_cell006_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell006_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell006_cell003" position={[-1.599, 0.952, -0.709]}>
          <mesh
            name="Mesh_0001_cell010_cell006_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell006_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell006_cell005" position={[-1.615, 0.937, -0.716]}>
          <mesh
            name="Mesh_0001_cell010_cell006_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell006_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell006_cell006" position={[-1.629, 0.907, -0.675]}>
          <mesh
            name="Mesh_0001_cell010_cell006_cell004"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell004.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell006_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell006_cell004_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell010_cell006_cell007"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell010_cell006_cell007.geometry}
          material={materials.inner}
          position={[-1.564, 0.941, -0.727]}
        />
        <group name="Mesh_0001_cell010_cell004_cell" position={[-1.558, 0.955, -0.659]}>
          <mesh
            name="Mesh_0001_cell010_cell004_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell004_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell004_cell001" position={[-1.533, 0.959, -0.715]}>
          <mesh
            name="Mesh_0001_cell010_cell004_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell004_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell004_cell002" position={[-1.599, 0.935, -0.634]}>
          <mesh
            name="Mesh_0001_cell010_cell004_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell004_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell004_cell005" position={[-1.582, 0.953, -0.601]}>
          <mesh
            name="Mesh_0001_cell010_cell004_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell004_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell004_cell006" position={[-1.596, 0.946, -0.684]}>
          <mesh
            name="Mesh_0001_cell010_cell004_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell004_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell004_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell010_cell004_cell007"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell010_cell004_cell007.geometry}
          material={materials.inner}
          position={[-1.564, 0.948, -0.609]}
        />
        <group name="Mesh_0001_cell010_cell003_cell" position={[-1.624, 0.898, -0.904]}>
          <mesh
            name="Mesh_0001_cell010_cell003_cell007"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell007.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell003_cell007_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell007_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell003_cell001" position={[-1.613, 0.905, -0.908]}>
          <mesh
            name="Mesh_0001_cell010_cell003_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell003_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell010_cell003_cell002"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell010_cell003_cell002.geometry}
          material={materials.inner}
          position={[-1.602, 0.91, -0.894]}
        />
        <group name="Mesh_0001_cell010_cell003_cell004" position={[-1.602, 0.909, -0.911]}>
          <mesh
            name="Mesh_0001_cell010_cell003_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell003_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell003_cell005" position={[-1.61, 0.91, -0.903]}>
          <mesh
            name="Mesh_0001_cell010_cell003_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell003_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell003_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell002_cell" position={[-1.582, 0.931, -0.905]}>
          <mesh
            name="Mesh_0001_cell010_cell002_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell002_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell002_cell001" position={[-1.595, 0.916, -0.905]}>
          <mesh
            name="Mesh_0001_cell010_cell002_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell002_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell002_cell003" position={[-1.543, 0.948, -0.881]}>
          <mesh
            name="Mesh_0001_cell010_cell002_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell002_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell010_cell002_cell004"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell010_cell002_cell004.geometry}
          material={materials.inner}
          position={[-1.611, 0.925, -0.908]}
        />
        <group name="Mesh_0001_cell010_cell002_cell006" position={[-1.565, 0.941, -0.886]}>
          <mesh
            name="Mesh_0001_cell010_cell002_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell002_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell002_cell007" position={[-1.551, 0.939, -0.916]}>
          <mesh
            name="Mesh_0001_cell010_cell002_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell002_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell002_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell001_cell" position={[-1.589, 0.935, -0.548]}>
          <mesh
            name="Mesh_0001_cell010_cell001_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell001_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell001_cell001" position={[-1.547, 0.959, -0.568]}>
          <mesh
            name="Mesh_0001_cell010_cell001_cell009"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell009.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell001_cell009_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell009_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell001_cell002" position={[-1.562, 0.954, -0.581]}>
          <mesh
            name="Mesh_0001_cell010_cell001_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell001_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell001_cell003" position={[-1.585, 0.941, -0.575]}>
          <mesh
            name="Mesh_0001_cell010_cell001_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell001_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell001_cell004" position={[-1.571, 0.948, -0.533]}>
          <mesh
            name="Mesh_0001_cell010_cell001_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell001_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell010_cell001_cell006" position={[-1.599, 0.936, -0.585]}>
          <mesh
            name="Mesh_0001_cell010_cell001_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell010_cell001_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell010_cell001_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell004_cell002" position={[-0.654, 1.704, 1.74]}>
          <mesh
            name="Mesh_0001_cell011_cell004_cell001"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004_cell001.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell004_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004_cell001_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell004_cell004" position={[-0.641, 1.707, 1.773]}>
          <mesh
            name="Mesh_0001_cell011_cell004_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell004_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell004_cell005" position={[-0.639, 1.721, 1.793]}>
          <mesh
            name="Mesh_0001_cell011_cell004_cell003"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004_cell003.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell004_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell004_cell003_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell_cell001" position={[-0.635, 1.686, 1.747]}>
          <mesh
            name="Mesh_0001_cell011_cell_cell008"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell008.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell_cell008_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell008_1.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell_cell002" position={[-0.644, 1.675, 1.712]}>
          <mesh
            name="Mesh_0001_cell011_cell_cell001_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell001_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell_cell001_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell001_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell_cell003" position={[-0.627, 1.649, 1.701]}>
          <mesh
            name="Mesh_0001_cell011_cell_cell002_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell002_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell_cell002_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell002_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell_cell004" position={[-0.629, 1.616, 1.665]}>
          <mesh
            name="Mesh_0001_cell011_cell_cell003_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell003_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell_cell003_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell003_2.geometry}
            material={materials.inner}
          />
        </group>
        <group name="Mesh_0001_cell011_cell_cell006" position={[-0.651, 1.67, 1.677]}>
          <mesh
            name="Mesh_0001_cell011_cell_cell004_1"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell004_1.geometry}
            material={materials['default']}
          />
          <mesh
            name="Mesh_0001_cell011_cell_cell004_2"
            castShadow
            receiveShadow
            geometry={nodes.Mesh_0001_cell011_cell_cell004_2.geometry}
            material={materials.inner}
          />
        </group>
        <mesh
          name="Mesh_0001_cell011_cell_cell007"
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0001_cell011_cell_cell007.geometry}
          material={materials.inner}
          position={[-0.636, 1.699, 1.717]}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/bust.glb')
export default Bust