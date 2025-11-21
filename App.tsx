import React, { useState, useEffect } from 'react';
import { generateDailyQuestions } from './services/geminiService';
import { Question, AppView, QuizState } from './types';
import LandingView from './components/LandingView';
import QuestionView from './components/QuestionView';
import ResultsView from './components/ResultsView';
import LoadingScreen from './components/LoadingScreen';
import { AlertCircle } from 'lucide-react';

// Helper to manage local storage key based on date
const getStorageKey = () => {
  const today = new Date().toISOString().split('T')[0];
  return `greek_b1_quiz_${today}`;
};

function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    isFinished: false,
    loading: false,
    error: null,
    dateGenerated: '',
  });

  // Initial check for existing daily data
  useEffect(() => {
    const key = getStorageKey();
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed && Array.isArray(parsed.questions)) {
          setQuizState(prev => ({
            ...prev,
            questions: parsed.questions,
            dateGenerated: parsed.dateGenerated || new Date().toISOString()
          }));
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  const startQuiz = async () => {
    const key = getStorageKey();
    const storedData = localStorage.getItem(key);

    // If we already have questions loaded in state or storage
    if (quizState.questions.length > 0) {
        // Reset progress but keep questions
        setQuizState(prev => ({
            ...prev,
            currentIndex: 0,
            score: 0,
            answers: [],
            isFinished: false,
            error: null
        }));
        setView(AppView.QUIZ);
        return;
    }

    // Otherwise generate new ones
    setQuizState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const questions = await generateDailyQuestions();
      
      const newState = {
        questions,
        dateGenerated: new Date().toISOString()
      };

      // Save to local storage so refreshing doesn't lose "today's" quiz context
      localStorage.setItem(key, JSON.stringify(newState));

      setQuizState(prev => ({
        ...prev,
        questions: questions,
        loading: false,
        currentIndex: 0,
        score: 0,
        answers: [],
        isFinished: false,
        dateGenerated: newState.dateGenerated
      }));
      
      setView(AppView.QUIZ);

    } catch (err) {
      setQuizState(prev => ({
        ...prev,
        loading: false,
        error: "Failed to generate quiz. Please check your connection or API key and try again."
      }));
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = quizState.questions[quizState.currentIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;

    const nextAnswers = [...quizState.answers, answerIndex];
    const nextScore = isCorrect ? quizState.score + 1 : quizState.score;
    
    const nextIndex = quizState.currentIndex + 1;
    const isFinished = nextIndex >= quizState.questions.length;

    setQuizState(prev => ({
      ...prev,
      score: nextScore,
      answers: nextAnswers,
      currentIndex: nextIndex,
      isFinished: isFinished,
    }));

    if (isFinished) {
      setView(AppView.RESULTS);
    }
  };

  const handleRetry = () => {
      // For review mode, or restarting the *same* quiz
      setQuizState(prev => ({
          ...prev,
          currentIndex: 0,
          score: 0,
          answers: [],
          isFinished: false
      }));
      setView(AppView.QUIZ);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView(AppView.HOME)}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              GR
            </div>
            <h1 className="font-bold text-xl tracking-tight">Greek<span className="text-blue-600">Daily</span></h1>
          </div>
          {quizState.questions.length > 0 && view === AppView.QUIZ && (
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              B1 Level
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {quizState.error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
                <h3 className="text-red-800 font-medium">Something went wrong</h3>
                <p className="text-red-700 text-sm mt-1">{quizState.error}</p>
                <button 
                    onClick={() => setQuizState(prev => ({ ...prev, error: null }))}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
                >
                    Dismiss
                </button>
            </div>
          </div>
        )}

        {quizState.loading ? (
          <LoadingScreen />
        ) : (
          <>
            {view === AppView.HOME && (
              <LandingView 
                onStart={startQuiz} 
                isAlreadyDone={quizState.questions.length > 0}
                date={new Date().toISOString()}
              />
            )}

            {view === AppView.QUIZ && quizState.questions.length > 0 && (
              <QuestionView 
                question={quizState.questions[quizState.currentIndex]}
                currentIndex={quizState.currentIndex}
                totalQuestions={quizState.questions.length}
                onAnswer={handleAnswer}
              />
            )}

            {view === AppView.RESULTS && (
              <ResultsView 
                questions={quizState.questions}
                answers={quizState.answers}
                score={quizState.score}
                onRetry={handleRetry}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-100 mt-auto">
        <p>© {new Date().getFullYear()} Greek Daily. Content generated by AI.</p>
      </footer>
    </div>
  );
}

export default App;