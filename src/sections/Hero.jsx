import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect } from 'react'
import CanvasLoader from '../components/CanvasLoader'
import { Leva, useControls } from 'leva'
import { useMediaQuery } from 'react-responsive'
import Target from '../components/Target'
import { calculateSizes } from '../constants'
import ReaactLogo from '../components/ReaactLogo'
import WalkingRobot from '../components/WalkingRobot'
import Rings from '../components/Rings'
import HeroCamera from '../components/HeroCamera'
import Cube from '../components/Cube'
import Button from '../components/Button'
import Bust from '../components/Bust'
import { useState } from 'react'
import { useThree } from '@react-three/fiber'
import { SpotLightHelper } from 'three';
import useSectionVisible from '../hooks/useSectionVisible'
import useStore from '../hooks/store'
import { useRef } from 'react'
import Graph from '../components/Graph'
import DancingDot from '../components/DancingDot'
import AutoTriggerController from '../components/AutoTriggerController'
import Explosion from '../components/Explosion'
import { useFrame } from '@react-three/fiber'
import Overlay from '../components/Overlay'
// if chosen different model, to change the position, rotation and scale of the model, use the controls below
// video timeline start from 2:00:00
const Hero = () => {
    const isMobile = useMediaQuery({maxWidth: 768})
    const isTablet = useMediaQuery({maxWidth: 1024})
    const isSmall = useMediaQuery({maxWidth: 440})
    const sizes = calculateSizes(isSmall,isMobile,isTablet)
    const [trigger, setTrigger] = useState(false);
    const [mousePos, setMousePos] = useState([0, 0]);
    const clicked = useStore((state) => state.clicked);
    const loadAudio = useStore((state) => state.api.loaded);
    const startAudio = useStore((state) => state.api.start);
    const isHeroVisible = useSectionVisible('home')
    
    const audio = useStore((state) => state.audio)
    const [resetKey, setResetKey] = useState(0);
    const stopAudio = useStore((state) => state.api.stop);
    const [autoBeat, setAutoBeat] = useState(true); // new
    const [explosionKey, setExplosionKey] = useState(0);
    useEffect(() => {
        loadAudio(); // Preloads the 3 MP3s
    }, []);
    const handlePointerMove = (e) => {
    setMousePos([e.clientX, e.clientY]);
    };
    const handleClick = () => {
        const api = useStore.getState().api;
            if (!clicked) {
                api.click(true);
                startAudio();
                setAutoBeat(true);
                setExplosionKey(prev => prev + 1); // Update key
            } else {
                stopAudio();
                api.click(false);
                setAutoBeat(false);
                setTrigger(false);
                setExplosionKey(prev => prev + 1); // Update key again
            }
    };



    useEffect(() => {
        if (!audio || !audio.drums || !audio.snare || !audio.synth) return;

        if (!isHeroVisible && clicked) {
            console.log("Hero out of view — resetting...");
            stopAudio();
            setAutoBeat(false);
            setTrigger(false);
            useStore.getState().api.click(false);
            setResetKey(prev => prev + 1); // force re-mount
        }
    }, [isHeroVisible]);




    
  return (
    <section id="home" className='min-h-screen w-full flex flex-col relative'>
        <Overlay />
        {/* Intro Section */}
        <div className='w-full mx-auto flex flex-col sm:mt-30 mt-20 c-space gap-3'>
            {/* waving-hand working given in index.css */}
            <p className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans"> Hi, I am Malhar <span className='waving-hand'> 👋 </span></p>
            <p className="hero_tag text-gray_gradient">Driven by Code, Inspired by Innovation</p>
        </div>
        {/* Model with Three.js  */}
        <div className="w-full h-full absolute inset-0">
            <Leva />
            <Canvas className='w-full h-full' onPointerMove={handlePointerMove}
            onClick={handleClick}>
            <Suspense fallback={<CanvasLoader />}>
                <spotLight
                    position={[mousePos[0] / 100 - 5, -mousePos[1] / 100 + 5, 5]}
                    intensity={1}
                    angle={0.3}
                    penumbra={1}
                    color="white">
                        <PerspectiveCamera makeDefault position={[0, 3, 25]} />
                        <HeroCamera isMobile={isMobile}>
                            <Graph position={[-12, -8, -12]} scale={12} rotation={[-Math.PI / 6, -Math.PI / 6, 0]}/>
                            <DancingDot />
                            <AutoTriggerController autoBeat={autoBeat} setTrigger={setTrigger} />
                            
                            <React.Fragment key={resetKey}>
                            <Bust
                                position={[0.2, isMobile ? -7.5 : -9, 0.7]} // moved slightly right
                                rotation={[-0.3, -2, 0]} 
                                scale={isMobile ? 1.5 : 2}
                                trigger={trigger}
                            />
                            <Explosion key={`explosion-${explosionKey}-0`} position={[0.2, -1, 0]} beat={0} />
                            <Explosion key={`explosion-${explosionKey}-1`} position={[-0.3, -3, -1]} beat={1} />


                            </React.Fragment>

                        </HeroCamera>
                        
                        <ambientLight intensity={1} />
                        <directionalLight position={[10, 10, 10]} intensity={0.5} />
                    </spotLight>
                </Suspense>
            </Canvas>
        </div>
        {/* <div className="absolute bottom-7 left-0 right-0 w-full z-10 c-space mt-20">
            <a href="#about" className="w-fit">
            <Button name="Let's work together" isBeam containerClass="sm:w-fit w-full sm:min-w-96" />
            </a>
        </div> */}
    </section>
  )
}

export default Hero