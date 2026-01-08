import React, { useState, ChangeEvent } from 'react';
import { Upload, FileText, X, Sparkles, FileType, Plus, Image as ImageIcon } from 'lucide-react';

interface SetupFormProps {
  onGenerate: (
    sourceText: string, 
    sourceFiles: File[],
    styleFiles: File[], 
    difficulty: 'easy' | 'medium' | 'hard', 
    count: number
  ) => void;
  isGenerating: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onGenerate, isGenerating }) => {
  const [sourceText, setSourceText] = useState('');
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [styleFiles, setStyleFiles] = useState<File[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [count, setCount] = useState(5);

  const handleSourceFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSourceFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleStyleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStyleFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeSourceFile = (index: number) => {
    setSourceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeStyleFile = (index: number) => {
    setStyleFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim() && sourceFiles.length === 0) return;
    onGenerate(sourceText, sourceFiles, styleFiles, difficulty, count);
  };

  const isSubmitDisabled = isGenerating || (!sourceText.trim() && sourceFiles.length === 0);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Quiz Oluşturucu
        </h2>
        <p className="text-indigo-100 mt-2">
          İçerik yükleyin (Metin, PDF, DOCX, HTML, Resim) ve AI soruları hazırlasın.
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

          {/* Source File List */}
          <div className="space-y-3">
             <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all group">
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-500">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Kaynak Dosya Ekle</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-center px-4">
                  PDF, DOCX, HTML veya Resim (Ders notu fotoğrafı vb.)
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple
                  accept=".pdf,.docx,.html,.htm,.jpg,.jpeg,.png,.webp,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html"
                  onChange={handleSourceFilesChange}
                />
             </label>

             {sourceFiles.length > 0 && (
               <div className="grid gap-2">
                 {sourceFiles.map((file, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg animate-fade-in">
                     <div className="flex items-center gap-3 overflow-hidden">
                       {file.type.startsWith('image/') ? (
                         <ImageIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                       ) : (
                         <FileType className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                       )}
                       <div className="min-w-0">
                         <p className="text-sm font-medium text-indigo-900 truncate">{file.name}</p>
                         <p className="text-[10px] text-indigo-500">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                     </div>
                     <button type="button" onClick={() => removeSourceFile(idx)} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400 hover:text-indigo-700">
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
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
          
          <div className="space-y-3">
             <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-purple-300 transition-all group">
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-500">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Örnek Sınav Yükle</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-center px-4">
                  PDF, DOCX veya Sınav Fotoğrafı
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple
                  accept=".pdf,.docx,.jpg,.jpeg,.png,.webp,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleStyleFilesChange}
                />
             </label>
             <p className="text-xs text-slate-400 px-1">
              AI, soru tarzını, zorluk seviyesini ve formatı bu dosyalardaki görsellerden veya metinlerden öğrenir.
            </p>

            {styleFiles.length > 0 && (
               <div className="grid gap-2">
                 {styleFiles.map((file, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-lg animate-fade-in">
                     <div className="flex items-center gap-3 overflow-hidden">
                       {file.type.startsWith('image/') ? (
                         <ImageIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                       ) : (
                         <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                       )}
                       <div className="min-w-0">
                         <p className="text-sm font-medium text-purple-900 truncate">{file.name}</p>
                         <p className="text-[10px] text-purple-500">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                     </div>
                     <button type="button" onClick={() => removeStyleFile(idx)} className="p-1 hover:bg-purple-100 rounded-full text-purple-400 hover:text-purple-700">
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
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