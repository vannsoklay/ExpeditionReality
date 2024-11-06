// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import CameraControls from './CameraControls';
// import Lighting from './Lighting';
import ModelLoader from './ModelLoader';
// import useKeyboardControls from '@hooks/useKeyboardControls';
// import WorldController from '@controllers/WorldController';
// import Modal from '@components/common/Model';
// import { IconoirHomeAltSlim } from '@components/common/Icon';
// import { useNavigate } from 'react-router-dom';

// const Scene: React.FC = () => {
//   const navigate = useNavigate();
//   const [isModalVisible, setModalVisible] = useState(false);
//   const mountRef = useRef<HTMLDivElement | null>(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const cameraRef = useRef(new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000));
//   const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
//   const controlRef = useRef<OrbitControls | null>(null);
//   const characterRef = useRef<THREE.Mesh | null>(null);
//   const raycasterRef = useRef(new THREE.Raycaster());
//   const mouseRef = useRef(new THREE.Vector2());
//   const targetPositionRef = useRef<THREE.Vector3 | null>(null);
//   const terrainRef = useRef<THREE.Mesh | null>(null);

//   const keys = useKeyboardControls();

//   useEffect(() => {
//     const { current: scene } = sceneRef;
//     const { current: camera } = cameraRef;
//     const { current: renderer } = rendererRef;

//     if (!mountRef.current) return;

//     // Scene setup
//     scene.background = new THREE.Color(0xa0a0a0);
//     scene.fog = new THREE.FogExp2(0xa0a0a0, 0.002);

//     // Renderer setup
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.shadowMap.enabled = true;
//     mountRef.current.appendChild(renderer.domElement);
//     camera.position.set(0, 10, 20);

//     // Controls setup
//     controlRef.current = new OrbitControls(camera, renderer.domElement);
//     controlRef.current.target.set(0, 0, 0);
//     controlRef.current.update();

//     // Terrain setup
//     const terrainSize = 100;
//     const terrainResolution = 128;
//     const terrainGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainResolution - 1, terrainResolution - 1);
//     const terrainMaterial = new THREE.MeshPhongMaterial({ color: 0x3c8f3c, wireframe: false });
//     terrainRef.current = new THREE.Mesh(terrainGeometry, terrainMaterial);
//     terrainRef.current.rotation.x = -Math.PI / 2;
//     terrainRef.current.receiveShadow = true;
//     scene.add(terrainRef.current);

//     // Generate height map
//     const heightMap = new Float32Array(terrainResolution * terrainResolution);
//     for (let i = 0; i < heightMap.length; i++) {
//       const x = i % terrainResolution;
//       const y = Math.floor(i / terrainResolution);
//       heightMap[i] = Math.sin(x / 10) * Math.cos(y / 10) * 5;
//     }

//     // Apply height map to terrain
//     const terrainPositions = terrainGeometry.attributes.position.array as Float32Array;
//     for (let i = 0; i < terrainPositions.length; i += 3) {
//       const x = Math.floor((i / 3) % terrainResolution);
//       const y = Math.floor((i / 3) / terrainResolution);
//       terrainPositions[i + 2] = heightMap[y * terrainResolution + x];
//     }
//     terrainGeometry.attributes.position.needsUpdate = true;
//     terrainGeometry.computeVertexNormals();

//     // Character setup
//     const geometry = new THREE.SphereGeometry(0.5, 32, 32);
//     const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
//     characterRef.current = new THREE.Mesh(geometry, material);
//     characterRef.current.position.y = 10;
//     characterRef.current.castShadow = true;
//     scene.add(characterRef.current);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0x404040);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(1, 1, 1);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);

//       if (characterRef.current && targetPositionRef.current) {
//         const direction = targetPositionRef.current.clone().sub(characterRef.current.position);
//         if (direction.length() > 0.1) {
//           direction.normalize();
//           characterRef.current.position.add(direction.multiplyScalar(0.2));

//           // Apply gravity
//           const raycaster = new THREE.Raycaster(characterRef.current.position, new THREE.Vector3(0, -1, 0));
//           const intersects = raycaster.intersectObject(terrainRef.current!);
//           if (intersects.length > 0) {
//             const heightAtPosition = intersects[0].point.y;
//             characterRef.current.position.y = Math.max(characterRef.current.position.y, heightAtPosition + 0.5);
//           } else {
//             characterRef.current.position.y = Math.max(characterRef.current.position.y - 0.1, 0.5);
//           }
//         }
//       }

//       controlRef.current?.update();
//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle window resize
//     const onResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', onResize);

//     // Handle click/touch events
//     const onMouseClick = (event: MouseEvent | TouchEvent) => {
//       event.preventDefault();

//       const isTouch = 'touches' in event;
//       const clientX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
//       const clientY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;

//       mouseRef.current.x = (clientX / window.innerWidth) * 2 - 1;
//       mouseRef.current.y = -(clientY / window.innerHeight) * 2 + 1;

//       raycasterRef.current.setFromCamera(mouseRef.current, camera);
//       const intersects = raycasterRef.current.intersectObject(terrainRef.current!);

//       if (intersects.length > 0) {
//         targetPositionRef.current = intersects[0].point;
//         targetPositionRef.current.y += 0.5; // Offset to place character on top of terrain
//       }
//     };

//     renderer.domElement.addEventListener('click', onMouseClick);
//     renderer.domElement.addEventListener('touchstart', onMouseClick);

//     return () => {
//       if (mountRef.current) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       window.removeEventListener('resize', onResize);
//       renderer.domElement.removeEventListener('click', onMouseClick);
//       renderer.domElement.removeEventListener('touchstart', onMouseClick);
//       renderer.dispose();
//       scene.clear();
//     };
//   }, []);

//   const handleBackToHome = () => {
//     navigate("/");
//     setModalVisible(false);
//   };

//   return (
//     <div ref={mountRef} className='relative' style={{ width: '100%', height: '98vh', overflow: 'hidden' }}>
//       <CameraControls camera={cameraRef.current} renderer={rendererRef.current} />
//       <Lighting scene={sceneRef.current} />
//       {/* <WorldController 
//         scene={sceneRef.current} 
//         camera={cameraRef.current} 
//         renderer={rendererRef.current} 
//         controls={controlRef.current!} 
//       /> */}
// {/* <ModelLoader scene={sceneRef.current} controls={controlRef.current!} /> */}
//       <div className="absolute right-10 top-8">
//         <button 
//           onClick={() => setModalVisible(true)} 
//           className='p-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full'
//           aria-label="Back to Home"
//         >
//           <IconoirHomeAltSlim fontSize={32} />
//         </button>
//       </div>
//       <Modal
//         isVisible={isModalVisible}
//         onClose={() => setModalVisible(false)}
//         onConfirm={handleBackToHome}
//       />
//     </div>
//   );
// };

// export default Scene;


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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
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

    // Materials
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: bodyColor,
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03
    });

    const detailsMaterial = new THREE.MeshStandardMaterial({
      color: detailsColor,
      metalness: 1.0,
      roughness: 0.5
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: glassColor,
      metalness: 0.25,
      roughness: 0,
      transmission: 1.0
    });

    // Car model loading
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/assets/models/ferrari_sf90_stradale.glb',
      (gltf) => {
        const carModel = gltf.scene.children[0];

        const bodyMesh = carModel.getObjectByName('body') as THREE.Mesh;
        if (bodyMesh) bodyMesh.material = bodyMaterial;

        const detailParts = ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim'];
        detailParts.forEach(part => {
          const mesh = carModel.getObjectByName(part) as THREE.Mesh;
          if (mesh) mesh.material = detailsMaterial;
        });

        const glassMesh = carModel.getObjectByName('glass') as THREE.Mesh;
        if (glassMesh) glassMesh.material = glassMaterial;

        wheelsRef.current = [
          carModel.getObjectByName('wheel_fl'),
          carModel.getObjectByName('wheel_fr'),
          carModel.getObjectByName('wheel_rl'),
          carModel.getObjectByName('wheel_rr')
        ].filter((wheel): wheel is THREE.Object3D => wheel !== null);

        // Shadow
        // new THREE.TextureLoader().load('/assets/ferrari_ao.png', (texture) => {
        //   const shadow = new THREE.Mesh(
        //     new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
        //     new THREE.MeshBasicMaterial({
        //       map: texture,
        //       blending: THREE.MultiplyBlending,
        //       toneMapped: false,
        //       transparent: true
        //     })
        //   );
        //   shadow.rotation.x = -Math.PI / 2;
        //   shadow.renderOrder = 2;
        //   carModel.add(shadow);
        // });

        scene.add(carModel);
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
      <div className="absolute left-10 top-8 space-y-4">
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