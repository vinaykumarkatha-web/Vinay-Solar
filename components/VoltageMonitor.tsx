
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VoltageDataPoint } from '../types';
import Card from './Card';
import { BoltIcon } from './Icons';
import { MAX_VOLTAGE } from '../constants';

interface VoltageMonitorProps {
  voltageData: VoltageDataPoint[];
}

const VoltageMonitor: React.FC<VoltageMonitorProps> = ({ voltageData }) => {
  const currentVoltage = voltageData.length > 0 ? voltageData[voltageData.length - 1].voltage : 0;
  const voltagePercentage = (currentVoltage / MAX_VOLTAGE) * 100;

  return (
    <Card>
      <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center"><BoltIcon className="w-6 h-6 mr-2 text-yellow-400"/>Voltage Monitor</h2>
      <div className="flex items-baseline mb-4">
        <p className="text-5xl font-bold text-white">{currentVoltage.toFixed(2)}</p>
        <span className="text-2xl text-slate-400 ml-2">V</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6">
        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${voltagePercentage}%` }}></div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={voltageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={false} axisLine={{stroke: '#475569'}} />
            <YAxis domain={[0, MAX_VOLTAGE]} stroke="#94a3b8" axisLine={{stroke: '#475569'}}/>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderColor: '#334155',
                color: '#e2e8f0',
              }}
              labelFormatter={() => ''}
              formatter={(value: number) => [`${value.toFixed(2)}V`, 'Voltage']}
            />
            <Line type="monotone" dataKey="voltage" stroke="#facc15" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default VoltageMonitor;
