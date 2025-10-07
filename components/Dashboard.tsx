import React, { useState } from 'react';
import { PanelPosition } from '../types.ts';

import useSunPosition from '../hooks/useSunPosition.ts';
import useVoltageData from '../hooks/useVoltageData.ts';

import SolarTracker from './SolarTracker.tsx';
import VoltageMonitor from './VoltageMonitor.tsx';
import GeminiAdvisor from './GeminiAdvisor.tsx';
import { LogoutIcon } from './Icons.tsx';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [panelPosition, setPanelPosition] = useState<PanelPosition>({
    tilt: 30,
    azimuth: 180,
  });

  const sunPosition = useSunPosition();
  const voltageData = useVoltageData(sunPosition, panelPosition);
  const currentVoltage = voltageData.length > 0 ? voltageData[voltageData.length - 1].voltage : 0;

  return (
    <div className="min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="relative text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">
            Solar Panel Command Center
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Track, Sense, and Optimize with AI
          </p>
           <button
            onClick={onLogout}
            className="absolute top-0 right-0 mt-2 flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            aria-label="Logout"
           >
            <LogoutIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <SolarTracker 
              sunPosition={sunPosition} 
              panelPosition={panelPosition} 
              setPanelPosition={setPanelPosition} 
            />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <VoltageMonitor voltageData={voltageData} />
            <GeminiAdvisor 
              sunPosition={sunPosition} 
              panelPosition={panelPosition} 
              currentVoltage={currentVoltage} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;