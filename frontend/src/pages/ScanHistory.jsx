import React, { useState, useEffect } from 'react';
import { History, Search, ArrowRight, FileText, CheckCircle2, AlertOctagon, RotateCcw } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { DEMO_PRESETS_DATA } from '../demoData';

export default function ScanHistory({ setCurrentTab, setScanResult, t }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const FALLBACK_HISTORY = [
    {
      scan_id: "PRESET_01_PASS",
      title: "HealthyBite Digestive Biscuits 500g (Compliant)",
      image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80",
      timestamp: "Just now",
      evaluation: { overall_status: "PASS" }
    },
    {
      scan_id: "PRESET_02_VIOLATION",
      title: "SilkGlow Herbal Shampoo 200ml (Missing MRP Taxes & Consumer Care)",
      image_url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80",
      timestamp: "Just now",
      evaluation: { overall_status: "POSSIBLE_VIOLATION" }
    },
    {
      scan_id: "PRESET_03_BLURRY",
      title: "Royal Garam Masala 100g (Blurry Mfg Date & Address)",
      image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
      timestamp: "Just now",
      evaluation: { overall_status: "NEEDS_REVIEW" }
    },
    {
      scan_id: "PRESET_04_EXEMPT",
      title: "Annapurna Basmati Rice Bulk Pack 30kg (Exempt Package)",
      image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
      timestamp: "Just now",
      evaluation: { overall_status: "EXEMPT" }
    }
  ];

  const loadHistory = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/scans/history', { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      setHistory(data.scans || []);
      setLoading(false);
    } catch (err) {
      console.warn('ScanHistory: Backend offline, using built-in demo history:', err);
      setHistory(FALLBACK_HISTORY);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    if (filter === 'ALL') return true;
    return item.evaluation?.overall_status === filter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">National Compliance Audit History</h1>
          <p className="text-xs text-slate-500">View and inspect previously evaluated packaged commodities</p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#0B3B60]"
        >
          <option value="ALL">All Scans</option>
          <option value="PASS">PASS (Compliant)</option>
          <option value="POSSIBLE_VIOLATION">Violations</option>
          <option value="NEEDS_REVIEW">Needs Review</option>
          <option value="EXEMPT">Exempt</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500 font-bold">
          Loading audit database...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No matching scans found</p>
          <button
            onClick={() => setCurrentTab('scan')}
            className="mt-4 bg-[#0B3B60] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Scan a Product Now
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredHistory.map((item) => (
            <div
              key={item.scan_id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Audit ID: {item.scan_id} • {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-center">
                <StatusBadge status={item.evaluation?.overall_status} size="sm" />
                <button
                  onClick={() => {
                    const fullData = Object.values(DEMO_PRESETS_DATA).find(p => p.scan_id === item.scan_id) || item;
                    setScanResult(fullData);
                    setCurrentTab('report');
                  }}
                  className="bg-slate-100 hover:bg-[#0B3B60] hover:text-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
                >
                  <span>View Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
