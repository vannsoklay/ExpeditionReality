// src/3d/VRControls.tsx
import { useEffect } from 'react';
import * as THREE from 'three';

interface VRControlsProps {
  camera: THREE.Camera;
}

const VRControls: React.FC<VRControlsProps> = ({ camera }) => {
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.xr.enabled = true;

    // Create a controller
    const controller = renderer.xr.getController(0);
    controller.addEventListener('selectstart', onSelectStart);
    controller.addEventListener('selectend', onSelectEnd);
    camera.add(controller);

    // Event handler functions for VR interactions
    function onSelectStart() {
      console.log('Select start triggered');
      // Add interaction behavior here
    }

    function onSelectEnd() {
      console.log('Select end triggered');
      // Add interaction behavior here
    }

    return () => {
      // Clean up event listeners on unmount
      controller.removeEventListener('selectstart', onSelectStart);
      controller.removeEventListener('selectend', onSelectEnd);
      camera.remove(controller);
    };
  }, [camera]);

  return null;
};

export default VRControls;
