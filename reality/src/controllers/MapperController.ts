import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MapperController: React.FC<{ scene: THREE.Scene; camera: THREE.Camera, renderer: THREE.WebGLRenderer, freezeControls: boolean }> = ({ scene, camera, renderer, freezeControls }) => {
    useEffect(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        camera.position.set(0, 10, 10);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const animate = () => {
            requestAnimationFrame(animate);
            if (!freezeControls) {
                camera.position.x += 0.01; // This is just an example of movement
            }
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            document.body.removeChild(renderer.domElement);
        };
    }, [scene, freezeControls]);

    return null;
};

export default MapperController;
