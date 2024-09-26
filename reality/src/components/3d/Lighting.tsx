import { useEffect } from 'react';
import * as THREE from 'three';

interface LightingProps {
  scene: THREE.Scene;
}

const Lighting: React.FC<LightingProps> = ({ scene }) => {
  useEffect(() => {

    const directionalLightOne = new THREE.DirectionalLight(0xffffff, 3);
    directionalLightOne.position.set(1, 1, 1);
    const directionalLightTwo = new THREE.DirectionalLight(0x002288, 3);
    directionalLightOne.position.set(-1, -1, -1);

    scene.add(directionalLightOne);
    scene.add(directionalLightTwo);
    const ambientLight = new THREE.AmbientLight(0x555555);

    scene.add(ambientLight);

    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    // hemiLight.position.set(0, 20, 0);
    // scene.add(hemiLight);


    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLightOne);
      scene.remove(directionalLightTwo);
    };
  }, [scene]);

  return null;
};

export default Lighting;
