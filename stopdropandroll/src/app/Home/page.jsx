'use client';
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

function FireModel({ progress }) {
   const { scene, animations } = useGLTF('/models/betterflame7.glb');
   const { actions } = useAnimations(animations, scene);

   React.useEffect(() => {
       if (actions) {
           if (progress >= 1) {
               Object.values(actions).forEach((action) => action.stop());
           } else {
               Object.values(actions).forEach((action) => action.play());
           }
       }
   }, [actions, progress]);

   return <primitive object={scene} scale={0.8} position={[0, -2, -0.2]} />;
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import NoiseBackground from '@/components/NoiseBackground';


function TruckModel() {
  const groupRef = useRef();
  let bounceTime = 0;

  useEffect(() => {
      if (groupRef.current) {
          // Set initial rotation
          groupRef.current.rotation.y = Math.PI*2  ; // 60 degrees
          groupRef.current.rotation.z = Math.PI*2 ; 
          groupRef.current.position.y +=1; 
          groupRef.current.position.z -=4; 
      }
  }, []); // Runs only once after the component mounts

  useFrame((state, delta) => {
      if (groupRef.current) {
          bounceTime += delta;

          groupRef.current.rotation.y = Math.sin(bounceTime * 2) * 0.1; // Rotate around Y axis
      
          groupRef.current.position.y = -2 + Math.sin(bounceTime * 3) * 0.2; 
      }
  });

  const { scene } = useGLTF('/models/Firetwuck.glb');
  return (
      <group ref={groupRef}>
          <primitive object={scene} scale={0.8} position={[0, -2, -0.2]} />
      </group>
  );
}
function WoodModel() {
   const { scene } = useGLTF('/models/betterwood.glb');
   return <primitive object={scene} scale={0.75} position={[0, -2, 0]} />;
}

export default function HomePage() {
   return (
    <div className="relative outline-2 flex flex-col lg:flex-row items-center justify-center w-screen h-screen ">
    {/* Text Section */}
    <NoiseBackground />
    <div className="relative z-10 font-poppinsl text-center lg:text-left text-white flex-1 hero-gradient font-sans w-full lg:w-1/2 px-8 py-4">        <h1 className="text-3xl font-Poppins sm:text-4xl lg:text-6xl font-extrabold mb-4 animate-fade-in leading-tight">
            Global Fire Detector
        </h1>
        <p className="text-base font-poppins sm:text-lg lg:text-xl leading-relaxed">
            Harnessing the power of technology to visualize and detect wildfires in real time.
            Stay informed and protect the planet.
        </p>

    </div>

    {/* Canvas Section */}
    <div className="relative z-10 w-full lg:w-1/2 flex justify-center items-center h-1/2 lg:h-screen">
        <Suspense fallback={<div>Loading 3D Model...</div>}>
            <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 10, 5]} intensity={2} />
                <TruckModel />
            </Canvas>
        </Suspense>
    </div>
</div>

   );
}
