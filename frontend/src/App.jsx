import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import SellerPortal from './pages/SellerPortal';
import KnowYourRights from './pages/KnowYourRights';
import ScanHistory from './pages/ScanHistory';
import Contact from './pages/Contact';
import PageNotFound from './pages/NotFound';
import ComplianceBot from './components/ComplianceBot';
import { translations } from './translations';
import { DEMO_PRESETS_DATA } from './demoData';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const VALID_TABS = ['home', 'scan', 'report', 'dashboard', 'seller', 'rights', 'history', 'contact'];

const TAB_META = {
  home: { label: 'Home', parent: null },
  scan: { label: 'Scan Label', parent: 'home' },
  report: { label: 'Audit Report', parent: 'scan' },
  dashboard: { label: 'Officer Dashboard', parent: 'home' },
  seller: { label: 'Seller Portal', parent: 'home' },
  rights: { label: 'Know Your Rights', parent: 'home' },
  history: { label: 'Scan History', parent: 'home' },
  contact: { label: 'Contact Us', parent: 'home' }
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [scanResult, setScanResult] = useState(null);
  const [isProcessingPreset, setIsProcessingPreset] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const t = translations[language] || translations['en'];

  // ---- Browser history integration: back/forward + deep-linkable #hash routes ----
  useEffect(() => {
    const initial = window.location.hash.replace('#', '');
    const startTab = VALID_TABS.includes(initial) ? initial : 'home';
    setCurrentTab(startTab);
    window.history.replaceState({ tab: startTab }, '', `#${startTab}`);

    const onPopState = (e) => {
      const tab = e.state?.tab || window.location.hash.replace('#', '') || 'home';
      setCurrentTab(VALID_TABS.includes(tab) ? tab : 'home');
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Every navigation pushes a real history entry so the browser Back button works
  const navigate = useCallback(
    (tab) => {
      if (!tab || tab === currentTab) return;
      window.history.pushState({ tab }, '', `#${tab}`);
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentTab]
  );

  const handlePresetScan = async (presetKey) => {
    setIsProcessingPreset(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`/api/scan/preset/${presetKey}`, {
        method: 'POST',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
        navigate('report');
        setIsProcessingPreset(false);
        return;
      }
    } catch (err) {
      console.warn('Backend offline or slow, loading built-in demo dataset:', err);
    }

    const fallbackData = DEMO_PRESETS_DATA[presetKey] || DEMO_PRESETS_DATA['demo_compliant_biscuit'];
    setScanResult(fallbackData);
    navigate('report');
    setIsProcessingPreset(false);
  };

  const meta = TAB_META[currentTab];

  return (
    <>
      {/* Fixed left sidebar (desktop only) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={navigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className={`min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#FF7A00] selection:text-white transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar
          currentTab={currentTab}
          setCurrentTab={navigate}
          language={language}
          setLanguage={setLanguage}
          t={t}
        />

        {/* Back / breadcrumb toolbar — gives an explicit in-app Back affordance */}
        {meta && (
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-11">
              <div className="flex items-center space-x-2 min-w-0">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-[#FF7A00] bg-slate-100 hover:bg-[#FF7A00]/10 border border-slate-200 hover:border-[#FF7A00]/40 px-2.5 py-1.5 rounded-lg transition-all shrink-0"
                  title="Go back"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <nav className="hidden sm:flex items-center space-x-1 text-xs text-slate-500 min-w-0">
                  <button onClick={() => navigate('home')} className="hover:text-[#0B3B60] font-semibold transition-colors shrink-0">
                    Home
                  </button>
                  {meta.parent && meta.parent !== 'home' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <button
                        onClick={() => navigate(meta.parent)}
                        className="hover:text-[#0B3B60] font-semibold transition-colors shrink-0"
                      >
                        {TAB_META[meta.parent]?.label}
                      </button>
                    </>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="font-bold text-[#0B3B60] truncate">{meta.label}</span>
                </nav>
              </div>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block shrink-0">
                PCR 2011 Audit Engine
              </span>
            </div>
          </div>
        )}

        <main className="flex-1">
          {isProcessingPreset && (
            <div className="fixed inset-0 z-50 bg-[#0B3B60]/80 backdrop-blur-md flex flex-col items-center justify-center text-white space-y-4">
              <div className="w-16 h-16 border-4 border-white/20 border-t-[#FF7A00] rounded-full animate-spin"></div>
              <p className="text-sm font-bold tracking-wider uppercase">Loading Official Demo Dataset & OCR Evaluation...</p>
            </div>
          )}

          {currentTab === 'home' && (
            <Home setCurrentTab={navigate} t={t} onSelectPreset={handlePresetScan} />
          )}

          {currentTab === 'scan' && (
            <Scanner
              setScanResult={setScanResult}
              setCurrentTab={navigate}
              t={t}
              onPresetScan={handlePresetScan}
            />
          )}

          {currentTab === 'report' && (
            <Report scanResult={scanResult} setCurrentTab={navigate} t={t} />
          )}

          {currentTab === 'dashboard' && <Dashboard setCurrentTab={navigate} t={t} />}

          {currentTab === 'seller' && <SellerPortal setCurrentTab={navigate} t={t} />}

          {currentTab === 'rights' && <KnowYourRights t={t} />}

          {currentTab === 'history' && (
            <ScanHistory
              setCurrentTab={navigate}
              setScanResult={setScanResult}
              t={t}
            />
          )}

          {currentTab === 'contact' && <Contact setCurrentTab={navigate} t={t} />}

          {!VALID_TABS.includes(currentTab) && <PageNotFound setCurrentTab={navigate} />}
        </main>

        <ComplianceBot scanResult={scanResult} t={t} />

        <Footer setCurrentTab={navigate} />
      </div>
    </>
  );
}
