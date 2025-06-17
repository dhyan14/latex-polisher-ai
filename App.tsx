
import React from 'react';
import { Header } from './components/Header';
import { LatexEditor } from './components/LatexEditor';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <LatexEditor />
      </main>
      <footer className="text-center py-4 text-sm text-slate-400">
        Powered by Gemini & React. Typeset your ideas with precision.
      </footer>
    </div>
  );
};

export default App;
