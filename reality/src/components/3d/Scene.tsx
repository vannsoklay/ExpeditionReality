import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { IconoirHomeAltSlim } from '@components/common/Icon';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/common/Model';

const Scene: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const statsRef = useRef<Stats | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);

  const [bodyColor, setBodyColor] = useState('#ff0000');
  const [detailsColor, setDetailsColor] = useState('#ffffff');
  const [glassColor, setGlassColor] = useState('#ffffff');

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0x333333);
    scene.fog = new THREE.Fog(0x333333, 10, 15);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(4.25, 1.4, -4.5);
    cameraRef.current = camera;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 9;
    controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controlsRef.current = controls;

    // Grid setup
    const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.opacity = 0.2;
    gridMaterial.depthWrite = false;
    gridMaterial.transparent = true;
    scene.add(grid);
    gridRef.current = grid;

    // Environment map
    new RGBELoader().load('textures/equirectangular/venice_sunset_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    // Lighting
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Define materials for body, details, and glass
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: bodyColor,
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });

    const detailsMaterial = new THREE.MeshStandardMaterial({
      color: detailsColor,
      metalness: 1.0,
      roughness: 0.5,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: glassColor,
      metalness: 0.25,
      roughness: 0,
      transmission: 1.0,
      transparent: true,
    });

    // Car model loading
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/assets/models/car.glb',
      (gltf) => {
        const model = gltf.scene;

        // Traverse the model and assign materials
        model.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            const mesh = object as THREE.Mesh;

            if (mesh.name.includes('body')) {
              mesh.material = bodyMaterial;
            } else if (['rim_fl', 'rim_fr', 'rim_rl', 'rim_rr', 'trim'].includes(mesh.name)) {
              mesh.material = detailsMaterial;
            } else if (mesh.name.includes('glass')) {
              mesh.material = glassMaterial;
            }
          }
        });


        // Shadow
        new THREE.TextureLoader().load('/assets/ferrari_ao.png', (texture) => {
          const shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
            new THREE.MeshBasicMaterial({
              map: texture,
              blending: THREE.MultiplyBlending,
              toneMapped: false,
              transparent: true
            })
          );
          shadow.rotation.x = -Math.PI / 2;
          shadow.renderOrder = 2;
          model.add(shadow);
        });

        scene.add(model);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
        setIsLoading(false);
      }
    );

    // Stats
    // const stats = new Stats();
    // mountRef.current.appendChild(stats.dom);
    // statsRef.current = stats;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      controls.update();

      const time = -performance.now() / 1000;

      if (!isLoading) {
        for (let wheel of wheelsRef.current) {
          if (wheel && wheel.rotation) {
            wheel.rotation.x = time * Math.PI * 2;
          }
        }
      }

      if (gridRef.current) {
        gridRef.current.position.z = -(time) % 1;
      }

      renderer.render(scene, camera);
      // stats.update();
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        // mountRef.current.removeChild(stats.dom);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [bodyColor, detailsColor, glassColor]);

  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackToHome = () => {
    navigate("/");
    setModalVisible(false);
  };

  return (
    <div ref={mountRef} className='relative' style={{ width: '100%', height: '98vh', overflow: 'hidden' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: '#000', padding: '10px', borderRadius: '8px', color: '#fff' }}>

        <div>
          <label htmlFor="body-color" className="block text-white">Body Color</label>
          <input
            type="color"
            id="body-color"
            value={bodyColor}
            onChange={(e) => setBodyColor(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="details-color" className="block text-white">Details Color</label>
          <input
            type="color"
            id="details-color"
            value={detailsColor}
            onChange={(e) => setDetailsColor(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="glass-color" className="block text-white">Glass Color</label>
          <input
            type="color"
            id="glass-color"
            value={glassColor}
            onChange={(e) => setGlassColor(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="absolute right-10 top-8">
        <button
          onClick={() => setModalVisible(true)}
          className='p-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full'
          aria-label="Back to Home"
        >
          <IconoirHomeAltSlim fontSize={32} />
        </button>
      </div>
      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleBackToHome}
      />
    </div>
  );
};

export default Scene;