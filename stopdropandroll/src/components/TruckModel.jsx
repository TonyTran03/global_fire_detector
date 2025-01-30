import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export function TruckModel() {
  const groupRef = useRef();
  let bounceTime = 0;

  // Set initial rotation and position on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI * 2 + Math.PI / 16; // Full rotation around Y-axis
      groupRef.current.rotation.z = Math.PI * 2 + Math.PI / 20; // Full rotation around Z-axis
      groupRef.current.rotation.x = Math.PI * 2 - Math.PI / 26; // Full rotation around X-axis

      groupRef.current.position.y += 15; // Adjust Y position
      groupRef.current.position.z -= 4; // Adjust Z position
      groupRef.current.position.x += 2; // Adjust Z position
    }
  }, []);

  // Animate bounce and rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      bounceTime += delta;

      groupRef.current.rotation.y = Math.sin(bounceTime) * 0.1; // Bounce up and down

      groupRef.current.position.y = -2 + Math.sin(bounceTime * 3) * 0.4; // Bounce up and down
    }
  });

  // Load the truck model
  const { scene } = useGLTF("/models/firetwuck.glb");

  return (
    <group ref={groupRef} className="overflow-visible">
      <primitive object={scene} scale={1.6} position={[-2, -1, -0.2]} />
    </group>
  );
}
