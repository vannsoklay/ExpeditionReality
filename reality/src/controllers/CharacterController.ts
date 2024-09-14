import React, { useEffect, useRef } from 'react';
import { Body } from 'cannon-es';

const CharacterController: React.FC<{ body: Body }> = ({ body }) => {
  const velocity = useRef({ x: 0, z: 0 });

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        velocity.current.z = -10; // Move forward
        break;
      case 'ArrowDown':
      case 'KeyS':
        velocity.current.z = 10; // Move backward
        break;
      case 'ArrowLeft':
      case 'KeyA':
        velocity.current.x = -10; // Move left
        break;
      case 'ArrowRight':
      case 'KeyD':
        velocity.current.x = 10; // Move right
        break;
      default:
        break;
    }
  };

  const handleKeyUp = () => {
    velocity.current = { x: 0, z: 0 };
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);

      // Apply velocity to the body
      body.velocity.set(velocity.current.x, body.velocity.y, velocity.current.z);
    };

    animate();
  }, [body]);

  return null; // No need to render anything visually for this controller
};

export default CharacterController;
