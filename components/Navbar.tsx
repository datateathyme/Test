
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-yellow-200 shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 banana-gradient rounded-xl flex items-center justify-center shadow-lg transform rotate-12 transition-transform hover:rotate-0">
          <span className="text-2xl" role="img" aria-label="sparkle">✨</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-800">
          AnythingEdit
        </h1>
      </div>
      <div className="hidden md:flex items-center gap-4 text-sm font-medium text-yellow-800">
        <span className="bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
          Powered by Gemini 2.5
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
