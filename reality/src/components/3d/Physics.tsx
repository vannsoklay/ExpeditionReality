import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { World, Body, Box, Vec3 } from 'cannon-es';

const Physics: React.FC<{ scene: THREE.Scene }> = ({ scene }) => {
  const worldRef = useRef<World>(new World());
  const boxBodyRef = useRef<Body>();

  useEffect(() => {
    const world = worldRef.current;

    // Set gravity for the world
    world.gravity.set(0, -9.82, 0);

    // Create a physics body for a box (e.g., your character or object)
    const boxShape = new Box(new Vec3(1, 1, 1)); // Match your object's size
    const boxBody = new Body({ mass: 1 });
    boxBody.addShape(boxShape);
    boxBody.position.set(0, 5, 0); // Initial position of the object
    world.addBody(boxBody);
    boxBodyRef.current = boxBody;

    // Basic ground body
    const groundShape = new Box(new Vec3(50, 1, 50));
    const groundBody = new Body({ mass: 0 }); // Mass of 0 makes it static
    groundBody.addShape(groundShape);
    groundBody.position.set(0, -1, 0);
    world.addBody(groundBody);

    return () => {
      world.removeBody(boxBody);
      world.removeBody(groundBody);
    };
  }, []);

  useEffect(() => {
    const world = worldRef.current;
    const boxBody = boxBodyRef.current;

    const animate = () => {
      world.step(1 / 60); // Step the physics world

      if (boxBody) {
        // Sync box position and rotation with the physics body
        const boxMesh = scene.getObjectByName('box') as THREE.Mesh;
        if (boxMesh) {
          boxMesh.position.copy(boxBody.position as unknown as THREE.Vector3);
          boxMesh.quaternion.copy(boxBody.quaternion as unknown as THREE.Quaternion);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup
    };
  }, [scene]);

  return null;
};

export default Physics;
