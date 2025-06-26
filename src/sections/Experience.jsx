import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import WalkingRobot from '../components/WalkingRobot.jsx';
import CanvasLoader from '../components/CanvasLoader.jsx'; // You already used it in Hero
import { workExperiences } from '../constants/index.js';

const WorkExperience = () => {
  const [animationName, setAnimationName] = useState('idle');

  return (
    <section className="c-space my-20" id="work">
      <div className="w-full text-white-600">
        <p className="head-text">My Work Experience</p>

        <div className="work-container">
          {/* Robot Replaces Avatar */}
          <div className="work-canvas">
            <Canvas>
              <ambientLight intensity={1} />
              <directionalLight position={[5, 5, 5]} intensity={0.5} />
              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />

              <Suspense fallback={<CanvasLoader />}>
                <WalkingRobot
                  position={[0, -2.3, 0]}   // Fine-tune this for layout
                  rotation={[0, 0.25, 0]}  // Slight rotation for nice pose
                  scale={1}                // Adjust size
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Work Experience Text Block */}
          <div className="work-content">
            <div className="sm:py-10 py-5 sm:px-5 px-2.5">
              {workExperiences.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setAnimationName(item.animation?.toLowerCase?.() || 'idle')}
                    onPointerOver={() => setAnimationName(item.animation?.toLowerCase?.() || 'idle')}
                    onPointerOut={() => setAnimationName('idle')}
                    className="group flex flex-col sm:flex-row w-full h-full min-h-[400px] bg-[#1a1a1a] rounded-xl shadow-lg transition-all duration-500"
                  >

                  <div className="flex flex-col h-full justify-start items-center py-2">
                    <div className="work-content_logo">
                      <img className="w-20 h-20 object-contain" src={item.icon} alt={item.name} />
                    </div>
                    <div className="work-content_bar" />
                  </div>

                  <div className="sm:p-5 px-2.5 py-5">
                    <p className="font-bold text-white-800">{item.name}</p>
                    <p className="text-sm mb-5">
                      {item.pos} -- <span>{item.duration}</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      {item.title.map((point, i) => (
                        <li
                          key={i}
                          className="text-white/80 group-hover:text-white transition-all ease-in-out duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                          style={{ transitionDelay: `${i * 100}ms` }}
                        >
                          {point}
                        </li>
                      ))}
                    </ul>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
