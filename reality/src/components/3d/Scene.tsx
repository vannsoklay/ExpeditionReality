// src/3d/Scene.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CameraControls from './CameraControls';
import Lighting from './Lighting';
import ModelLoader from './ModelLoader';
import CharacterController from '@controllers/CharacterController';
import useKeyboardControls from '@hooks/useKeyboardControls';
import { World, Body, Box, Vec3 } from 'cannon-es';
import Physics from './Physics';
import MapperController from '@controllers/MapperController';


const Scene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 800)
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));

  const characterBodyRef = useRef<Body | null>(null);

  const characterRef = useRef(new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  ));

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const { current: scene } = sceneRef;
    const { current: camera } = cameraRef;
    const { current: renderer } = rendererRef;

    const character = characterRef.current;

    if (!mountRef.current) return;

    character.name = 'box'; // Name the object to sync with the physics body
    scene.add(character);

    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    camera.position.set(0.1, 0.1, 0.5);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // useKeyboardControls(characterRef.current);

    // Start the animation loop
    animate();

    // Handle window resize
    const onResize = () => {
      // Update camera aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Update renderer size
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Clean up when component unmounts
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        window.removeEventListener('resize', onResize);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '98vh', overflow: 'hidden' }}>
      <CameraControls camera={cameraRef.current} renderer={rendererRef.current} />
      <Lighting scene={sceneRef.current} />
      <MapperController scene={sceneRef.current} camera={cameraRef.current} renderer={rendererRef.current} freezeControls={true} />
      {characterBodyRef.current && (
        <CharacterController body={characterBodyRef.current} />
      )}
      {/* <ModelLoader scene={sceneRef.current} /> */}
      <Physics scene={sceneRef.current} />
    </div>
  );
};

export default Scene;
