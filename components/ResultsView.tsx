import React from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

interface ResultsViewProps {
  questions: Question[];
  answers: number[];
  score: number;
  onRetry: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ questions, answers, score, onRetry }) => {
  const percentage = Math.round((score / questions.length) * 100);
  
  let message = "Keep practicing!";
  let color = "text-slate-600";
  
  if (percentage === 100) {
    message = "Άριστα! (Excellent!)";
    color = "text-green-600";
  } else if (percentage >= 70) {
    message = "Πολύ καλά! (Very Good!)";
    color = "text-blue-600";
  } else if (percentage >= 50) {
    message = "Καλά. (Good.)";
    color = "text-orange-600";
  }

  return (
    <div className="max-w-2xl mx-auto pb-12 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center border-t-8 border-blue-500">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
            <Award className={`w-10 h-10 ${color}`} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete</h2>
        <p className={`text-xl font-medium ${color} mb-6`}>{message}</p>
        
        <div className="flex justify-center items-end gap-2 mb-8">
            <span className="text-5xl font-bold text-slate-900">{score}</span>
            <span className="text-2xl text-slate-400 font-medium mb-1">/ {questions.length}</span>
        </div>

        <button 
          onClick={onRetry} // In a real daily app, maybe hide this or reset specifically
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Review Mode
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 px-2">Review Answers</h3>
        {questions.map((q, idx) => {
          const userAnswer = answers[idx];
          const isCorrect = userAnswer === q.correctAnswerIndex;
          
          return (
            <div key={q.id} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-1 flex-shrink-0">
                    {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                    )}
                </div>
                <div>
                    <p className="text-slate-800 font-medium text-lg">{q.questionText}</p>
                </div>
              </div>
              
              <div className="space-y-2 pl-9">
                {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isTheCorrectAnswer = q.correctAnswerIndex === optIdx;
                    
                    let styles = "p-3 rounded-lg text-sm border ";
                    if (isTheCorrectAnswer) {
                        styles += "bg-green-50 border-green-200 text-green-800 font-medium";
                    } else if (isSelected && !isTheCorrectAnswer) {
                        styles += "bg-red-50 border-red-200 text-red-800";
                    } else {
                        styles += "bg-slate-50 border-slate-100 text-slate-500";
                    }

                    return (
                        <div key={optIdx} className={styles}>
                            {opt} {isTheCorrectAnswer && "✓"} {isSelected && !isTheCorrectAnswer && "✗"}
                        </div>
                    );
                })}
                
                <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-500 italic">
                        <span className="font-semibold text-slate-700 not-italic">Explanation: </span>
                        {q.explanation}
                    </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsView;