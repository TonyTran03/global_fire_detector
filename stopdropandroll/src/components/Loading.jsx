import React from 'react';
import { Canvas } from '@react-three/fiber';
import { TruckModel } from './TruckModel';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <TruckModel />
      </Canvas>
      <p className="absolute bottom-10 text-lg">Loading...</p>
    </div>
  );
}
