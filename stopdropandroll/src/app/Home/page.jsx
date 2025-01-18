'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import  WoodModel  from './WoodModel';
import FireModel  from './FireModel';

export default function HomePage() {
  return (
    <div className="relative flex w-screen h-screen bg-gradient-to-b from-[#4a3904] via-[#913410] to-[#000000] flex-col lg:flex-row items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-orange-500 opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-yellow-400 opacity-20 blur-3xl animate-pulse delay-2000" />
      </div>

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
        <div className="w-full h-20 mb-4 bg-gray-700 rounded-lg flex justify-center items-center text-white">
          <span className="text-lg font-bold">Placeholder for New Component</span>
        </div>

        <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} />
          <group>
            <WoodModel />
            <FireModel progress={0.5} />
          </group>
        </Canvas>
      </div>
    </div>
  );
}
