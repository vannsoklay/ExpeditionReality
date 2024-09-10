// src/3d/VRView.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import VRControls from './VRControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const VRView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));

  useEffect(() => {
    const { current: scene } = sceneRef;
    const { current: camera } = cameraRef;
    const { current: renderer } = rendererRef;

    if (!mountRef.current) return;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));
    camera.position.z = 5;

    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    animate();

    return () => {
      renderer.setAnimationLoop(null);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef}>
      <VRControls camera={cameraRef.current} />
    </div>
  );
};

export default VRView;
