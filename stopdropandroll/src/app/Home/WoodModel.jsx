import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function WoodModel() {
  const { scene } = useGLTF('./models/betterwood.glb');

  return <primitive object={scene} scale={0.75} position={[0, -2, 0]} />;
}
