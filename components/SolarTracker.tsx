import React from 'react';
import { Position, PanelPosition } from '../types.ts';
import Card from './Card.tsx';
import { SunIcon, PanelIcon } from './Icons.tsx';

interface SolarTrackerProps {
  sunPosition: Position;
  panelPosition: PanelPosition;
  setPanelPosition: React.Dispatch<React.SetStateAction<PanelPosition>>;
}

const SolarTracker: React.FC<SolarTrackerProps> = ({ sunPosition, panelPosition, setPanelPosition }) => {
  const handleTiltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPanelPosition(prev => ({ ...prev, tilt: Number(e.target.value) }));
  };

  const handleAzimuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPanelPosition(prev => ({ ...prev, azimuth: Number(e.target.value) }));
  };

  // Dynamic sky gradient based on sun altitude
  const getSkyGradient = (altitude: number) => {
    if (altitude <= 0) return 'linear-gradient(to top, #0f172a, #1e293b)'; // Night
    if (altitude < 15) return 'linear-gradient(to top, #fdba74, #f97316, #1e293b)'; // Sunrise
    if (altitude > 75) return 'linear-gradient(to top, #60a5fa, #38bdf8)'; // Midday
    return 'linear-gradient(to top, #93c5fd, #38bdf8)'; // Day
  };
  
  const skyStyle = {
    background: getSkyGradient(sunPosition.altitude),
  };

  const sunTransform = `
    rotate(${sunPosition.azimuth - 180}deg) 
    translateX(40%) 
    rotate(${-sunPosition.azimuth + 180}deg) 
    translateY(${-sunPosition.altitude * 0.8}%)
  `;

  const panelTransform = `
    perspective(1000px) 
    rotateX(${70 - panelPosition.tilt}deg) 
    rotateZ(${panelPosition.azimuth - 180}deg)
  `;

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center">
        <PanelIcon className="w-6 h-6 mr-3 text-cyan-400"/>
        Live Solar Tracker
      </h2>

      {/* Visualization */}
      <div 
        className="relative w-full h-64 rounded-lg overflow-hidden border border-slate-700/50 mb-6 transition-all duration-1000"
        style={skyStyle}
      >
        {/* Sun Path Arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <path
            d="M 5,45 C 25,0 75,0 95,45"
            stroke="#fde047"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="2 2"
            opacity="0.4"
          />
        </svg>

        {/* Sun */}
        <div 
          className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 rounded-full bg-yellow-400 animate-sun-pulse"
          style={{ 
            transform: sunTransform,
            transition: 'transform 1s ease-in-out', // Smooth sun movement
            boxShadow: '0 0 20px 10px rgba(250, 204, 21, 0.5)',
          }}
          aria-label="Sun's position"
        />
        
        {/* Panel */}
        <div 
          className="absolute bottom-4 left-1/2 -ml-16 w-32 h-20 panel-sheen"
          style={{ transform: panelTransform, transition: 'transform 0.7s ease-out' }}
        >
           <div className="w-full h-full bg-slate-900 border-2 border-cyan-400/50 rounded-md grid grid-cols-4 grid-rows-2 gap-px p-px">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-blue-900/50"></div>
            ))}
          </div>
          {/* Panel stand */}
          <div className="absolute bottom-[-8px] left-1/2 -ml-1 w-2 h-4 bg-slate-600 rounded-b-sm"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
          <h3 className="font-bold text-md text-yellow-400 flex items-center mb-1">
            <SunIcon className="w-5 h-5 mr-2" />
            Sun Position
          </h3>
          <p className="text-slate-300 text-sm">Altitude: <span className="font-mono text-white float-right">{sunPosition.altitude.toFixed(1)}°</span></p>
          <p className="text-slate-300 text-sm">Azimuth: <span className="font-mono text-white float-right">{sunPosition.azimuth.toFixed(1)}°</span></p>
        </div>
        
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
          <h3 className="font-bold text-md text-cyan-400 flex items-center mb-1">
            <PanelIcon className="w-5 h-5 mr-2" />
            Panel Position
          </h3>
          <p className="text-slate-300 text-sm">Tilt: <span className="font-mono text-white float-right">{panelPosition.tilt.toFixed(1)}°</span></p>
          <p className="text-slate-300 text-sm">Azimuth: <span className="font-mono text-white float-right">{panelPosition.azimuth.toFixed(1)}°</span></p>
        </div>
      </div>
      
      <div className="mt-auto space-y-4 pt-4 border-t border-slate-700">
        <h3 className="text-md font-semibold text-slate-200">Panel Controls</h3>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="tilt-slider" className="text-sm font-medium text-slate-300">
              Adjust Panel Tilt
            </label>
            <span className="text-sm font-mono bg-slate-700 px-2 py-1 rounded text-cyan-300">{panelPosition.tilt}°</span>
          </div>
          <input
            id="tilt-slider"
            type="range"
            min="0"
            max="90"
            step="1"
            value={panelPosition.tilt}
            onChange={handleTiltChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            aria-label="Adjust Panel Tilt"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="azimuth-slider" className="text-sm font-medium text-slate-300">
              Adjust Panel Azimuth
            </label>
             <span className="text-sm font-mono bg-slate-700 px-2 py-1 rounded text-cyan-300">{panelPosition.azimuth}°</span>
          </div>
          <input
            id="azimuth-slider"
            type="range"
            min="0"
            max="360"
            step="1"
            value={panelPosition.azimuth}
            onChange={handleAzimuthChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            aria-label="Adjust Panel Azimuth"
          />
        </div>
      </div>
    </Card>
  );
};

export default SolarTracker;