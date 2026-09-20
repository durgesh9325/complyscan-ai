import React, { useState } from 'react';
import {
  ShieldCheck,
  Scan,
  BookOpen,
  Building2,
  UserCheck,
  History,
  Globe2,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Mail
} from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, language, setLanguage, t }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#082842]/95 backdrop-blur-md text-white shadow-lg border-b border-white/10">
      {/* Top Official Ministry Status Banner */}
      <div className="bg-[#051a2c] px-4 py-1.5 text-[11px] flex justify-between items-center text-slate-300 border-b border-white/5">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-amber-300 tracking-wide">{t.nav.sihBadge || "SIH 2026 Grand Finalist"}</span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">Legal Metrology (PCR 2011) AI Engine</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-block bg-white/10 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20">
              🇮🇳 Ministry of Consumer Affairs
            </span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-md text-amber-300 font-bold transition-all text-xs border border-amber-400/30"
              title="Toggle Language"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7A00] via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-white drop-shadow" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {t.nav.brandTitle || "ComplyScan"}
                </span>
                <span className="text-[10px] bg-gradient-to-r from-[#FF7A00] to-amber-500 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider shadow-sm">
                  AI 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-300 -mt-0.5 font-medium tracking-wide">
                {t.nav.brandSub || "National Compliance Auditing"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {/* Desktop navigation now lives in the fixed Sidebar component */}
          <nav className="hidden">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'home'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.nav.home}
            </button>

            <button
              onClick={() => handleNavClick('rights')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentTab === 'rights'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.rights}</span>
            </button>

            <button
              onClick={() => handleNavClick('seller')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentTab === 'seller'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.seller}</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-[#FF7A00]/20 text-amber-300 border border-[#FF7A00]/30'
                  : 'text-slate-300 hover:text-amber-300 hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.officer}</span>
            </button>

            <button
              onClick={() => handleNavClick('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentTab === 'history'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.history}</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentTab === 'contact'
                  ? 'bg-[#FF7A00] text-white shadow-sm'
                  : 'text-slate-300 hover:text-amber-300 hover:bg-white/10'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact</span>
            </button>
          </nav>

          {/* Quick Action Button - Scan Now */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('scan')}
              className="relative group overflow-hidden bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all flex items-center space-x-2 transform active:scale-95 border border-amber-300/30"
            >
              <Scan className="w-4 h-4 text-white animate-pulse" />
              <span className="tracking-wide">{t.hero.ctaScan || "Instant Scan Label"}</span>
              <Sparkles className="w-3 h-3 text-yellow-200" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('scan')}
              className="bg-[#FF7A00] text-white p-2 rounded-lg text-xs font-bold flex items-center space-x-1"
            >
              <Scan className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#051a2c] border-b border-white/10 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
              currentTab === 'home' ? 'bg-[#FF7A00] text-white' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <span>{t.nav.home}</span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => handleNavClick('scan')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
              currentTab === 'scan' ? 'bg-[#FF7A00] text-white' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Scan className="w-4 h-4 text-amber-400" />
              <span>{t.nav.scan}</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">AI Live</span>
          </button>

          <button
            onClick={() => handleNavClick('rights')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
              currentTab === 'rights' ? 'bg-[#FF7A00] text-white' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{t.nav.rights}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => handleNavClick('seller')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
              currentTab === 'seller' ? 'bg-[#FF7A00] text-white' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{t.nav.seller}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
              currentTab === 'dashboard' ? 'bg-[#FF7A00] text-white' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{t.nav.officer}</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">Official</span>
          </button>

          <button
            onClick={() => handleNavClick('history')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
              currentTab === 'history' ? 'bg-[#FF7A00] text-white' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>{t.nav.history}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
              currentTab === 'contact' ? 'bg-[#FF7A00] text-white' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Contact Us</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      )}
    </header>
  );
}
