'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

function FireModel({ progress }) {
  const { scene, animations } = useGLTF('/models/betterflame7.glb'); // Fire model path
  const { actions } = useAnimations(animations, scene);

  React.useEffect(() => {
    if (actions) {
      if (progress >= 1) {
        Object.values(actions).forEach((action) => action.stop());
      } else {
        Object.values(actions).forEach((action) => action.play());
      }
    }
  }, [ actions]);

  return (
    <primitive
      object={scene}
      scale={[1 - progress * 0.8, 1 - progress * 0.8, 1 - progress * 0.8]}
      position={[0, -2.2, 0.5]}
    />
  );
}

function WoodModel() {
  const { scene } = useGLTF('/models/betterwood.glb'); // Wood model path
  return <primitive object={scene} scale={0.5} position={[0, -2, 0]} />;
}

export default function HomePage() {
  const [progress, setProgress] = useState(0);

  const handleScroll = (e) => {
    const maxScroll = 500;
    const newProgress = Math.min(e.target.scrollTop / maxScroll, 1);
    setProgress(newProgress);
  };

  return (
    <div className="relative w-screen h-screen bg-gray-900">
      {/* Overlay Text */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Global Fire Detector</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '40%' }}>
          Harnessing the power of technology to visualize and detect wildfires in real time. Stay
          informed and protect the planet.
        </p>
      </div>

      {/* Canvas Section */}
      <div
  style={{
    position: 'absolute',
    bottom: '20%', // Adjust to give more room for the fire
    right: '10%',
    width: '30%',
    height: '20%', // Increase height for more space
  }}
>
  <Canvas camera={{ position: [0, 2, 5], fov: 40 }}>
    <ambientLight intensity={2} />
    <directionalLight position={[5, 10, 5]} intensity={1.5} />
    <group>
      <WoodModel />
      <FireModel progress={progress} />
    </group>
  </Canvas>
</div>

    </div>
  );
}
