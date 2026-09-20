import React from 'react';
import {
  ShieldCheck,
  Scan,
  Home as HomeIcon,
  BookOpen,
  Building2,
  UserCheck,
  History,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { key: 'home', label: 'Home', icon: HomeIcon, hint: 'Overview & demos' },
      { key: 'scan', label: 'Scan Label', icon: Scan, hint: 'Audit a package', accent: true }
    ]
  },
  {
    title: 'Portals',
    items: [
      { key: 'dashboard', label: 'Officer Dashboard', icon: UserCheck, hint: 'National analytics' },
      { key: 'seller', label: 'Seller Portal', icon: Building2, hint: 'Pre-launch checks' }
    ]
  },
  {
    title: 'Resources',
    items: [
      { key: 'rights', label: 'Know Your Rights', icon: BookOpen, hint: 'PCR 2011 rules' },
      { key: 'history', label: 'Scan History', icon: History, hint: 'Past audits' },
      { key: 'contact', label: 'Contact', icon: Mail, hint: 'Reach the team' }
    ]
  }
];

export default function Sidebar({ currentTab, setCurrentTab, collapsed, setCollapsed }) {
  const handleClick = (key) => setCurrentTab(key);

  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen z-40 flex-col bg-[#082842] border-r border-white/10 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center space-x-3 px-4 h-16 border-b border-white/10 shrink-0">
        <button
          onClick={() => handleClick('home')}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7A00] via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/25 hover:scale-105 transition-transform shrink-0"
          title="ComplyScan AI"
        >
          <ShieldCheck className="w-6 h-6 text-white" />
        </button>
        {!collapsed && (
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black text-white tracking-tight truncate">ComplyScan</span>
              <span className="text-[9px] bg-gradient-to-r from-[#FF7A00] to-amber-500 text-white px-1.5 py-0.5 rounded font-black shrink-0">
                AI 2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 truncate">National Compliance Auditing</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleClick(item.key)}
                    title={collapsed ? item.label : item.hint}
                    className={`w-full flex items-center rounded-xl transition-all group relative ${
                      collapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/20'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {/* active left rail */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-amber-400 transition-all ${
                        isActive ? 'h-6 opacity-100' : 'h-0 opacity-0'
                      }`}
                    ></span>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.accent ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left min-w-0">
                        <span className="block text-xs font-bold truncate">{item.label}</span>
                        <span className={`block text-[10px] truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                          {item.hint}
                        </span>
                      </span>
                    )}
                    {!collapsed && isActive && <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick scan tip card */}
        {!collapsed && (
          <div className="mx-1 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-amber-500/10 border border-[#FF7A00]/30 p-3.5">
            <div className="flex items-center space-x-1.5 text-amber-300 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">Judge Demo Tip</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Bina camera ke 1-click audit — Home page ke demo presets use karein.
            </p>
          </div>
        )}
      </nav>

      {/* Footer: SIH badge + collapse toggle */}
      <div className="border-t border-white/10 p-3 space-y-2 shrink-0">
        {!collapsed && (
          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-bold text-amber-300 truncate">SIH 2026 Grand Finalist</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all py-2 ${
            collapsed ? 'justify-center' : 'justify-center space-x-2'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-[11px] font-bold">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
