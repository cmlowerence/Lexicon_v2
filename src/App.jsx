import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
        <h1 className="text-3xl font-bold text-brand-600">Lexicon App</h1>
        <p className="text-gray-600">
          Stage 1 Architecture Initialized.
        </p>
        <div className="flex justify-center gap-2 text-sm font-medium text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">React</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">Vite</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">Tailwind</span>
        </div>
      </div>
    </div>
  );
}