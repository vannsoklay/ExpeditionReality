// src/3d/ModelLoader.tsx
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelLoaderProps {
  scene: THREE.Scene;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ scene }) => {
  useEffect(() => {
    const loader = new GLTFLoader();

    // Load the GLTF model
    loader.load(
      '/assets/models/sampleModel.glb',
      (gltf: GLTF) => {
        scene.add(gltf.scene); // Add the loaded scene to the main scene
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error); // Log an error if loading fails
      }
    );

    return () => {
      scene.clear(); // Clean up the scene when the component is unmounted
    };
  }, [scene]);

  return null;
};

export default ModelLoader;
