import { useGLTF } from "@react-three/drei";

function Campfire() {
  const fire = useGLTF("/betterflame.glb");
  const wood = useGLTF("/betterwood.glb");

  return (
    <group>
      <primitive object={wood.scene} position={[0, 0, 0]} />
      <primitive object={fire.scene} emissive="orange" emissiveIntensity={2.5}  position={[0, 1, 0]} />
    </group>
  );
}
