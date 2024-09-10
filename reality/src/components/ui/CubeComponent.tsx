import { use3DScene } from '@hooks/use3DScene';
import React, { useEffect } from 'react';
import * as THREE from 'three';

const CubeComponent: React.FC = () => {
  const { sceneRef, cameraRef, rendererRef, mountRef } = use3DScene();

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    // Create a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop to rotate the cube
    const animate = () => {
      if (rendererRef.current) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      scene.remove(cube);
    };
  }, [sceneRef, cameraRef, rendererRef]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100vh' }} // Ensure container has dimensions
    />
  );
};

export default CubeComponent;
