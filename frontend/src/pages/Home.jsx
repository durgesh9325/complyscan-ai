import React, { useState, useEffect } from 'react';
import {
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Zap,
  Scale,
  Building2,
  UserCheck,
  FileText,
  Sparkles,
  Smartphone,
  Eye,
  Activity,
  Layers,
  SearchCheck,
  Cpu,
  CheckCircle,
  ShieldAlert,
  BarChart3,
  Globe2,
  Clock3,
  Users,
  Award,
  MessageCircleQuestion,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Database,
  Bot,
  HeartHandshake,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'ComplyScan AI exactly kya karta hai?',
    answer: 'ComplyScan AI packaged commodities ke labels ko OCR se read karta hai aur Legal Metrology (Packaged Commodities) Rules, 2011 ke Rule 6(1)(a)-(h), Rule 9 aur Rule 26 ke against automatically verify karta hai. Har declaration ke liye Pass, Violation, Needs Review ya Exempt verdict milta hai, saath me downloadable legal audit report bhi.'
  },
  {
    question: 'Kya yeh sirf hackathon prototype hai ya real product hai?',
    answer: 'Yeh SIH 2026 ke liye develop kiya gaya functional prototype hai, lekin architecture production-ready rakhi gayi hai: FastAPI backend, deterministic rule engine, OCR pipeline, SQLite audit database, e-commerce URL inspector, live camera capture aur statutory PDF certificate — sab live kaam karte hain.'
  },
  {
    question: 'Kya camera ke bina demo de sakte hain?',
    answer: 'Haan! Hero aur Scanner page par 4 built-in demo presets hain: Compliant Biscuits, Violation Shampoo, Blurry Spice aur Rule 26 Exempt Rice. Judges bina internet/camera ke bhi 1-click me poora audit flow dikha sakte hain.'
  },
  {
    question: 'Report kitna legally reliable hai?',
    answer: 'Report har field ke liye statutory rule citation, verification hash aur digital seal provide karta hai. Final legal authority appointed Legal Metrology Officers ke paas rehti hai, isliye report ko audit-assistance document ke roop me use kiya jata hai.'
  },
  {
    question: 'E-commerce listings bhi check hoti hain?',
    answer: 'Haan. Rule 6(10) E-Commerce URL Inspector Amazon, Flipkart aur Blinkit-style listing URLs ko parse karke digital PDP declarations verify karta hai.'
  },
  {
    question: 'Consumer grievance kaise file hoti hai?',
    answer: 'Audit report ke "File Consumer Grievance" button se pre-filled complaint modal khulta hai. ComplyScan National Consumer Helpline 1915 aur INGRAM portal ke saath guided redressal flow provide karta hai.'
  }
];

const FEATURES = [
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: 'Multi-Modal Capture',
    desc: 'Upload photo, live WebRTC camera snapshot ya e-commerce URL — teeno modes se label ingest karo.',
    color: 'bg-[#0B3B60]/10 text-[#0B3B60] border-[#0B3B60]/20'
  },
  {
    icon: <Scan className="w-6 h-6" />,
    title: 'AI OCR Pipeline',
    desc: 'Image preprocessing aur OCR se mandatory declarations ko seconds me extract karo.',
    color: 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/30'
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: 'Deterministic Rule Engine',
    desc: 'Rule 6(1)(a)-(h), Rule 9 aur Rule 26 par zero-hallucination automated verdicts.',
    color: 'bg-[#0B3B60]/10 text-[#0B3B60] border-[#0B3B60]/20'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Officer Analytics',
    desc: 'Violation density, state risk heatmap aur case registry ek command hub me.',
    color: 'bg-[#0B3B60]/10 text-[#0B3B60] border-[#0B3B60]/20'
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'Legal AI Copilot',
    desc: 'PCR 2011, Section 36 penalties aur USP formula par instant Q&A with citations.',
    color: 'bg-[#0B3B60]/10 text-[#0B3B60] border-[#0B3B60]/20'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Statutory PDF Certificate',
    desc: 'Verification hash, digital seal aur field-wise breakdown ke saath downloadable report.',
    color: 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/30'
  }
];

const SAMPLE_AUDITS = [
  {
    title: 'HealthyBite Digestive Biscuits',
    status: 'PASS',
    score: '100%',
    desc: 'All 9 mandatory declarations detected and verified',
    icon: <CheckCircle2 className="w-5 h-5 text-[#0B3B60]" />,
    accent: 'border-[#0B3B60]/30 bg-[#0B3B60]/5'
  },
  {
    title: 'SilkGlow Herbal Shampoo',
    status: 'VIOLATION',
    score: '67%',
    desc: 'Missing inclusive-tax MRP and consumer care contact',
    icon: <AlertOctagon className="w-5 h-5 text-[#FF7A00]" />,
    accent: 'border-[#FF7A00]/40 bg-[#FF7A00]/5'
  },
  {
    title: 'Royal Garam Masala 100g',
    status: 'REVIEW',
    score: '74%',
    desc: 'Blurry manufacturing date requires officer review',
    icon: <Eye className="w-5 h-5 text-[#0B3B60]" />,
    accent: 'border-[#0B3B60]/30 bg-[#0B3B60]/5'
  }
];

const LIVE_STATS = [
  { value: 1248, suffix: '+', label: 'Audits Processed', icon: <Database className="w-4 h-4" /> },
  { value: 96, suffix: '%', label: 'Rule Accuracy', icon: <ShieldCheck className="w-4 h-4" /> },
  { value: 28, suffix: '', label: 'States Covered', icon: <MapPin className="w-4 h-4" /> },
  { value: 3, suffix: 's', label: 'Avg. Audit Time', icon: <Clock3 className="w-4 h-4" /> }
];

export default function Home({ setCurrentTab, t, onSelectPreset }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(LIVE_STATS.map(() => 0));

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats(LIVE_STATS.map(stat => Math.round(stat.value * eased)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#082842] via-[#0B3B60] to-[#072740] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF7A00_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute -top-24 right-10 w-96 h-96 bg-[#FF7A00]/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold text-amber-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{t.hero.tag || "Ministry of Consumer Affairs • Legal Metrology AI Audit"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200">
            {t.hero.headline}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.hero.subhead}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <button onClick={() => setCurrentTab('scan')} className="w-full sm:w-auto bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white px-8 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all flex items-center justify-center space-x-2.5 transform hover:-translate-y-0.5 active:translate-y-0 border border-amber-300/30">
              <Scan className="w-4 h-4 text-white animate-pulse" />
              <span>{t.hero.ctaScan || "Instant Label Audit"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentTab('dashboard')} className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl text-sm font-bold backdrop-blur-md transition-all flex items-center justify-center space-x-2">
              <Activity className="w-4 h-4 text-amber-300" />
              <span>National Officer Dashboard</span>
            </button>
          </div>

          <div className="pt-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-xs text-amber-300 font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Hackathon Live Demos (No camera needed):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'demo_compliant_biscuit', label: '100% Compliant', sub: 'Biscuits 500g', icon: CheckCircle2, bg: 'bg-white/10 hover:bg-white/20', text: 'text-white', border: 'border-white/30', iconColor: 'text-amber-300' },
                { key: 'demo_violation_shampoo', label: 'Violation Found', sub: 'Shampoo 200ml', icon: AlertOctagon, bg: 'bg-[#FF7A00]/20 hover:bg-[#FF7A00]/30', text: 'text-amber-200', border: 'border-[#FF7A00]/40', iconColor: 'text-amber-300' },
                { key: 'demo_blurry_spice', label: 'Needs Review', sub: 'Spices 100g', icon: Eye, bg: 'bg-white/10 hover:bg-white/20', text: 'text-white', border: 'border-white/30', iconColor: 'text-amber-300' },
                { key: 'demo_exempt_bulk_rice', label: 'Exempt (Rule 26)', sub: 'Bulk Rice 30kg', icon: Scale, bg: 'bg-[#FF7A00]/20 hover:bg-[#FF7A00]/30', text: 'text-amber-200', border: 'border-[#FF7A00]/40', iconColor: 'text-amber-300' }
              ].map((preset) => {
                const Icon = preset.icon;
                return (
                  <button key={preset.key} onClick={() => onSelectPreset(preset.key)} className={`text-xs ${preset.bg} ${preset.text} border ${preset.border} p-2.5 rounded-xl flex flex-col items-center space-y-1 transition-all group`}>
                    <Icon className={`w-4 h-4 ${preset.iconColor} group-hover:scale-110 transition-transform`} />
                    <span className="font-bold">{preset.label}</span>
                    <span className="text-[10px] opacity-70">{preset.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl text-center group hover:bg-white/10 transition-colors">
              <div className="text-2xl font-black text-amber-400">&lt; 3.0s</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">OCR + Rule Audit Speed</div>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl text-center group hover:bg-white/10 transition-colors">
              <div className="text-2xl font-black text-amber-400">9 Statutory Rules</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">PCR 2011 Automated Logic</div>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl text-center group hover:bg-white/10 transition-colors">
              <div className="text-2xl font-black text-amber-400">100% Deterministic</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">Zero Hallucination Verifier</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST / PROBLEM STRIP ============ */}
      <section className="border-b border-slate-200 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#0B3B60] bg-[#0B3B60]/10 border border-[#0B3B60]/20 px-3 py-1 rounded-full">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>The Compliance Gap</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Packaging labels chhote lagte hain, lekin non-compliance ka impact bahut bada hota hai.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Har saal hazaron packaged commodities missing MRP declarations, incorrect unit pricing aur illegible manufacturing details ki wajah se market se hatae jate hain. ComplyScan consumers, sellers aur enforcement officers ko ek hi intelligent platform par lata hai.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {['Rule 6(1)(a)-(h)', 'Rule 9 PDP Standards', 'Rule 26 Exemptions', 'Section 36 Penalties'].map((tag, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-semibold shadow-sm">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Live Compliance Signal</p>
                  <h3 className="text-base font-bold text-slate-900 mt-1">National Audit Feed</h3>
                </div>
                <span className="flex items-center space-x-1.5 text-[10px] font-bold text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]/30 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse"></span>
                  <span>LIVE</span>
                </span>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'FMCG / Biscuits & Snacks', value: '80%', color: 'bg-[#0B3B60]' },
                  { label: 'Personal Care & Cosmetics', value: '71%', color: 'bg-[#FF7A00]' },
                  { label: 'Spices & Food Ingredients', value: '81%', color: 'bg-[#0B3B60]' },
                  { label: 'Packaged Agri / Rice & Pulses', value: '75%', color: 'bg-[#FF7A00]' }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-slate-600 mb-1"><span>{item.label}</span><span className="font-bold text-slate-900">{item.value}</span></div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.color}`} style={{ width: item.value }}></div></div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">Illustrative national compliance distribution • Updated just now</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ANIMATED STATS ============ */}
      <section className="bg-[#0B3B60] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Platform Impact</span>
            <h2 className="text-2xl sm:text-3xl font-black">Compliance Intelligence, Live</h2>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">Every scan strengthens the national compliance knowledge graph.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {LIVE_STATS.map((stat, idx) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-center space-x-1.5 text-amber-400 mb-2">{stat.icon}<span className="text-[10px] uppercase tracking-wider font-bold">Metric</span></div>
                <div className="text-3xl sm:text-4xl font-black text-white">{animatedStats[idx]}<span className="text-amber-400">{stat.suffix}</span></div>
                <div className="text-xs text-slate-300 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center space-x-1 text-xs font-extrabold text-[#FF7A00] uppercase tracking-wider bg-[#FF7A00]/10 px-3 py-1 rounded-full"><Cpu className="w-3.5 h-3.5" /><span>Product Capabilities</span></div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Ek Platform. Complete Compliance Lifecycle.</h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">Capture se lekar legal report tak — har stakeholder ke liye purpose-built workflow.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>{feature.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feature.desc}</p>
              <button onClick={() => setCurrentTab(idx === 3 ? 'dashboard' : idx === 4 ? 'scan' : 'scan')} className="mt-4 inline-flex items-center space-x-1 text-[11px] font-bold text-[#0B3B60] group-hover:text-[#FF7A00] transition-colors">
                <span>Explore feature</span><ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SAMPLE AUDIT PREVIEW ============ */}
      <section className="bg-slate-50 border-y border-slate-200 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-[#0B3B60] uppercase tracking-wider bg-[#0B3B60]/10 border border-[#0B3B60]/20 px-3 py-1 rounded-full">Sample Audit Intelligence</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Har Product Ka Legal Dossier</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Field-by-field verdicts, statutory citations aur remediation guidance — ek hi structured report me.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SAMPLE_AUDITS.map((audit) => (
              <div key={audit.title} className={`rounded-3xl border p-6 bg-white shadow-sm hover:shadow-md transition-all ${audit.accent}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">{audit.icon}</div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full ${audit.status === 'PASS' ? 'bg-[#0B3B60]/10 text-[#0B3B60]' : audit.status === 'VIOLATION' ? 'bg-[#FF7A00]/15 text-[#FF7A00]' : 'bg-[#0B3B60]/10 text-[#0B3B60]'}`}>{audit.status}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{audit.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{audit.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-xs text-slate-500">Compliance Score</span>
                  <span className="text-lg font-black text-slate-900">{audit.score}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => onSelectPreset('demo_compliant_biscuit')} className="inline-flex items-center space-x-2 bg-[#0B3B60] hover:bg-[#082842] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
              <FileText className="w-4 h-4" /><span>Open Full Sample Report</span><ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center space-x-1 text-xs font-extrabold text-[#FF7A00] uppercase tracking-wider bg-[#FF7A00]/10 px-3 py-1 rounded-full"><Layers className="w-3.5 h-3.5" /><span>Intelligent Pipeline</span></div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">From Package Label to Legal Audit in 3 Seconds</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Smartphone, color: 'bg-[#0B3B60]/10 text-[#0B3B60]', title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, num: '01' },
            { icon: Scale, color: 'bg-[#FF7A00]/10 text-[#FF7A00]', title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, num: '02' },
            { icon: FileText, color: 'bg-[#0B3B60]/10 text-[#0B3B60]', title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, num: '03' }
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="absolute top-5 right-5 text-4xl font-black text-slate-100 group-hover:text-[#FF7A00]/20 transition-colors">{step.num}</div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${step.color}`}><Icon className="w-6 h-6" /></div>
                <span className="text-xs font-black text-[#FF7A00] uppercase tracking-wider">Step {step.num}</span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ STAKEHOLDERS ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Comprehensive Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-black">Tailored for Every Stakeholder</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">Empowering consumers, helping businesses self-audit pre-launch, and providing enforcement officers with live analytics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { tab: 'scan', icon: Scan, color: 'bg-amber-500/20 text-amber-400', hover: 'hover:border-amber-400', title: 'Citizen & Consumer', desc: 'Scan any retail or e-commerce package instantly. Know your rights and file 1-click grievances directly with the Ministry.', cta: 'Start Scanning' },
              { tab: 'seller', icon: Building2, color: 'bg-white/10 text-white', hover: 'hover:border-[#FF7A00]', title: 'Business & Manufacturer', desc: 'Pre-verify label artworks & batch e-commerce catalogs before print to prevent costly recall notices and non-compliance penalties.', cta: 'Open Business Portal' },
              { tab: 'dashboard', icon: UserCheck, color: 'bg-white/10 text-white', hover: 'hover:border-[#FF7A00]', title: 'Legal Metrology Officers', desc: 'Access live national audit feeds, violation hotspots, state risk distribution, and formal notice issuance registry.', cta: 'Officer Command Hub' }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} onClick={() => setCurrentTab(card.tab)} className={`bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700/60 ${card.hover} shadow-sm transition-all cursor-pointer group flex flex-col justify-between`}>
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5" /></div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">{card.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-amber-400"><span>{card.cta}</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-slate-50 border-t border-slate-200 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-[#0B3B60] uppercase tracking-wider bg-[#0B3B60]/10 border border-[#0B3B60]/20 px-3 py-1 rounded-full">Knowledge Base</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600">Platform, legal framework aur demo flow ke baare me quick answers.</p>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`bg-white rounded-2xl border transition-all ${isOpen ? 'border-[#FF7A00]/40 shadow-md' : 'border-slate-200 shadow-sm'}`}>
                  <button onClick={() => setOpenFaq(isOpen ? -1 : idx)} className="w-full flex items-center justify-between text-left p-5">
                    <span className="text-sm font-bold text-slate-900">{item.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#FF7A00] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="h-px bg-slate-100 mb-4"></div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#082842] to-[#0B3B60] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#FF7A00]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative space-y-5 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-amber-300"><ShieldCheck className="w-3.5 h-3.5" /><span>SIH 2026 Grand Finalist Prototype</span></div>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">Compliance ko banao transparent, fast aur accessible.</h2>
            <p className="text-sm text-slate-300 leading-relaxed">Ek label scan se lekar national enforcement analytics tak — ComplyScan AI har stakeholder ko empower karta hai.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button onClick={() => setCurrentTab('scan')} className="bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white px-7 py-3 rounded-xl text-sm font-black shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center space-x-2"><Scan className="w-4 h-4" /><span>Start Your First Audit</span></button>
              <button onClick={() => setCurrentTab('contact')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2"><MessageCircleQuestion className="w-4 h-4 text-amber-300" /><span>Talk to Our Team</span></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
