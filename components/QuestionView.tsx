import React, { useState } from 'react';
import { Question } from '../types';
import { ArrowRight, Check, X } from 'lucide-react';

interface QuestionViewProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({ question, currentIndex, totalQuestions, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
      // Reset local state for next question
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const progressPercentage = ((currentIndex) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progressPercentage)}% Completed</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
          {question.questionText}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let containerClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden ";
            
            if (isSubmitted) {
               if (index === question.correctAnswerIndex) {
                 containerClass += "border-green-500 bg-green-50 text-green-800";
               } else if (index === selectedOption) {
                 containerClass += "border-red-500 bg-red-50 text-red-800";
               } else {
                 containerClass += "border-slate-200 opacity-50";
               }
            } else {
               if (selectedOption === index) {
                 containerClass += "border-blue-500 bg-blue-50 text-blue-900 shadow-md";
               } else {
                 containerClass += "border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-700";
               }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isSubmitted}
                className={containerClass}
              >
                <span className="font-medium z-10">{option}</span>
                {isSubmitted && index === question.correctAnswerIndex && (
                  <Check className="w-5 h-5 text-green-600 z-10" />
                )}
                {isSubmitted && index === selectedOption && index !== question.correctAnswerIndex && (
                   <X className="w-5 h-5 text-red-600 z-10" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          {!isSubmitted ? (
             <button
               onClick={handleSubmit}
               disabled={selectedOption === null}
               className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                 selectedOption !== null 
                   ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30' 
                   : 'bg-slate-200 text-slate-400 cursor-not-allowed'
               }`}
             >
               Submit Answer
             </button>
          ) : (
             <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                <div className={`flex-1 p-3 rounded-lg text-sm ${
                    selectedOption === question.correctAnswerIndex 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-50 text-orange-800'
                }`}>
                   <span className="font-bold">Explanation: </span>{question.explanation}
                </div>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg flex items-center flex-shrink-0 whitespace-nowrap"
                >
                  Next Question <ArrowRight className="ml-2 w-4 h-4" />
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionView;