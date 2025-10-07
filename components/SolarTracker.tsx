
import React from 'react';
import { Position, PanelPosition } from '../types';
import { calculateEfficiency } from '../hooks/useVoltageData';
import Card from './Card';
import { SunIcon, PanelIcon } from './Icons';

interface SolarTrackerProps {
  sunPosition: Position;
  panelPosition: PanelPosition;
  setPanelPosition: React.Dispatch<React.SetStateAction<PanelPosition>>;
}

const SolarTracker: React.FC<SolarTrackerProps> = ({ sunPosition, panelPosition, setPanelPosition }) => {
  const efficiency = calculateEfficiency(sunPosition, panelPosition);
  const efficiencyPercentage = (efficiency * 100).toFixed(1);

  const handleTiltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPanelPosition(prev => ({ ...prev, tilt: Number(e.target.value) }));
  };

  const handleAzimuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPanelPosition(prev => ({ ...prev, azimuth: Number(e.target.value) }));
  };
  
  const getEfficiencyColor = (eff: number) => {
    if (eff > 85) return 'text-cyan-400';
    if (eff > 60) return 'text-green-400';
    if (eff > 30) return 'text-yellow-400';
    return 'text-red-500';
  }

  return (
    <Card className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4">Solar Position Tracker</h2>
      
      {/* Visualization */}
      <div className="relative flex-grow w-full bg-slate-900 rounded-lg p-4 mb-4 overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20" style={{background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(15,23,42,0) 70%)'}}></div>

        {/* Sun */}
        <div 
          className="absolute w-12 h-12 bg-yellow-400 rounded-full shadow-[0_0_20px_10px_rgba(250,204,21,0.5)] transition-all duration-1000 ease-linear"
          style={{
            left: `calc(${(sunPosition.azimuth / 360) * 100}% - 1.5rem)`,
            bottom: `calc(${sunPosition.altitude / 90 * 80}% - 1.5rem)`
          }}
        >
          <SunIcon className="w-full h-full text-yellow-600"/>
        </div>

        {/* Panel */}
        <div 
          className="w-48 h-24 bg-blue-900 border-2 border-cyan-400 rounded-md transition-transform duration-500"
          style={{ 
            transform: `perspective(500px) rotateX(${70 - panelPosition.tilt}deg) rotateZ(${panelPosition.azimuth - 180}deg) translateY(50px)`
          }}
        >
          <div className="grid grid-cols-6 grid-rows-3 w-full h-full opacity-50">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="border border-cyan-700"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Data & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2 flex items-center"><SunIcon className="w-5 h-5 mr-2 text-yellow-400"/>Sun Position</h3>
          <p className="text-slate-400">Altitude: {sunPosition.altitude.toFixed(1)}°</p>
          <p className="text-slate-400">Azimuth: {sunPosition.azimuth.toFixed(1)}°</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2 flex items-center"><PanelIcon className="w-5 h-5 mr-2 text-cyan-400"/>Panel Position</h3>
          <p className="text-slate-400">Tilt: {panelPosition.tilt.toFixed(1)}°</p>
          <p className="text-slate-400">Azimuth: {panelPosition.azimuth.toFixed(1)}°</p>
        </div>
      </div>
      
      <div className="mt-4">
        <label htmlFor="tilt" className="block text-slate-400 mb-1">Panel Tilt: {panelPosition.tilt}°</label>
        <input id="tilt" type="range" min="0" max="90" value={panelPosition.tilt} onChange={handleTiltChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
      </div>
      <div className="mt-4">
        <label htmlFor="azimuth" className="block text-slate-400 mb-1">Panel Azimuth: {panelPosition.azimuth}°</label>
        <input id="azimuth" type="range" min="0" max="360" value={panelPosition.azimuth} onChange={handleAzimuthChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
      </div>

      <div className="mt-6 text-center bg-slate-900/70 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-slate-300">Alignment Efficiency</h3>
        <p className={`text-4xl font-bold ${getEfficiencyColor(parseFloat(efficiencyPercentage))}`}>{efficiencyPercentage}%</p>
      </div>
    </Card>
  );
};

export default SolarTracker;
