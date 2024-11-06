// src/hooks/useKeyboardControls.ts
import { useEffect, useState } from 'react';

const useKeyboardControls = () => {
  const [keys, setKeys] = useState({
    w: false,  // Move forward
    s: false,  // Move backward
    a: false,  // Turn left
    d: false,  // Turn right
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'w':
        setKeys((prev) => ({ ...prev, w: true }));
        break;
      case 's':
        setKeys((prev) => ({ ...prev, s: true }));
        break;
      case 'a':
        setKeys((prev) => ({ ...prev, a: true }));
        break;
      case 'd':
        setKeys((prev) => ({ ...prev, d: true }));
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'w':
        setKeys((prev) => ({ ...prev, w: false }));
        break;
      case 's':
        setKeys((prev) => ({ ...prev, s: false }));
        break;
      case 'a':
        setKeys((prev) => ({ ...prev, a: false }));
        break;
      case 'd':
        setKeys((prev) => ({ ...prev, d: false }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

export default useKeyboardControls;
