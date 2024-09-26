import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const WorldController: React.FC<{ scene: THREE.Scene; camera: THREE.Camera, renderer: THREE.WebGLRenderer, controls: OrbitControls }> = ({ scene, camera, renderer, controls }) => {

    useEffect(() => {
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;

        controls.screenSpacePanning = false;

        controls.minDistance = 100;
        controls.maxDistance = 500;

        controls.maxPolarAngle = Math.PI / 2;
        
    }, [controls])

    return null;
};

export default WorldController;
