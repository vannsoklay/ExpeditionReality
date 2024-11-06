// // src/3d/CharacterModelLoader.tsx
// import React, { useEffect } from 'react';
// import * as THREE from 'three';
// import { AnimationMixer } from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// interface CharacterModelLoaderProps {
//   scene: THREE.Scene;
//   onLoadComplete: (mixer: AnimationMixer, mesh: THREE.Mesh) => void;
// }

// const CharacterModelLoader: React.FC<CharacterModelLoaderProps> = ({ scene, onLoadComplete }) => {
//   useEffect(() => {
//     const loader = new GLTFLoader();
//     let mixer: AnimationMixer | null = null;

//     loader.load(
//       'path/to/model.glb', // Replace with your model path
//       (gltf) => {
//         const character = gltf.scene;
//         character.scale.set(1, 1, 1);
//         scene.add(character);

//         mixer = new AnimationMixer(character); // Create the mixer for animations

//         // Play all animations
//         gltf.animations.forEach((clip) => {
//           mixer?.clipAction(clip).play(); // Play the first animation
//         });

//         onLoadComplete(mixer, character as THREE.Mesh); // Pass the mixer and the character
//       },
//       undefined,
//       (error) => {
//         console.error('An error occurred while loading the model:', error);
//       }
//     );

//     return () => {
//       while (scene.children.length > 0) {
//         scene.remove(scene.children[0]);
//       }
//     };
//   }, [scene, onLoadComplete]);

//   return null;
// };

// export default CharacterModelLoader;
