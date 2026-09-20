import React from 'react';
import { AlertOctagon, ArrowLeft, Home, Search, ShieldCheck } from 'lucide-react';

export default function PageNotFound({ setCurrentTab }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#082842] to-[#0B3B60] text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-[#FF7A00] to-amber-400 flex items-center justify-center shadow-2xl shadow-orange-500/30">
            <ShieldCheck className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#FF7A00] flex items-center justify-center text-white font-black text-lg shadow-lg">404</div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Page Not Found</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Ye page exist nahi karta ya humari website me se hata diya gaya hai. Lekin koi baat nahi — humari Legal Metrology AI Copilot bhi aise hi missing pages ko detect karta hai! 😄
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button onClick={() => setCurrentTab('home')} className="bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white px-7 py-3 rounded-xl text-sm font-black shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center space-x-2">
            <Home className="w-4 h-4" /><span>Back to Home</span>
          </button>
          <button onClick={() => setCurrentTab('scan')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2">
            <Search className="w-4 h-4 text-amber-300" /><span>Start Scanning</span>
          </button>
          <button onClick={() => window.history.back()} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2">
            <ArrowLeft className="w-4 h-4" /><span>Go Back</span>
          </button>
        </div>

        <div className="pt-6 text-xs text-slate-400 space-y-1">
          <p>ComplyScan AI • Smart India Hackathon 2026 • SIH26034</p>
          <p>Ministry of Consumer Affairs, Food & Public Distribution</p>
        </div>
      </div>
    </div>
  );
}