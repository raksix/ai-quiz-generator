import React from 'react';
import { QuizResult } from '../types';
import { Trophy, RefreshCcw, Home } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ResultsViewProps {
  result: QuizResult;
  onRestart: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onRestart }) => {
  const percentage = Math.round((result.score / result.total) * 100);
  
  const data = [
    { name: 'Correct', value: result.score },
    { name: 'Incorrect', value: result.total - result.score },
  ];
  
  const COLORS = ['#4f46e5', '#e2e8f0']; // Indigo-600, Slate-200

  let message = "";
  if (percentage >= 90) message = "Mükemmel! Konuya tamamen hakimsin.";
  else if (percentage >= 70) message = "Harika iş! Çok az eksiğin var.";
  else if (percentage >= 50) message = "Güzel başlangıç. Biraz daha tekrarla harika olacak.";
  else message = "Daha fazla çalışman gerekebilir. Pes etmek yok!";

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 text-center p-8">
      <div className="mb-6 inline-flex p-4 rounded-full bg-yellow-50 text-yellow-500 shadow-sm">
        <Trophy className="w-12 h-12" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Tamamlandı!</h2>
      <p className="text-slate-500 mb-8">{message}</p>

      <div className="h-64 w-full mb-8 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Centered Text inside Chart */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-indigo-600">%{percentage}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Başarı</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <p className="text-sm text-green-600 font-medium uppercase">Doğru</p>
          <p className="text-2xl font-bold text-green-700">{result.score}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
          <p className="text-sm text-red-600 font-medium uppercase">Yanlış</p>
          <p className="text-2xl font-bold text-red-700">{result.total - result.score}</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
      >
        <RefreshCcw className="w-5 h-5" />
        Yeni Quiz Oluştur
      </button>
    </div>
  );
};
