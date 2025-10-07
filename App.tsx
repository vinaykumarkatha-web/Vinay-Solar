
import React, { useState } from 'react';
import { PanelPosition } from './types';

import useSunPosition from './hooks/useSunPosition';
import useVoltageData from './hooks/useVoltageData';

import SolarTracker from './components/SolarTracker';
import VoltageMonitor from './components/VoltageMonitor';
import GeminiAdvisor from './components/GeminiAdvisor';

function App() {
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
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">
            Solar Panel Command Center
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Track, Sense, and Optimize with AI
          </p>
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

export default App;
