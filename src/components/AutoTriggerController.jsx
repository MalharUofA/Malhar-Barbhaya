import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import useStore from '../hooks/store';

const AutoTriggerController = ({ autoBeat, setTrigger }) => {
  const clicked = useStore((state) => state.clicked);
  const drums = useStore((state) => state.audio.drums);

  const beatCounter = useRef(0);
  const justTriggered = useRef(false); // prevent multiple triggers per frame

  useEffect(() => {
    if (!clicked) {
      setTrigger(0); // Rebuild statue if user scrolls away
      beatCounter.current = 0; // optional: reset beat counter for clean restart
    } 
  }, [clicked]);

  useFrame(() => {
    if (clicked && autoBeat && drums.signal && !justTriggered.current) {
      justTriggered.current = true;
      beatCounter.current++;

      if (beatCounter.current % 2 === 1) {
        // First beat: small explosion
        setTrigger(1);
      } else {
        // Second beat: full explosion
        setTrigger(2);

        // Rebuild shortly after full explosion
        setTimeout(() => {
          setTrigger(0); // Reassemble before next beat
        }, 25); // tweak this delay for rebuild speed
      }

      // Reset trigger guard after short delay
      setTimeout(() => {
        justTriggered.current = false;
      }, 100); // small delay to avoid multiple triggers per frame
    }
    
  });

  return null;
};

export default AutoTriggerController;
