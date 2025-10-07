import React, { useState, useCallback } from 'react';
import { Position, PanelPosition, GeminiAdvice } from '../types.ts';
import { getSolarAdvice } from '../services/geminiService.ts';
import Card from './Card.tsx';
import { SparklesIcon } from './Icons.tsx';

interface GeminiAdvisorProps {
  sunPosition: Position;
  panelPosition: PanelPosition;
  currentVoltage: number;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ sunPosition, panelPosition, currentVoltage }) => {
  const [advice, setAdvice] = useState<GeminiAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const result = await getSolarAdvice(sunPosition, panelPosition, currentVoltage);
      if (result) {
        setAdvice(result);
      } else {
        setError('Failed to get advice. The response was empty. Please check your API key and try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred while contacting the AI service.');
    } finally {
      setIsLoading(false);
    }
  }, [sunPosition, panelPosition, currentVoltage]);

  return (
    <Card>
      <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center"><SparklesIcon className="w-6 h-6 mr-2 text-cyan-400"/>Gemini AI Advisor</h2>
      
      <button
        onClick={fetchAdvice}
        disabled={isLoading}
        className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : 'Get Optimization Advice'}
      </button>

      <div className="mt-6">
        {error && !isLoading && (
          <div className="text-center bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-400">Analysis Failed</h3>
            <p className="text-slate-400 my-2 text-sm">{error}</p>
            <button
              onClick={fetchAdvice}
              className="mt-2 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-500 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {advice && !isLoading && (
          <div className="space-y-4 text-slate-300 animate-fade-in">
            <div>
              <h3 className="font-semibold text-cyan-400">Analysis:</h3>
              <p className="text-slate-400">{advice.analysis}</p>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-400">Recommendation:</h3>
              <p className="text-slate-400">{advice.recommendation}</p>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-400">Fun Fact:</h3>
              <p className="text-slate-400 italic">"{advice.funFact}"</p>
            </div>
          </div>
        )}

        {!advice && !isLoading && !error && (
          <div className="text-center text-slate-500">
              <p>Click the button to get AI-powered tips on how to improve your solar panel's performance based on the current conditions.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GeminiAdvisor;