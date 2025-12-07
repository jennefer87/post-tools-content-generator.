import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { ContentPackage, UserInput } from './types';
import { generatePostContent } from './services/geminiService';
import { Zap, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<ContentPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await generatePostContent(input);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong generating the content.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 selection:bg-yellow-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-1.5 rounded-lg shadow-lg shadow-yellow-500/20">
               <Zap className="w-5 h-5 text-slate-900 fill-slate-900" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              POST <span className="text-yellow-500">Tools</span>
              <span className="text-xs ml-2 font-normal text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">Nano Banana</span>
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* Intro */}
        {!result && !isLoading && (
            <div className="text-center mb-12 animate-fade-in space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    Social Media Content <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        Generated in Seconds
                    </span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Upload a reference image, define your niche, and let our AI architect the perfect content package for your brand.
                </p>
            </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Input Section - Sticky on large screens if result is shown */}
          <div className={`w-full lg:max-w-md transition-all duration-500 ${result ? 'lg:sticky lg:top-24' : 'mx-auto'}`}>
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            
            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 animate-shake">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className="w-full flex-1 min-w-0 animate-fade-in-up">
              <ResultDisplay data={result} />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-900 mt-auto py-8 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} POST Tools. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;