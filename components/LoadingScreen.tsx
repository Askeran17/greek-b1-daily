import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg border-4 border-blue-100">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Generating Daily Quiz</h2>
      <p className="text-slate-500 max-w-md">
        Consulting the AI Oracles to prepare 7 fresh Greek B1 questions for you...
      </p>
    </div>
  );
};

export default LoadingScreen;