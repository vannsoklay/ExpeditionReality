// src/3d/use3DScene.ts
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Define the return type for the hook
interface Use3DSceneReturn {
  mountRef: React.RefObject<HTMLDivElement>;
  sceneRef: React.MutableRefObject<THREE.Scene>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer>;
  resize: () => void; // Function to trigger manual resize
}

export const use3DScene = (): Use3DSceneReturn => {
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const rendererRef = useRef<THREE.WebGLRenderer>(
    new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    })
  );
  const animationFrameRef = useRef<number | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    // Configure renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Set camera position
    camera.position.set(0, 0, 5);

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resize = () => {
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  return { mountRef, sceneRef, cameraRef, rendererRef, resize };
};
