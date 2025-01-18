import React from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

export default function FireModel({ progress }) {
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
  }, [actions, progress]);

  return <primitive object={scene} scale={1} position={[0, -2.2, -0.2]} />;
}
