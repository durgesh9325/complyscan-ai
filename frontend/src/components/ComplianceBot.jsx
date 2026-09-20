import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  HelpCircle,
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  Zap,
  Mic,
  MicOff,
  RotateCcw,
  MessageSquare
} from 'lucide-react';

export default function ComplianceBot({ scanResult, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste! I am your **Legal Metrology AI Copilot** 🇮🇳.\n\nI can assist you with compliance audits, PCR 2011 statutory declarations, Section 36 penalties, Unit Sale Price (USP) calculations, and consumer grievance filing. How can I help you today?",
      citations: ["PCR 2011", "Legal Metrology Act 2009"],
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Quick Suggested Questions
  const SUGGESTED_QUESTIONS = [
    { text: "What is Rule 6(1)(f) USP?", icon: "💡" },
    { text: "What are penalties under Section 36?", icon: "⚖️" },
    { text: "Is bulk packaging (25kg+) exempt under Rule 26?", icon: "🌾" },
    { text: "What are mandatory e-commerce PDP rules?", icon: "🛒" },
    { text: "Rule 9 minimum font size table", icon: "📐" },
    { text: "How to lodge a consumer grievance (1915)?", icon: "📞" }
  ];

  // Speech Recognition Setup (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please type your query.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  // Client-Side Fallback Knowledge Engine (guarantees 100% offline hackathon uptime)
  const getOfflineAIResponse = (query, currentScan) => {
    const q = query.toLowerCase().trim();

    // 1. Current Scanned Product
    if (currentScan && (q.includes('this product') || q.includes('scan') || q.includes('score') || q.includes('violation') || q.includes('pass') || q.includes('fail') || q.includes('kyu') || q.includes('kyun') || q.includes('reason'))) {
      const evalData = currentScan.evaluation || {};
      const score = evalData.compliance_score || 0;
      const status = evalData.overall_status || 'UNKNOWN';
      const fields = evalData.fields || [];
      const violations = fields.filter(f => f.status === 'VIOLATION' || f.status === 'POSSIBLE_VIOLATION');

      if (status === 'PASS') {
        return {
          reply: `✅ **${currentScan.title || 'Scanned Label'}** is **100% Compliant (Score: ${score}%)**!\n\nAll 9 statutory declarations required under **Rule 6(1) PCR 2011** were detected and verified:\n• Manufacturer/Packer Address: Verified\n• MRP with 'Inclusive of all taxes': Verified\n• Unit Sale Price (USP): Correctly calculated\n• Consumer Care Contact: Valid email & phone found\n• Net Quantity & Mfg Date: Standard SI units verified.\n\nNo legal violations found. This package is legally ready for retail sale.`,
          citations: ["Rule 6(1)(a)-(h) PCR 2011", "Section 18 LM Act 2009"]
        };
      } else if (status === 'EXEMPT') {
        return {
          reply: `⚖️ **${currentScan.title || 'Product'}** is classified as **EXEMPT under Rule 26**.\n\n**Reason:** ${evalData.summary || 'Package exceeds standard retail weight thresholds.'}\n\nUnder **Rule 26 of PCR 2011**, packages containing net quantity > 25 kg or > 25 L meant for industrial or institutional buyers do not require standard retail consumer declarations.`,
          citations: ["Rule 26 PCR 2011 Exemptions", "Ministry Notification GSR 779(E)"]
        };
      } else {
        const vList = violations.map(v => `• **${v.rule_id} - ${v.rule_name}**: ${v.issue} *(Remedy: ${v.remedy || 'Update label artwork'})*`).join('\n');
        return {
          reply: `⚠️ **Audit Analysis for ${currentScan.title || 'Scanned Product'} (Score: ${score}%, Status: ${status})**:\n\n**Violations Detected:**\n${vList || '• Mandatory declarations missing or illegible.'}\n\n**Legal Consequence:** Non-compliance invites compounding fines under **Section 36 of Legal Metrology Act, 2009** (up to ₹25,000 for first offence). All missing fields must be updated prior to commercial release.`,
          citations: ["Rule 6(1) PCR 2011", "Section 36 LM Act 2009"]
        };
      }
    }

    // 2. Unit Sale Price (USP)
    if (q.includes('usp') || q.includes('unit sale price') || q.includes('per gram') || q.includes('per ml') || q.includes('price per')) {
      return {
        reply: `💡 **Unit Sale Price (USP) — Rule 6(1)(f) of PCR 2011**:\n\n1. **Mandatory Declaration:** Every pre-packaged commodity sold in India must display the unit sale price:\n   • If Net Qty **≤ 1 kg or 1 L**: Price **per g (₹/g)** or **per ml (₹/ml)**.\n   • If Net Qty **> 1 kg or 1 L**: Price **per kg (₹/kg)** or **per litre (₹/L)**.\n   • For items sold by number: Price **per piece / item**.\n2. **Effective Date:** Mandatory since 1st December 2022.\n3. **Calculation Formula:** \`USP = MRP ÷ Net Quantity\` (rounded to 2 decimals).\n4. **Exemption:** Not required if the package is exactly 1 kg, 1 litre, or 1 unit.`,
        citations: ["Rule 6(1)(f) PCR 2011", "Legal Metrology Amendment Rules 2021"]
      };
    }

    // 3. Penalties & Section 36
    if (q.includes('penalty') || q.includes('fine') || q.includes('section 36') || q.includes('jail') || q.includes('punishment') || q.includes('chalan') || q.includes('challan')) {
      return {
        reply: `⚖️ **Statutory Penalties under Legal Metrology Act, 2009 (Section 36)**:\n\n• **First Offence:** Fine up to **₹25,000** for non-compliant packaging or missing declarations.\n• **Second Offence:** Fine up to **₹50,000**.\n• **Subsequent Offences:** Fine up to **₹1,00,000** or imprisonment up to **1 year**, or both.\n• **Selling above MRP (Section 36(2)):** Up to ₹2,000 fine for retailer plus consumer compensation.\n• **Compounding:** Non-willful first offences can be compounded by designated Legal Metrology Officers under Section 48.`,
        citations: ["Section 36 LM Act 2009", "Section 48 (Compounding)", "Section 53"]
      };
    }

    // 4. Rule 26 Exemptions
    if (q.includes('exempt') || q.includes('rule 26') || q.includes('bulk') || q.includes('25kg') || q.includes('25 kg') || q.includes('50kg')) {
      return {
        reply: `🌾 **Exemptions under Rule 26 of PCR 2011**:\n\nStandard mandatory declarations under Rule 6 do **NOT** apply to:\n1. Packages containing quantities **> 25 kg or > 25 Litres** (excluding cement & agricultural fertilizers packed up to 50kg) intended for institutional/industrial buyers.\n2. Packages containing quantities **≤ 10 g or ≤ 10 ml** (except tobacco & cosmetics).\n3. Packages intended exclusively for institutional consumers (railways, airlines, hospitals).\n4. Fast food items packed by restaurants/hotels for direct immediate takeaway.`,
        citations: ["Rule 26 PCR 2011", "Ministry Advisory WM-10(5)/2020"]
      };
    }

    // 5. E-Commerce Marketplace
    if (q.includes('ecommerce') || q.includes('e-commerce') || q.includes('amazon') || q.includes('flipkart') || q.includes('blinkit') || q.includes('online')) {
      return {
        reply: `🛒 **E-Commerce Compliance — Rule 6(10) PCR 2011**:\n\n1. **Digital Product Page (PDP):** All mandatory declarations (MRP, Country of Origin, Mfg details, Expiry date, Net Qty, and USP) must be displayed digitally before the consumer places the order.\n2. **Joint Liability:** Both marketplace platforms and registered sellers are legally liable for deceptive listings under Consumer Protection (E-Commerce) Rules, 2020.`,
        citations: ["Rule 6(10) PCR 2011", "Consumer Protection (E-Commerce) Rules 2020"]
      };
    }

    // 6. Grievance / Complaints
    if (q.includes('grievance') || q.includes('complaint') || q.includes('shikayat') || q.includes('1915') || q.includes('helpline')) {
      return {
        reply: `📞 **How to File a Consumer Grievance**:\n\n1. **National Consumer Helpline (NCH):** Call Toll-Free **1915** or WhatsApp **8800001915**.\n2. **Online Portal:** Register on **INGRAM** (\`consumerhelpline.gov.in\`).\n3. **e-Daakhil:** File formal consumer cases at \`edaakhil.nic.in\` without needing an advocate.\n4. **ComplyScan 1-Click Action:** Click the **'File Consumer Grievance'** button in the audit report to auto-generate a pre-filled complaint dossier.`,
        citations: ["Consumer Protection Act 2019", "NCH 1915 Portal"]
      };
    }

    // 7. Font Size & Rule 9
    if (q.includes('font') || q.includes('size') || q.includes('rule 9') || q.includes('mm') || q.includes('height')) {
      return {
        reply: `📐 **Rule 9: Minimum Font Size Requirements**:\n\nAll mandatory declarations must be legible and meet minimum numeral heights:\n• **Net Qty ≤ 50g / 50ml:** Minimum height **1.0 mm** (1.5 mm if blown/formed)\n• **50g < Net Qty ≤ 200g:** Minimum height **2.0 mm**\n• **200g < Net Qty ≤ 1kg / 1L:** Minimum height **4.0 mm**\n• **Net Qty > 1kg / 1L:** Minimum height **6.0 mm**\n\nThe height-to-width ratio of numerals must not exceed 3:1.`,
        citations: ["Rule 9 PCR 2011", "Schedule II Minimum Dimensions"]
      };
    }

    // Fallback
    return {
      reply: `🤖 **Legal Metrology AI Copilot**\n\nI can assist you with:\n• **Rule 6(1)(a)-(h):** 9 Mandatory Label Declarations (Manufacturer, MRP, USP, Consumer Care, etc.)\n• **Rule 9:** Font Size & Principal Display Panel (PDP) standards\n• **Rule 26:** Exemption parameters (>25kg bulk, ≤10g miniatures)\n• **Section 36:** Penalties & compounding guidelines (₹25,000 to ₹1,00,000)\n• **E-Commerce Audits:** Rule 6(10) marketplace compliance.\n\nPlease ask any specific rule or product question!`,
      citations: ["Legal Metrology Act 2009", "PCR 2011 Rules"]
    };
  };

  const handleSendMessage = async (textToSend = inputMessage) => {
    const query = textToSend.trim();
    if (!query) return;

    // Append user message
    const userMsg = { sender: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // 1. Try FastAPI backend AI Chat endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          scan_context: scanResult || null,
          language: 'en'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply,
            citations: data.citations || [],
            timestamp: new Date()
          }
        ]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend chat offline, using built-in AI intelligence:', err);
    }

    // 2. Client-side deterministic fallback
    setTimeout(() => {
      const fallback = getOfflineAIResponse(query, scanResult);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: fallback.reply,
          citations: fallback.citations || [],
          timestamp: new Date()
        }
      ]);
      setLoading(false);
    }, 400);
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: "Chat cleared. I'm ready to answer any Legal Metrology and PCR 2011 questions!",
        citations: ["PCR 2011"],
        timestamp: new Date()
      }
    ]);
  };

  // Render formatted markdown-like text
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Bold handling
      let formattedLine = line;
      const parts = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`${lineIdx}-${match.index}`} className="font-bold text-slate-900">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      return (
        <div key={lineIdx} className={`${isBullet ? 'pl-2 py-0.5' : 'py-0.5'} ${line.trim() === '' ? 'h-2' : ''}`}>
          {parts.length > 0 ? parts : line}
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Launcher Pill */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2 group">
          {/* Tooltip badge */}
          <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask Legal Metrology AI</span>
          </div>

          {/* Launcher Button */}
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="relative p-4 rounded-2xl bg-gradient-to-tr from-[#082842] via-[#0B3B60] to-[#FF7A00] text-white shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 flex items-center justify-center"
            aria-label="Open Legal Metrology AI Copilot"
          >
            <div className="relative">
              <Bot className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#082842] via-[#0B3B60] to-[#072740] p-3.5 sm:p-4 text-white flex items-center justify-between shadow-md select-none">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF7A00] to-amber-400 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-black text-sm text-white tracking-tight">ComplyScan AI Copilot</h3>
                  <span className="text-[9px] bg-[#FF7A00]/30 border border-[#FF7A00]/40 text-amber-300 font-bold px-1.5 py-0.2 rounded-full">
                    PCR 2011
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Statutory Legal Metrology Assistant</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-slate-300">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Active Product Scan Context Banner */}
              {scanResult && (
                <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 truncate max-w-[240px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                    <span className="font-bold text-amber-900 truncate">
                      Context: {scanResult.title || "Active Scanned Product"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSendMessage("Analyze violations and compliance of this scanned product")}
                    className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md transition-colors shrink-0"
                  >
                    Audit Report
                  </button>
                </div>
              )}

              {/* Chat Messages Body */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 shadow-sm relative group ${
                        msg.sender === 'user'
                          ? 'bg-[#0B3B60] text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="leading-relaxed whitespace-pre-line">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Legal Citations Pill */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                            Citations:
                          </span>
                          {msg.citations.map((cite, cIdx) => (
                            <span
                              key={cIdx}
                              className="text-[9px] font-semibold bg-[#0B3B60]/10 text-[#0B3B60] border border-[#0B3B60]/20 px-1.5 py-0.2 rounded"
                            >
                              ⚖️ {cite}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Copy Message Action Button */}
                      {msg.sender === 'bot' && (
                        <button
                          onClick={() => handleCopyText(msg.text, idx)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-500 transition-opacity"
                          title="Copy Answer"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 text-[#FF7A00]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}

                {/* Loading Typing Indicator */}
                {loading && (
                  <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 w-28 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="p-2 bg-white border-t border-slate-100 flex space-x-1.5 overflow-x-auto no-scrollbar">
                {SUGGESTED_QUESTIONS.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSendMessage(q.text)}
                    className="whitespace-nowrap text-[10px] font-bold bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-all flex items-center space-x-1 shrink-0"
                  >
                    <span>{q.icon}</span>
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={isListening ? "Listening to your voice..." : "Ask PCR rule, penalty, USP formula..."}
                      className={`w-full text-xs bg-slate-50 border ${
                        isListening ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300'
                      } rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0B3B60] focus:ring-1 focus:ring-[#0B3B60] pr-8 text-slate-800 placeholder-slate-400`}
                    />
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                        isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={isListening ? "Stop Voice Input" : "Speak Query"}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] disabled:opacity-40 text-white p-2.5 rounded-xl shadow transition-all flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
