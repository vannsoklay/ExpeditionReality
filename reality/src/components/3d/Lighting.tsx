import { useEffect } from 'react';
import * as THREE from 'three';

interface LightingProps {
  scene: THREE.Scene;
}

const Lighting: React.FC<LightingProps> = ({ scene }) => {
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(ambientLight);
    scene.add(directionalLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene]);

  return null;
};

export default Lighting;
