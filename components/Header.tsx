import React from 'react';

export const Header: React.FC = () => (
  <header className="text-center mb-8">
    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 pb-2">
      CSV Tunnel Analyzer
    </h1>
    <p className="text-slate-400 max-w-2xl mx-auto">
      Upload your network tunnel data in CSV format to automatically filter and categorize endpoints based on predefined rules.
    </p>
  </header>
);
