
import { useState, useEffect } from 'react';
import { Position, PanelPosition, VoltageDataPoint } from '../types';
import { MAX_VOLTAGE, VOLTAGE_DATA_LENGTH, SIMULATION_SPEED_MS } from '../constants';

// Helper to convert degrees to radians
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

// Calculates alignment efficiency between 0 and 1
export const calculateEfficiency = (sunPos: Position, panelPos: PanelPosition): number => {
    const sunAltRad = toRadians(sunPos.altitude);
    const sunAzRad = toRadians(sunPos.azimuth);

    const panelTiltRad = toRadians(panelPos.tilt);
    const panelAzRad = toRadians(panelPos.azimuth);

    // Sun direction vector in 3D cartesian coordinates
    const sunX = Math.cos(sunAltRad) * Math.sin(sunAzRad);
    const sunY = Math.cos(sunAltRad) * Math.cos(sunAzRad);
    const sunZ = Math.sin(sunAltRad);

    // Panel normal vector (perpendicular to panel surface)
    const panelNormalX = Math.sin(panelTiltRad) * Math.sin(panelAzRad);
    const panelNormalY = Math.sin(panelTiltRad) * Math.cos(panelAzRad);
    const panelNormalZ = Math.cos(panelTiltRad);
    
    // Dot product of the two vectors
    const dotProduct = sunX * panelNormalX + sunY * panelNormalY + sunZ * panelNormalZ;

    // Efficiency is the cosine of the angle between vectors, clamped to 0
    return Math.max(0, dotProduct);
};


const useVoltageData = (sunPosition: Position, panelPosition: PanelPosition) => {
  const [voltageData, setVoltageData] = useState<VoltageDataPoint[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const efficiency = calculateEfficiency(sunPosition, panelPosition);
      const noise = (Math.random() - 0.5) * 0.5; // Small random fluctuation
      const newVoltage = (MAX_VOLTAGE * efficiency) + noise;

      setVoltageData(prevData => {
        const newDataPoint = { time: Date.now(), voltage: Math.max(0, newVoltage) };
        const updatedData = [...prevData, newDataPoint];
        if (updatedData.length > VOLTAGE_DATA_LENGTH) {
          return updatedData.slice(updatedData.length - VOLTAGE_DATA_LENGTH);
        }
        return updatedData;
      });
    }, SIMULATION_SPEED_MS);

    return () => clearInterval(interval);
  }, [sunPosition, panelPosition]);

  return voltageData;
};

export default useVoltageData;
