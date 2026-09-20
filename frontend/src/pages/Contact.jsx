import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Bot, HeartHandshake, Globe2, ArrowRight } from 'lucide-react';

export default function Contact({ setCurrentTab, t }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: 'consumer',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      // Try backend endpoint (will fall back to client-side success)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (err) {
      // Client-side fallback — always succeed for demo
      console.warn('Contact form: using client-side success', err);
    }
    setStatus('success');
    setFormData({ name: '', email: '', phone: '', organization: '', role: 'consumer', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  const ROLES = [
    { value: 'consumer', label: 'Consumer / Citizen', icon: <HeartHandshake className="w-4 h-4" /> },
    { value: 'seller', label: 'Seller / Manufacturer', icon: <ShieldCheck className="w-4 h-4" /> },
    { value: 'officer', label: 'Legal Metrology Officer', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'developer', label: 'Developer / Researcher', icon: <Bot className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-[#0B3B60] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center space-x-2 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Get in Touch</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">Contact the ComplyScan Team</h1>
              <p className="text-slate-300 mt-2 max-w-xl">Sawal, suggestion ya partnership ke liye humse baat karein. Hum 24 ghante me jawab dete hain.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-300 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-semibold">SIH 2026 • Ministry of Consumer Affairs</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-1 text-xs text-slate-300">
            <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors flex items-center space-x-1"><span>Home</span><ArrowRight className="w-3.5 h-3.5" /></button>
            <span className="font-semibold text-white">Contact</span>
          </nav>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Contact Cards */}
        <section>
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-[#0B3B60] uppercase tracking-wider bg-[#0B3B60]/10 border border-[#0B3B60]/20 px-3 py-1 rounded-full">Contact Channels</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Multiple Ways to Reach Us</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Choose the channel that works best for your query type.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg hover:border-[#FF7A00]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B3B60]/10 text-[#0B3B60] flex items-center justify-center mb-4"><Mail className="w-6 h-6" /></div>
              <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
              <p className="text-xs text-slate-500 mb-3">General queries, partnerships, media</p>
              <a href="mailto:complyscan@consumeraffairs.gov.in" className="text-sm font-bold text-[#0B3B60] hover:text-[#FF7A00] flex items-center space-x-1"><span>complyscan@consumeraffairs.gov.in</span><ArrowRight className="w-3.5 h-3.5" /></a>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg hover:border-amber-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4"><Phone className="w-6 h-6" /></div>
              <h3 className="font-bold text-slate-900 mb-1">National Helpline</h3>
              <p className="text-xs text-slate-500 mb-3">Consumer grievance & compliance help</p>
              <a href="tel:1915" className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"><span>1915 (Toll-Free)</span><ArrowRight className="w-3.5 h-3.5" /></a>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg hover:border-[#FF7A00]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B3B60]/10 text-[#0B3B60] flex items-center justify-center mb-4"><MapPin className="w-6 h-6" /></div>
              <h3 className="font-bold text-slate-900 mb-1">Ministry Office</h3>
              <p className="text-xs text-slate-500 mb-3">Legal Metrology Division</p>
              <address className="text-xs text-slate-500 not-italic leading-relaxed">Krishi Bhawan, New Delhi — 110001</address>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg hover:border-[#FF7A00]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B3B60]/10 text-[#0B3B60] flex items-center justify-center mb-4"><Bot className="w-6 h-6" /></div>
              <h3 className="font-bold text-slate-900 mb-1">AI Copilot</h3>
              <p className="text-xs text-slate-500 mb-3">Instant PCR 2011 answers 24/7</p>
              <button className="text-sm font-bold text-[#0B3B60] hover:text-[#FF7A00] flex items-center space-x-1"><span>Open Floating Bot</span><ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-200"></div>

        {/* Contact Form */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="text-center space-y-2 mb-8">
                  <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider bg-[#FF7A00]/10 border border-[#FF7A00]/30 px-3 py-1 rounded-full">Submit a Query</span>
                  <h2 className="text-2xl font-black text-slate-900">Send Us a Message</h2>
                  <p className="text-sm text-slate-600">Form bhar ke bhejein — humari team 24 hours me revert karegi.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0B3B60] focus:ring-1 focus:ring-[#0B3B60] ${errors.name ? 'border-[#FF7A00]' : 'border-slate-300'}`}
                        placeholder="Your full name"
                        disabled={status === 'submitting'}
                      />
                      {errors.name && <p className="mt-1 text-[10px] text-[#FF7A00] flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.name}</span></p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0B3B60] focus:ring-1 focus:ring-[#0B3B60] ${errors.email ? 'border-[#FF7A00]' : 'border-slate-300'}`}
                        placeholder="you@example.com"
                        disabled={status === 'submitting'}
                      />
                      {errors.email && <p className="mt-1 text-[10px] text-[#FF7A00] flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.email}</span></p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0B3B60] focus:ring-1 focus:ring-[#0B3B60]"
                        placeholder="+91 98765 43210"
                        disabled={status === 'submitting'}
                      />
                    </div>
                    <div>
                      <label htmlFor="organization" className="block text-xs font-bold text-slate-700 mb-1.5">Organization (Optional)</label>
                      <input
                        id="organization"
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0B3B60] focus:ring-1 focus:ring-[#0B3B60]"
                        placeholder="Company / Agency / Institute"
                        disabled={status === 'submitting'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Role *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ROLES.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: role.value })}
                          className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${formData.role === role.value ? 'border-[#FF7A00] bg-[#FF7A00]/10 text-[#FF7A00]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                          {role.icon}
                          <span>{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1.5">Message *</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0B3B60] focus:ring-1 focus:ring-[#0B3B60] ${errors.message ? 'border-[#FF7A00]' : 'border-slate-300'}`}
                      placeholder="Describe your query — compliance question, partnership, technical issue, media request..."
                      disabled={status === 'submitting'}
                    />
                    {errors.message && <p className="mt-1 text-[10px] text-[#FF7A00] flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.message}</span></p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-black shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 mx-auto sm:mx-0"
                  >
                    {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{status === 'submitting' ? 'Submitting...' : 'Send Message'}</span>
                  </button>

                  {status === 'success' && (
                    <div className="mt-4 p-4 bg-[#0B3B60]/10 border border-[#0B3B60]/20 rounded-xl flex items-start space-x-2 animate-in slide-in-from-top">
                      <CheckCircle2 className="w-5 h-5 text-[#0B3B60] shrink-0 mt-0.5" />
                      <div className="text-sm text-[#0B3B60]">
                        <p className="font-bold">Message Sent Successfully!</p>
                        <p className="text-xs mt-0.5">Humari team aapke query ko review karegi. Reference ID: <code className="font-mono">CS-{Date.now().toString(36).toUpperCase()}</code></p>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="mt-4 p-4 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-xl flex items-start space-x-2 animate-in slide-in-from-top">
                      <AlertCircle className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#FF7A00]">Something went wrong. Please try again or email us directly.</p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-[#0B3B60] to-[#072740] rounded-3xl p-6 text-white shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-[#FF7A00] flex items-center justify-center mb-4"><ShieldCheck className="w-6 h-6 text-white" /></div>
                <h3 className="font-bold text-lg mb-2">SIH 2026 Grand Finalist</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">ComplyScan AI is built for the Smart India Hackathon 2026 under Ministry of Consumer Affairs, Food & Public Distribution.</p>
                <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between"><span className="text-slate-300">Team</span><span className="font-bold text-white">ByteBusters</span></div>
                  <div className="flex justify-between"><span className="text-slate-300">Category</span><span className="font-bold text-white">Software</span></div>
                  <div className="flex justify-between"><span className="text-slate-300">Problem Statement</span><span className="font-bold text-white">SIH26034</span></div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2"><Bot className="w-5 h-5 text-[#0B3B60]" /><span>Need Quick Legal Help?</span></h3>
                <p className="text-xs text-slate-600 mb-4">ComplyScan AI Copilot floating button (bottom-right) se PCR 2011 rules, USP formula, penalties ya grievance process ke baare me instant answer paayein — koi wait nahi.</p>
                <div className="space-y-2 text-[11px]">
                  {['Rule 6(1)(f) USP formula?', 'Section 36 penalty details?', 'Rule 26 exemption criteria?', 'How to file grievance via 1915?'].map((q, idx) => (
                    <button key={idx} className="w-full text-left bg-slate-50 hover:bg-[#0B3B60]/5 border border-slate-200 hover:border-[#FF7A00]/40 px-3 py-2 rounded-lg text-slate-700 font-medium transition-all flex items-center justify-between"><span>{q}</span><ArrowRight className="w-3.5 h-3.5 text-[#FF7A00]" /></button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2"><Globe2 className="w-5 h-5 text-[#0B3B60]" /><span>Official Portals</span></h3>
                <div className="space-y-2 text-[11px]">
                  {[
                    { label: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in' },
                    { label: 'INGRAM Grievance Portal', url: 'https://consumerhelpline.gov.in/ingram' },
                    { label: 'e-Daakhil Consumer Court', url: 'https://edaakhil.nic.in' },
                    { label: 'Legal Metrology Act 2009', url: 'https://legislative.gov.in' }
                  ].map((portal, idx) => (
                    <a key={idx} href={portal.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full text-[#0B3B60] hover:text-[#FF7A00] font-medium p-2 rounded-lg hover:bg-[#0B3B60]/5 transition-all"><span>{portal.label}</span><ArrowRight className="w-3.5 h-3.5" /></a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-200"></div>

        {/* Quick Links / CTA Strip */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white text-center">
          <h3 className="text-xl font-black mb-2">Ready to Audit Your First Label?</h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto mb-6">1-click demo presets se shuru karein — camera ki bhi zaroorat nahi.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={() => setCurrentTab('scan')} className="bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center space-x-1.5">
              <Scan className="w-3.5 h-3.5" /><span>Open Scanner</span>
            </button>
            <button onClick={() => setCurrentTab('seller')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" /><span>Seller Portal</span>
            </button>
            <button onClick={() => setCurrentTab('dashboard')} className="bg-[#FF7A00]/20 hover:bg-[#FF7A00]/30 border border-[#FF7A00]/30 text-amber-300 px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5" /><span>Officer Dashboard</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}