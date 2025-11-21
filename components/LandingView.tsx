import React from 'react';
import { Calendar, BookOpen, Play } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  isAlreadyDone: boolean;
  date: string;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart, isAlreadyDone, date }) => {
  const formattedDate = new Date(date).toLocaleDateString('el-GR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
      <div className="bg-white p-4 rounded-full shadow-xl mb-8">
        <div className="bg-blue-600 p-4 rounded-full">
             <BookOpen className="w-12 h-12 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 mb-3">
        Greek B1 <span className="text-blue-600">Daily</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-md mb-8">
        Enhance your Greek skills with 7 new B1-level interactive questions every day.
      </p>
      
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 flex items-center gap-3 shadow-sm">
        <Calendar className="w-5 h-5 text-blue-500" />
        <span className="font-medium text-slate-700 capitalize">{formattedDate}</span>
      </div>

      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
      >
        <span className="mr-2 text-lg">{isAlreadyDone ? 'Review Today\'s Quiz' : 'Start Daily Challenge'}</span>
        <Play className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="mt-12 grid grid-cols-3 gap-4 text-center w-full max-w-sm">
        <div className="flex flex-col items-center">
           <div className="text-2xl font-bold text-slate-800">7</div>
           <div className="text-xs text-slate-500 uppercase tracking-wide">Questions</div>
        </div>
        <div className="flex flex-col items-center border-x border-slate-200">
           <div className="text-2xl font-bold text-slate-800">B1</div>
           <div className="text-xs text-slate-500 uppercase tracking-wide">Level</div>
        </div>
        <div className="flex flex-col items-center">
           <div className="text-2xl font-bold text-slate-800">4</div>
           <div className="text-xs text-slate-500 uppercase tracking-wide">Options</div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;