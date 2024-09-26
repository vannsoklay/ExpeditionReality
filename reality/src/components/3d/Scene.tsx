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
import WorldController from '@controllers/WorldController';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const Scene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const controlRef = useRef(new OrbitControls(cameraRef.current, rendererRef.current.domElement));
  // const characterRef = useRef<Body | null>(null);

  // const characterRef = useRef(new THREE.Mesh(
  //   new THREE.BoxGeometry(18, 18, 18),
  //   new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  // ));

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const { current: scene } = sceneRef;
    const { current: camera } = cameraRef;
    const { current: renderer } = rendererRef;
    const { current: controls } = controlRef;

    // const character = characterRef.current;

    if (!mountRef.current) return;

    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.FogExp2(0xa0a0a0, 0.001);

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // character.name = 'box'; // Name the object to sync with the physics body
    // scene.add(character);

    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    camera.position.set(400, 200, 0);

    // controls

    controls.listenToKeyEvents(window); // optional

    // world
    const geometry = new THREE.ConeGeometry(10, 30, 4, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

    // for (let i = 0; i < 500; i++) {

    //   const mesh = new THREE.Mesh(geometry, material);
    //   mesh.position.x = Math.random() * 1600 - 800;
    //   mesh.position.y = 0;
    //   mesh.position.z = Math.random() * 1600 - 800;
    //   mesh.updateMatrix();
    //   mesh.matrixAutoUpdate = false;
    //   // mesh.position.set(0, 0, 0);
    //   scene.add(mesh);


    // }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

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
      <WorldController scene={sceneRef.current} camera={cameraRef.current} renderer={rendererRef.current} controls={controlRef.current} />
      {/* {characterBodyRef.current && (
        <CharacterController body={characterBodyRef.current} />
      )} */}
      <ModelLoader scene={sceneRef.current} controls={controlRef.current} />
      {/* <Physics scene={sceneRef.current} /> */}
    </div>
  );
};

export default Scene;
