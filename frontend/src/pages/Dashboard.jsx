import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  BarChart3,
  TrendingUp,
  MapPin,
  Filter,
  CheckCircle2,
  Clock,
  AlertOctagon,
  FileCheck,
  Search,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building2,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { SeverityBadge } from '../components/StatusBadge';

export default function Dashboard({ setCurrentTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('INVESTIGATING');
  const [officerNotes, setOfficerNotes] = useState('');

  const FALLBACK_ANALYTICS = {
    summary: {
      total_scans: 1248,
      total_violations: 284,
      needs_review: 112,
      violation_rate: "22.8%",
      active_investigations: 6,
      resolved_this_month: 142
    },
    category_data: [
      { category: "FMCG / Biscuits & Snacks", scans: 412, violations: 84, compliance: 80 },
      { category: "Personal Care & Cosmetics", scans: 320, violations: 92, compliance: 71 },
      { category: "Spices & Food Ingredients", scans: 240, violations: 46, compliance: 81 },
      { category: "Beverages & Dairy", scans: 180, violations: 38, compliance: 79 },
      { category: "Packaged Agri / Rice & Pulses", scans: 96, violations: 24, compliance: 75 }
    ],
    top_violated_rules: [
      { rule: "Missing 'Inclusive of all taxes' on MRP", count: 134, section: "Rule 6(1)(e)" },
      { rule: "Incomplete Consumer Grievance Contact", count: 98, section: "Rule 6(1)(g)" },
      { rule: "Missing Unit Sale Price (USP)", count: 76, section: "Rule 6(1)(f)" },
      { rule: "Missing / Incomplete Manufacturer Address", count: 54, section: "Rule 6(1)(a)" },
      { rule: "Ambiguous Month & Year of Mfg", count: 42, section: "Rule 6(1)(d)" }
    ],
    state_violations: [
      { state: "Maharashtra", scans: 310, violations: 64, risk: "High" },
      { state: "Delhi NCR", scans: 280, violations: 72, risk: "High" },
      { state: "Karnataka", scans: 190, violations: 38, risk: "Medium" },
      { state: "Gujarat", scans: 165, violations: 32, risk: "Medium" },
      { state: "Uttar Pradesh", scans: 155, violations: 46, risk: "High" },
      { state: "Tamil Nadu", scans: 148, violations: 32, risk: "Low" }
    ],
    recent_cases: []
  };

  const FALLBACK_CASES = [
    { id: "CASE_001", brand: "SilkGlow Cosmetics", product: "Herbal Shampoo 200ml", status: "INVESTIGATING", date: "2026-08-18", violations: "Missing MRP Taxes, No Consumer Care", officer: "Inspector R. Sharma", state: "Delhi NCR" },
    { id: "CASE_002", brand: "FreshBite Snacks", product: "Masala Chips 150g", status: "NOTICE_ISSUED", date: "2026-08-10", violations: "Missing Manufacturer Address", officer: "Inspector S. Patel", state: "Gujarat" },
    { id: "CASE_003", brand: "QuickCure Pharma", product: "Hand Sanitizer 100ml", status: "HEARING_SCHEDULED", date: "2026-07-25", violations: "Missing Country of Origin, No USP", officer: "Inspector A. Singh", state: "Maharashtra" },
    { id: "CASE_004", brand: "NaturFresh Oils", product: "Coconut Oil 500ml", status: "RESOLVED", date: "2026-07-05", violations: "Incomplete Mfg Date Format", officer: "Inspector K. Verma", state: "Karnataka" }
  ];

  const fetchData = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const [anaRes, caseRes] = await Promise.all([
        fetch('/api/dashboard/analytics', { signal: controller.signal }),
        fetch('/api/cases', { signal: controller.signal })
      ]);
      clearTimeout(timeoutId);
      const anaData = await anaRes.json();
      const caseData = await caseRes.json();
      setAnalytics(anaData);
      setCases(caseData.cases || []);
      setLoading(false);
    } catch (err) {
      console.warn('Dashboard: Backend offline, using built-in demo analytics:', err);
      setAnalytics(FALLBACK_ANALYTICS);
      setCases(FALLBACK_CASES);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedCase) return;
    try {
      await fetch(`/api/cases/${selectedCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: officerNotes })
      });
      setUpdateModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to update case');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm font-semibold text-slate-500">
        Loading Officer Analytics & National Registry...
      </div>
    );
  }

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0B3B60] text-white p-6 rounded-3xl shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Authorized Legal Metrology Enforcement Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Central Compliance & Case Dashboard</h1>
          <p className="text-xs text-slate-300">
            Real-time PCR 2011 violations monitoring across physical retail & e-commerce marketplaces
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center space-x-1.5">
            <Download className="w-4 h-4" />
            <span>Export Enforcement Dossier</span>
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Scans Audited</div>
            <div className="text-3xl font-black text-slate-900">{analytics.summary.total_scans}</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flagged Violations</div>
            <div className="text-3xl font-black text-rose-600">{analytics.summary.total_violations}</div>
            <div className="text-xs text-rose-600 font-semibold">
              Violation Rate: {analytics.summary.violation_rate}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Legal Cases</div>
            <div className="text-3xl font-black text-amber-600">{analytics.summary.active_investigations}</div>
            <div className="text-xs text-slate-500 font-medium">Assigned to regional officers</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Notices</div>
            <div className="text-3xl font-black text-emerald-600">{analytics.summary.resolved_this_month}</div>
            <div className="text-xs text-emerald-600 font-semibold">89.2% resolution efficiency</div>
          </div>
        </div>
      )}

      {/* Charts Section: Category breakdown & Top Violated Rules */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Category Violations Bar Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Violation Density by Commodity Category</h3>
                <p className="text-xs text-slate-500">Audited scans vs detected non-compliance</p>
              </div>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.category_data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="scans" name="Total Audits" fill="#0B3B60" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="violations" name="Violations" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table / List: Top Violated PCR Rules */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Top Violated PCR 2011 Clauses</h3>
                <p className="text-xs text-slate-500">Most frequent non-compliance reasons</p>
              </div>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>

            <div className="space-y-3">
              {analytics.top_violated_rules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800">{rule.rule}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{rule.section}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      {rule.count} cases
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* State-wise Heatmap / Density Grid */}
      {analytics && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">State & Jurisdictional Violation Density</h3>
              <p className="text-xs text-slate-500">Legal Metrology State Controllers surveillance stats</p>
            </div>
            <MapPin className="w-4 h-4 text-[#FF7A00]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {analytics.state_violations.map((st, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-800">{st.state}</div>
                <div className="text-lg font-black text-[#0B3B60]">{st.violations} <span className="text-[10px] font-normal text-slate-400">violations</span></div>
                <div className="flex justify-between items-center pt-1 text-[10px]">
                  <span className="text-slate-500">{st.scans} scans</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded ${st.risk === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{st.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Officer Case Management Registry */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Enforcement Cases & Audit Log</h3>
            <p className="text-xs text-slate-500">Filter, investigate and take statutory action on flagged products</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Product or Brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#0B3B60]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="NOTICE_ISSUED">Notice Issued</option>
              <option value="HEARING_SCHEDULED">Hearing Scheduled</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* Case Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Case ID</th>
                <th className="p-3.5">Product & Manufacturer</th>
                <th className="p-3.5">Violation Type</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Assigned Officer</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#0B3B60]">{c.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{c.product_name}</div>
                    <div className="text-[11px] text-slate-500">{c.manufacturer}</div>
                  </td>
                  <td className="p-3.5 max-w-xs text-slate-600 font-medium">{c.violation_type}</td>
                  <td className="p-3.5">
                    <SeverityBadge severity={c.severity} />
                  </td>
                  <td className="p-3.5 text-slate-600">{c.assigned_officer}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'NOTICE_ISSUED' ? 'bg-rose-100 text-rose-800' :
                      c.status === 'INVESTIGATING' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setNewStatus(c.status);
                        setOfficerNotes(c.notes || '');
                        setUpdateModalOpen(true);
                      }}
                      className="bg-[#0B3B60] hover:bg-[#13588f] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                    >
                      Update Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Update Modal */}
      {updateModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enforcement Action Update</h3>
                <p className="text-xs text-slate-500">Case Reference: {selectedCase.id}</p>
              </div>
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedCase.product_name}</div>
              <div className="text-slate-600">{selectedCase.violation_type}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Enforcement Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                >
                  <option value="PENDING_REVIEW">PENDING REVIEW</option>
                  <option value="INVESTIGATING">UNDER INVESTIGATION</option>
                  <option value="NOTICE_ISSUED">STATUTORY NOTICE ISSUED (SEC 36)</option>
                  <option value="HEARING_SCHEDULED">OFFICIAL HEARING SCHEDULED</option>
                  <option value="RESOLVED">COMPLIANCE ACHIEVED / RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Officer Investigation Notes</label>
                <textarea
                  rows="3"
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Enter inspection findings, penalty reference, or compliance declaration..."
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0B3B60] hover:bg-[#13588f] rounded-xl shadow"
              >
                Save Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
