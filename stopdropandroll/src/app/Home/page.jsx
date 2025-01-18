import React, { Suspense } from 'react';
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

   return <primitive object={scene} scale={1} position={[0, -2.2, -0.2]} />;
}

function WoodModel() {
   const { scene } = useGLTF('/models/betterwood.glb');
   return <primitive object={scene} scale={0.75} position={[0, -2, 0]} />;
}

export default function HomePage() {
   return (
       <div className="relative flex w-screen h-screen bg-gradient-to-b from-[#4a3904] via-[#913410] to-[#000000] flex-col lg:flex-row items-center justify-center overflow-hidden">
           {/* Text Section */}
           <div className="relative z-10 text-center lg:text-left text-white font-sans lg:w-1/2 p-8 lg:pl-20">
               <h1 className="text-4xl lg:text-7xl font-extrabold mb-6 animate-fade-in">
                   Global Fire Detector
               </h1>
               <p className="text-lg lg:text-2xl leading-relaxed">
                   Harnessing the power of technology to visualize and detect wildfires in real time. Stay
                   informed and protect the planet.
               </p>
               <button className="mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-lg shadow-lg transition-all duration-300">
                   Learn More
               </button>
           </div>

           {/* Canvas Section */}
           <div className="relative z-10 lg:w-1/2 flex flex-col justify-center items-center">
               <Suspense fallback={<div>Loading 3D Model...</div>}>
                   <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                       <ambientLight intensity={1.5} />
                       <directionalLight position={[5, 10, 5]} intensity={2} />
                       <group>
                           <WoodModel />
                           <FireModel progress={0} />
                       </group>
                   </Canvas>
               </Suspense>
           </div>
       </div>
   );
}
