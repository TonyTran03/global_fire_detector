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
import { TruckModel } from '@/components/TruckModel';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';



function WoodModel() {
   const { scene } = useGLTF('/models/betterwood.glb');
   return <primitive object={scene} scale={0.75} position={[0, -2, 0]} />;
}

export default function HomePage() {
  return (
    <div className="relative flex flex-col lg:flex-row justify-center w-screen h-screen">
      {/* Text Section */}
      <NoiseBackground />
      <div className="relative z-10 basis-2/3 lg:basis-2/3 grow font-poppinsl text-center lg:text-left text-white font-sans px-8 py-4 flex flex-col justify-center items-center lg:items-start">
        {/* Hero Video Dialog */}
        <div className="w-full max-w-md lg:max-w-lg mb-6">
          <HeroVideoDialog
            className="dark:hidden block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </div>

        {/* Title and Description */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">
          Global Fire Detector
        </h1>
        <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-8">
          Complex Machine Learning Algorithm to Detect Wildfires in Real Time.
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">
            Learn More
          </button>
          <button className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition">
            Register Now
          </button>
        </div>
      </div>

      {/* Canvas Section */}
      <div className="relative z-10 basis-1/3 lg:basis-1/3 flex justify-center items-center h-1/2 lg:h-screen">
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


