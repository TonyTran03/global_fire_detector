import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export function TruckModel() {
  const groupRef = useRef();
  let bounceTime = 0;

  // Set initial rotation and position on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI * 2; // Full rotation around Y-axis
      groupRef.current.rotation.z = Math.PI * 2; // Full rotation around Z-axis
      groupRef.current.rotation.x = Math.PI * 2; // Full rotation around X-axis
      groupRef.current.position.y += 15; // Adjust Y position
      groupRef.current.position.z -= 4; // Adjust Z position
    }
  }, []);

  // Animate bounce and rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      bounceTime += delta;

      groupRef.current.rotation.y = Math.sin(bounceTime * 2) * 0.5; // Oscillate rotation on Y-axis
      groupRef.current.position.y = -2 + Math.sin(bounceTime * 3) * 0.2; // Bounce up and down
    }
  });

  // Load the truck model
  const { scene } = useGLTF('/models/Firetwuck.glb');

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={0.8} position={[0, -2, -0.2]} />
    </group>
  );
}
