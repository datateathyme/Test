
import React, { useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import History from './components/History';
import { AppStatus, ImageHistoryItem, GenerationState } from './types';
import { processImageWithPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [genState, setGenState] = useState<GenerationState>({
    status: AppStatus.IDLE,
    message: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setGenState({ status: AppStatus.ERROR, message: 'Please enter a prompt first!' });
      return;
    }

    setGenState({ status: AppStatus.LOADING, message: 'Refining the magic pixels...' });

    try {
      const mimeType = currentImage?.split(';')[0]?.split(':')[1] || 'image/png';
      const result = await processImageWithPrompt(prompt, currentImage || undefined, mimeType);
      
      const newItem: ImageHistoryItem = {
        id: Math.random().toString(36).substring(7),
        url: result,
        prompt: prompt,
        timestamp: Date.now()
      };

      setCurrentImage(result);
      setHistory(prev => [newItem, ...prev]);
      setGenState({ status: AppStatus.IDLE, message: '' });
      setPrompt('');
    } catch (error: any) {
      console.error(error);
      setGenState({ 
        status: AppStatus.ERROR, 
        message: error.message || 'The AI encountered a glitch. Let’s try again!' 
      });
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setPrompt('');
    setGenState({ status: AppStatus.IDLE, message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 min-h-screen">
      <Navbar />

      <main className="mt-8">
        {/* Main Canvas Area */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden border-4 border-yellow-200 bg-yellow-50 shadow-2xl group transition-all duration-500 hover:border-yellow-400">
            {currentImage ? (
              <>
                <img 
                  src={currentImage} 
                  alt="Current Canvas" 
                  className="w-full h-full object-contain bg-white/50" 
                />
                <button 
                  onClick={handleReset}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg text-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Clear Canvas"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-yellow-100/50 transition-colors gap-4"
              >
                <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-yellow-800">Upload a base image</p>
                  <p className="text-sm text-yellow-600 mt-1">or use the prompt below to generate from scratch</p>
                </div>
              </div>
            )}
            
            {/* Loading Overlay */}
            {genState.status === AppStatus.LOADING && (
              <div className="absolute inset-0 bg-yellow-400/30 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
                <div className="w-16 h-16 border-4 border-white border-t-yellow-600 rounded-full animate-spin"></div>
                <p className="mt-4 font-bold text-white drop-shadow-md text-xl animate-pulse">
                  {genState.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Controls */}
        <div className="mt-8 max-w-3xl mx-auto space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-yellow-800 ml-2">Instruction</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={currentImage ? "e.g., 'make the cat wear a tiny hawaiian shirt'" : "e.g., 'a cute futuristic robot in the park'"}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-yellow-200 bg-white shadow-inner focus:outline-none focus:border-yellow-500 text-lg text-yellow-900 transition-all placeholder:text-yellow-300"
              />
              <button
                onClick={handleGenerate}
                disabled={genState.status === AppStatus.LOADING}
                className="banana-gradient hover:scale-105 active:scale-95 px-8 py-4 rounded-2xl font-bold text-yellow-900 shadow-lg transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
              >
                <span className="text-xl">✨</span>
                {currentImage ? 'Edit' : 'Create'}
              </button>
            </div>
            {genState.status === AppStatus.ERROR && (
              <p className="text-red-500 text-sm ml-2 font-medium">⚠️ {genState.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {currentImage ? (
              ['Add a retro filter', 'Make it neon style', 'Remove the background', 'Put a crown on it'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-3 py-1 bg-white border border-yellow-100 rounded-full text-xs font-medium text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                >
                  + {suggestion}
                </button>
              ))
            ) : (
              ['Cute cat with a shirt', 'Cyberpunk cityscape', 'Mysterious ice planet', 'Oil painting of a sunset'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-3 py-1 bg-white border border-yellow-100 rounded-full text-xs font-medium text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />

        {/* History Component */}
        <History 
          history={history} 
          onSelect={(item) => {
            setCurrentImage(item.url);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </main>

      {/* Persistent Call to Action */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-yellow-200 shadow-2xl md:hidden">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-yellow-700"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          UPLOAD
        </button>
        <div className="w-px h-8 bg-yellow-200"></div>
        <button 
           onClick={() => {
            setPrompt('Add a gold border');
            handleGenerate();
           }}
           className="flex flex-col items-center gap-1 text-[10px] font-bold text-yellow-700"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-sm">✨</span>
          </div>
          AUTO
        </button>
      </div>
    </div>
  );
};

export default App;
