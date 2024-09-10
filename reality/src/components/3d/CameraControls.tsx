import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CameraControlsProps {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

const CameraControls: React.FC<CameraControlsProps> = ({ camera, renderer }) => {
  useEffect(() => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      controls.dispose();
      window.removeEventListener('resize', onResize);
    };
  }, [camera, renderer]);

  return null;
};

export default CameraControls;