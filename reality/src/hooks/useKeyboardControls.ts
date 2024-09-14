import { useEffect, useState } from 'react';
import { Body } from 'cannon-es';


const useKeyboardControls = (character: Body) => { // Replace with actual type
    const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setKeys((prev) => ({ ...prev, [event.key]: true }));
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            setKeys((prev) => ({ ...prev, [event.key]: false }));
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (character) {
            const moveSpeed = 5;

            if (keys['w']) {
                character.velocity.z = -moveSpeed;
            } else if (keys['s']) {
                character.velocity.z = moveSpeed;
            } else {
                character.velocity.z = 0;
            }

            if (keys['a']) {
                character.velocity.x = -moveSpeed;
            } else if (keys['d']) {
                character.velocity.x = moveSpeed;
            } else {
                character.velocity.x = 0;
            }
        }
    }, [keys, character]);
};

export default useKeyboardControls;
