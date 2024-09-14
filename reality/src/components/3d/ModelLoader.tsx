// ModelLoader.tsx
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelLoaderProps {
  scene: THREE.Scene;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ scene }) => {
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/lanceModel.glb', // Path to your GLB model
      (gltf) => {
        // Add the loaded model to the scene
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Cleanup on component unmount
    return () => {
      scene.clear(); // Clears the scene
    };
  }, [scene]);

  return null;
};

export default ModelLoader;
