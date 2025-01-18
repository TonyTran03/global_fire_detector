'use client';
import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <Canvas camera={{ fov: isMobile ? 160 : 150 }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[0, 0, 0]} />
        <pointLight position={[-10, -10, -10]} />
        hello
      </Canvas>
    </>
  );
}
