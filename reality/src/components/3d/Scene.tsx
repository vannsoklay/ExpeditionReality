// src/3d/Scene.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CameraControls from './CameraControls';
import Lighting from './Lighting';
import ModelLoader from './ModelLoader';

const Scene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Callback when model is loaded
  const handleModelLoaded = (model: THREE.Group) => {
    // Perform actions with the loaded model, like animations or positioning
    model.position.set(0, -1, 0); // Adjust position if needed
    sceneRef.current.add(model);
  };

  // Function to handle click events
  const handleMouseClick = (event: MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current) return;

    // Calculate mouse position in normalized device coordinates (-1 to +1) for both axes
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Calculate objects intersecting the picking ray
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      // Perform an action on the first intersected object
      const selectedObject = intersects[0].object;

      // Example: Simple scaling animation on click
      const initialScale = selectedObject.scale.clone();
      const targetScale = initialScale.clone().multiplyScalar(1.2);
      const animationDuration = 500;

      let start: number | null = null;

      const animateScale = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / animationDuration;

        if (progress < 1) {
          selectedObject.scale.lerpVectors(initialScale, targetScale, progress);
          requestAnimationFrame(animateScale);
        } else {
          selectedObject.scale.copy(initialScale); // Reset to the original scale
        }
      };

      requestAnimationFrame(animateScale);
    }
  };

  useEffect(() => {
    const { current: scene } = sceneRef;
    const { current: camera } = cameraRef;
    const { current: renderer } = rendererRef;

    if (!mountRef.current) return;

    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    camera.position.z = 5;

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    window.addEventListener('click', handleMouseClick);

    // Start the animation loop
    animate();

    // Cleanup on unmount
    return () => {
      window.addEventListener('click', handleMouseClick);
      if (renderer.domElement) {
        mountRef.current?.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };

    // Clean up when component unmounts
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef}>
      <CameraControls camera={cameraRef.current} renderer={rendererRef.current} />
      <Lighting scene={sceneRef.current} />
      <ModelLoader scene={sceneRef.current} />
    </div>
  );
};

export default Scene;
