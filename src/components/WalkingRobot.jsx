import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
const WalkingRobot = (props) => {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/robot-draco.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions?.["ArmatureAction"]) {
      actions["ArmatureAction"].play()
    } else {
      const first = Object.values(actions)[0]
      if (first) first.play()
    }
  }, [actions])

  return (
    <group ref={group} dispose={null}>
      {/* Apply props here so it affects the entire robot model */}
      <group {...props}>
        <group name="Root_Scene">
          <group name="RootNode">
            <group name="RobotArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <primitive object={nodes.Bone} />
            </group>
            <group
              name="HandR"
              position={[-0.003, 2.37, -0.021]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={100}>
              <skinnedMesh
                name="HandR_1"
                geometry={nodes.HandR_1.geometry}
                material={materials.Main}
                skeleton={nodes.HandR_1.skeleton}
              />
              <skinnedMesh
                name="HandR_2"
                geometry={nodes.HandR_2.geometry}
                material={materials.Grey}
                skeleton={nodes.HandR_2.skeleton}
              />
            </group>
            <group
              name="HandL"
              position={[-0.003, 2.37, -0.021]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={100}>
              <skinnedMesh
                name="HandL_1"
                geometry={nodes.HandL_1.geometry}
                material={materials.Main}
                skeleton={nodes.HandL_1.skeleton}
              />
              <skinnedMesh
                name="HandL_2"
                geometry={nodes.HandL_2.geometry}
                material={materials.Grey}
                skeleton={nodes.HandL_2.skeleton}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}


useGLTF.preload('/models/robot-draco.glb')
export default WalkingRobot
