// ModelLoader.tsx
import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelLoaderProps {
  scene: THREE.Scene;
  // controls: OrbitControls
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ scene }) => {
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/ferrari.glb', // Path to your GLB model
      (gltf) => {
        const model = gltf.scene;

        // Resize the model (scaling it down)
        model.scale.set(24, 24, 24); // Adjust these values to resize

        // Optional: Adjust position if needed
        model.position.set(0, 4, 0);

        // Add the model to the scene
        scene.add(model);
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
