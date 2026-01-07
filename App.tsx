import React, { useState } from 'react';
import { SetupForm } from './components/SetupForm';
import { QuizInterface } from './components/QuizInterface';
import { ResultsView } from './components/ResultsView';
import { generateQuizQuestions } from './services/geminiService';
import { AppState, QuizQuestion, QuizResult } from './types';
import { BookOpen } from 'lucide-react';
import mammoth from 'mammoth';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to read file as base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
           const base64Only = e.target.result.split(',')[1];
           resolve(base64Only);
        } else {
          reject(new Error("Dosya okunamadı."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleGenerate = async (
    sourceTextInput: string, 
    sourceFile: File | null,
    styleFile: File | null, 
    difficulty: 'easy' | 'medium' | 'hard', 
    count: number
  ) => {
    setAppState(AppState.LOADING);
    setError(null);

    try {
      // 1. Process Source Content
      let finalSourceText = sourceTextInput;
      let sourceFileBase64: string | undefined = undefined;
      let sourceFileMimeType: string | undefined = undefined;

      if (sourceFile) {
        if (sourceFile.type === "application/pdf") {
          sourceFileBase64 = await readFileAsBase64(sourceFile);
          sourceFileMimeType = "application/pdf";
        } else if (sourceFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const arrayBuffer = await sourceFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          finalSourceText += `\n\n[EK DOSYA İÇERİĞİ (${sourceFile.name})]:\n${result.value}`;
        } else if (sourceFile.type === "text/html" || sourceFile.name.endsWith(".html") || sourceFile.name.endsWith(".htm")) {
          const text = await readFileAsText(sourceFile);
          finalSourceText += `\n\n[EK DOSYA İÇERİĞİ (${sourceFile.name})]:\n${text}`;
        }
      }

      // 2. Process Style File
      let styleFileBase64: string | undefined = undefined;
      let styleFileMimeType: string | undefined = undefined;
      let styleFileText: string | undefined = undefined;

      if (styleFile) {
        if (styleFile.type === "application/pdf") {
          styleFileBase64 = await readFileAsBase64(styleFile);
          styleFileMimeType = "application/pdf";
        } else if (styleFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const arrayBuffer = await styleFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          styleFileText = result.value;
        }
      }

      const generatedQuestions = await generateQuizQuestions({
        sourceText: finalSourceText,
        sourceFileBase64,
        sourceFileMimeType,
        
        styleFileBase64,
        styleFileMimeType,
        styleFileText,
        
        difficulty,
        questionCount: count
      });

      setQuestions(generatedQuestions);
      setAppState(AppState.QUIZ);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Beklenmedik bir hata oluştu.");
      setAppState(AppState.SETUP);
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    setResult(result);
    setAppState(AppState.RESULTS);
  };

  const handleRestart = () => {
    setQuestions([]);
    setResult(null);
    setAppState(AppState.SETUP);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              QuizGenius
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-500">
             AI Powered Learning
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-10">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start justify-between">
            <div className="text-red-700">
              <p className="font-bold">Hata</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
          </div>
        )}

        {appState === AppState.SETUP && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                Saniyeler İçinde <span className="text-indigo-600">Sınav Oluştur</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Ders notlarını, makaleleri yapıştır veya dosya yükle. Yapay zeka senin için testler hazırlasın.
              </p>
            </div>
            <SetupForm onGenerate={handleGenerate} isGenerating={false} />
          </div>
        )}

        {appState === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center pt-20 animate-pulse">
             <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
             <h3 className="text-xl font-semibold text-slate-800">Yapay Zeka Çalışıyor...</h3>
             <p className="text-slate-500 mt-2">İçerik analiz ediliyor ve sorular oluşturuluyor.</p>
          </div>
        )}

        {appState === AppState.QUIZ && (
          <div className="animate-fade-in">
             <QuizInterface 
               questions={questions} 
               onComplete={handleQuizComplete} 
               onRestart={handleRestart}
             />
          </div>
        )}

        {appState === AppState.RESULTS && result && (
          <div className="animate-scale-up">
            <ResultsView result={result} onRestart={handleRestart} />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;