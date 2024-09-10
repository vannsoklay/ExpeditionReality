import React, { useEffect } from 'react';
import CameraControls from './CameraControls';
import Lighting from './Lighting';
import ModelLoader from './ModelLoader';
import { use3DScene } from '@hooks/use3DScene';

const Scene: React.FC = () => {
  const { mountRef, sceneRef, cameraRef, rendererRef, resize } = use3DScene();

  useEffect(() => {
    // Add resize event listener
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh' }}>
      <CameraControls camera={cameraRef.current} renderer={rendererRef.current} />
      <Lighting scene={sceneRef.current} />
      <ModelLoader scene={sceneRef.current} />
    </div>
  );
};

export default Scene;
