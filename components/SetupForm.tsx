import React, { useState, ChangeEvent } from 'react';
import { Upload, FileText, X, Sparkles, FileType } from 'lucide-react';

interface SetupFormProps {
  onGenerate: (
    sourceText: string, 
    sourceFile: File | null,
    styleFile: File | null, 
    difficulty: 'easy' | 'medium' | 'hard', 
    count: number
  ) => void;
  isGenerating: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onGenerate, isGenerating }) => {
  const [sourceText, setSourceText] = useState('');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [styleFile, setStyleFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [count, setCount] = useState(5);

  const handleSourceFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSourceFile(e.target.files[0]);
    }
  };

  const handleStyleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStyleFile(e.target.files[0]);
    }
  };

  const removeSourceFile = () => setSourceFile(null);
  const removeStyleFile = () => setStyleFile(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim() && !sourceFile) return;
    onGenerate(sourceText, sourceFile, styleFile, difficulty, count);
  };

  const isSubmitDisabled = isGenerating || (!sourceText.trim() && !sourceFile);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Quiz Oluşturucu
        </h2>
        <p className="text-indigo-100 mt-2">
          İçerik yükleyin (Metin, PDF, DOCX, HTML) ve AI soruları hazırlasın.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Source Content Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">ADIM 1</span>
            <h3 className="text-lg font-semibold text-slate-800">Kaynak İçerik</h3>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="sourceText" className="block text-sm font-medium text-slate-700">
              Metin Yapıştır
            </label>
            <textarea
              id="sourceText"
              className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder:text-slate-400 text-sm"
              placeholder="Sınav yapmak istediğiniz metni buraya yapıştırın..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">veya dosya yükle</span>
            </div>
          </div>

          <div>
             {!sourceFile ? (
               <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-500 mb-1">
                        <Upload className="w-6 h-6" />
                        <span className="text-sm font-medium">Kaynak Dosya Seç</span>
                      </div>
                      <p className="text-xs text-slate-400">PDF, DOCX veya HTML</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.docx,.html,.htm,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html"
                    onChange={handleSourceFileChange}
                  />
               </label>
             ) : (
                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileType className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-indigo-900 truncate">{sourceFile.name}</p>
                      <p className="text-xs text-indigo-500">{(sourceFile.size / 1024).toFixed(1)} KB • Kaynak</p>
                    </div>
                  </div>
                  <button type="button" onClick={removeSourceFile} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400 hover:text-indigo-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
             )}
          </div>
        </div>

        {/* Style File Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
             <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">ADIM 2 (Opsiyonel)</span>
             <h3 className="text-lg font-semibold text-slate-800">Örnek Sınav Stili</h3>
          </div>
          
          <div className="space-y-2">
            {!styleFile ? (
              <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-purple-300 transition-all group">
                 <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-500">
                   <FileText className="w-5 h-5" />
                   <span className="text-sm">Örnek Sınav Yükle (PDF/DOCX)</span>
                 </div>
                 <input 
                   type="file" 
                   className="hidden" 
                   accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                   onChange={handleStyleFileChange}
                 />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-purple-900 truncate">{styleFile.name}</p>
                    <p className="text-xs text-purple-500">{(styleFile.size / 1024).toFixed(1)} KB • Stil</p>
                  </div>
                </div>
                <button type="button" onClick={removeStyleFile} className="p-1 hover:bg-purple-100 rounded-full text-purple-400 hover:text-purple-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400 px-1">
              AI, soru tarzını ve zorluk yapısını bu dosyadan öğrenir.
            </p>
          </div>
        </div>

        {/* Settings Section */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Zorluk</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="easy">Kolay</option>
              <option value="medium">Orta</option>
              <option value="hard">Zor</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Soru Sayısı</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value={3}>3 Soru</option>
              <option value={5}>5 Soru</option>
              <option value={10}>10 Soru</option>
              <option value={15}>15 Soru</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg shadow-lg transition-all 
            ${isSubmitDisabled
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 active:scale-[0.98]'
            }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sorular Hazırlanıyor...
            </span>
          ) : (
            'Quiz Oluştur'
          )}
        </button>
      </form>
    </div>
  );
};