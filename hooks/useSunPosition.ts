
import { useState, useEffect } from 'react';
import { Position } from '../types';
import { SIMULATION_SPEED_MS } from '../constants';

const useSunPosition = (): Position => {
  const [sunPosition, setSunPosition] = useState<Position>({ azimuth: 0, altitude: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const totalSecondsInDay = 24 * 60 * 60;
      
      // Simulate a full day every 2 minutes for a dynamic effect
      const simulatedSecondsInDay = (Date.now() / (2 * 60 * 1000)) * totalSecondsInDay % totalSecondsInDay;
      const hour = (simulatedSecondsInDay / 3600);

      // Simple sinusoidal model for altitude (sun rising and setting)
      // Peaks at noon (hour 12), min at midnight/start
      const altitude = Math.max(0, Math.sin((hour / 24) * Math.PI) * 90);
      
      // Linear model for azimuth (East to West)
      const azimuth = (hour / 24) * 360;

      setSunPosition({ altitude, azimuth });
    }, SIMULATION_SPEED_MS);

    return () => clearInterval(interval);
  }, []);

  return sunPosition;
};

export default useSunPosition;
