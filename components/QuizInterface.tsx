import React, { useState } from 'react';
import { QuizQuestion, QuizResult } from '../types';
import { CheckCircle, Circle, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
  onRestart: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onComplete, onRestart }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion.id] !== undefined;

  const handleOptionSelect = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIdx
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score
      let correctCount = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.correctAnswerIndex) {
          correctCount++;
        }
      });
      
      onComplete({
        score: correctCount,
        total: questions.length,
        answers: answers
      });
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center justify-between text-sm font-medium text-slate-500">
        <span>Soru {currentQuestionIdx + 1} / {questions.length}</span>
        <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300" 
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              const isCorrect = currentQuestion.correctAnswerIndex === idx;
              const isWrong = isSelected && !isCorrect;
              
              let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ";
              
              if (hasAnsweredCurrent) {
                if (isCorrect) {
                  buttonClass += "border-green-500 bg-green-50 text-green-900";
                } else if (isWrong) {
                  buttonClass += "border-red-500 bg-red-50 text-red-900";
                } else {
                  buttonClass += "border-slate-100 text-slate-400 opacity-60";
                }
              } else {
                buttonClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={hasAnsweredCurrent}
                  className={buttonClass}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
                      ${hasAnsweredCurrent && isCorrect ? 'bg-green-200 text-green-700' : 
                        hasAnsweredCurrent && isWrong ? 'bg-red-200 text-red-700' :
                        'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </span>
                  
                  {hasAnsweredCurrent && isCorrect && <Check className="w-5 h-5 text-green-600" />}
                  {hasAnsweredCurrent && isWrong && <AlertCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in">
              <div className="flex gap-2 text-indigo-900 font-semibold mb-1">
                <CheckCircle className="w-5 h-5" />
                <span>Açıklama</span>
              </div>
              <p className="text-indigo-800 text-sm leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
              ${hasAnsweredCurrent 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            {isLastQuestion ? 'Sonucu Gör' : 'Sonraki Soru'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={onRestart}
          className="text-slate-400 text-sm hover:text-slate-600 underline"
        >
          Çıkış Yap ve Yeniden Başla
        </button>
      </div>
    </div>
  );
};
