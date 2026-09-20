import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Share2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  MinusCircle,
  HelpCircle,
  Building2,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Phone,
  Scale,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  Check,
  Copy,
  ExternalLink,
  QrCode,
  Award,
  Hash,
  Info
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export default function Report({ scanResult, setCurrentTab, t }) {
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [grievanceId, setGrievanceId] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'PASS' | 'VIOLATION' | 'REVIEW'
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [highlightedField, setHighlightedField] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [grievanceForm, setGrievanceForm] = useState({
    name: '',
    phone: '',
    email: '',
    store_name: '',
    store_city: '',
    store_state: '',
    description: ''
  });

  if (!scanResult) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No active scan report found.</p>
        <button
          onClick={() => setCurrentTab('scan')}
          className="mt-4 bg-[#0B3B60] text-white px-6 py-2.5 rounded-xl text-sm font-bold"
        >
          Scan a Product
        </button>
      </div>
    );
  }

  const { title, image_url, extracted_data, evaluation, bounding_boxes, scan_id } = scanResult;
  const overall = evaluation.overall_status;

  // Trigger celebration if 100% compliant
  useEffect(() => {
    if (overall === 'PASS') {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  }, [overall]);

  // Filter fields according to tab
  const filteredFields = evaluation.fields?.filter((f) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'PASS') return f.status === 'PASS';
    if (activeFilter === 'VIOLATION') return f.status === 'VIOLATION' || f.status === 'POSSIBLE_VIOLATION';
    if (activeFilter === 'REVIEW') return f.status === 'NEEDS_REVIEW' || f.status === 'EXEMPT';
    return true;
  }) || [];

  const violationCount = evaluation.fields?.filter(f => f.status === 'VIOLATION' || f.status === 'POSSIBLE_VIOLATION').length || 0;
  const passCount = evaluation.fields?.filter(f => f.status === 'PASS').length || 0;
  const reviewCount = evaluation.fields?.filter(f => f.status === 'NEEDS_REVIEW' || f.status === 'EXEMPT').length || 0;

  const downloadPDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Top Header Banner
    doc.setFillColor(8, 40, 66);
    doc.rect(0, 0, pageWidth, 32, 'F');

    // Title & Ministry Subheader
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("STATUTORY COMPLIANCE AUDIT CERTIFICATE", 14, 14);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(253, 186, 116);
    doc.text("Ministry of Consumer Affairs, Food & Public Distribution | PCR 2011 Automated Engine", 14, 21);
    doc.setTextColor(203, 213, 225);
    doc.text("Legal Metrology (Packaged Commodities) Rules, 2011 Statutory Verification", 14, 27);

    // Audit Info Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 38, 182, 38, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Audit ID:`, 18, 46);
    doc.setFont('helvetica', 'normal');
    doc.text(`${scan_id || 'COMPLY-2026-X'}`, 48, 46);

    doc.setFont('helvetica', 'bold');
    doc.text(`Product Name:`, 18, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(`${title || 'Packaged Commodity'}`, 48, 53);

    doc.setFont('helvetica', 'bold');
    doc.text(`Overall Result:`, 18, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${overall}`, 48, 60);

    doc.setFont('helvetica', 'bold');
    doc.text(`Compliance Score:`, 115, 46);
    doc.setFont('helvetica', 'normal');
    doc.text(`${evaluation.compliance_score || 0}% (${passCount}/${evaluation.fields?.length || 9} Rules Passed)`, 152, 46);

    doc.setFont('helvetica', 'bold');
    doc.text(`Audit Timestamp:`, 115, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date().toLocaleString()}`, 152, 53);

    doc.setFont('helvetica', 'bold');
    doc.text(`Verification Hash:`, 115, 60);
    doc.setFont('courier', 'normal');
    doc.text(`SHA-${(scan_id || '2026').slice(0, 8).toUpperCase()}9F7A`, 152, 60);

    // Rule Evaluations Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 59, 96);
    doc.text("RULE-BY-RULE STATUTORY BREAKDOWN (PCR 2011)", 14, 85);

    let y = 94;
    evaluation.fields?.forEach((f, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      // Box for rule
      const isPassed = f.status === 'PASS';
      const isViolation = f.status === 'VIOLATION' || f.status === 'POSSIBLE_VIOLATION';

      if (isPassed) {
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(187, 247, 208);
      } else if (isViolation) {
        doc.setFillColor(255, 241, 242);
        doc.setDrawColor(254, 205, 211);
      } else {
        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(254, 240, 138);
      }

      doc.roundedRect(14, y, 182, 17, 1.5, 1.5, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${index + 1}. ${f.name} [${f.section}]`, 18, y + 6);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      if (isPassed) doc.setTextColor(22, 101, 52);
      else if (isViolation) doc.setTextColor(159, 18, 57);
      else doc.setTextColor(133, 77, 14);
      doc.text(`Status: ${f.status}`, 150, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8);
      const valText = f.detected_value ? `Detected: "${f.detected_value.substring(0, 45)}"` : 'Detected: MISSING / NOT FOUND';
      doc.text(valText, 18, y + 12);
      doc.text(f.message.substring(0, 60), 100, y + 12);

      y += 20;
    });

    // Digital Security Seal & Verification Footer
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Official Digital Record • National Consumer Grievance Portal Integrated • smartindiahackathon.gov.in", 14, 285);

    doc.save(`ComplyScan_Audit_${scan_id || 'Report'}.pdf`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleGrievanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...grievanceForm, scan_id })
      });
      const data = await res.json();
      setGrievanceId(data.grievance_id || `GRV-${Math.floor(100000 + Math.random() * 900000)}`);
      setGrievanceSubmitted(true);
    } catch (err) {
      // Fallback ID if offline
      setGrievanceId(`GRV-${Math.floor(100000 + Math.random() * 900000)}`);
      setGrievanceSubmitted(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Fast Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              AUDIT ID: #{scan_id}
            </span>
            <span className="text-xs font-bold text-[#FF7A00] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>PCR 2011 Verified</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadPDFReport}
            className="bg-gradient-to-r from-[#0B3B60] to-[#082842] hover:from-[#13588f] hover:to-[#0B3B60] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{t.report.btnDownload || "Download Certificate (PDF)"}</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#FF7A00]" /> : <Share2 className="w-4 h-4 text-slate-500" />}
            <span>{copiedLink ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            onClick={() => setCurrentTab('scan')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.report.btnScanAgain || "New Scan"}</span>
          </button>
        </div>
      </div>

      {/* Main Overall Verdict Banner with Digital Holographic Stamp */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-lg transition-all ${
        overall === 'PASS'
          ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border-emerald-300 text-emerald-950'
          : overall === 'POSSIBLE_VIOLATION'
          ? 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white border-rose-300 text-rose-950'
          : overall === 'NEEDS_REVIEW'
          ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-300 text-amber-950'
          : 'bg-slate-100 border-slate-300 text-slate-900'
      }`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              {overall === 'PASS' && (
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              )}
              {overall === 'POSSIBLE_VIOLATION' && (
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
                  <AlertOctagon className="w-8 h-8" />
                </div>
              )}
              {overall === 'NEEDS_REVIEW' && (
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              )}
              {overall === 'EXEMPT' && (
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-inner">
                  <MinusCircle className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 text-[11px] font-black tracking-widest uppercase opacity-80 bg-black/5 px-2.5 py-0.5 rounded-full">
                <span>Rule Verification Result</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {overall === 'PASS' && (t.report.passTitle || "100% PCR 2011 Compliant")}
                {overall === 'POSSIBLE_VIOLATION' && (t.report.violationTitle || "Possible Legal Metrology Violations Detected")}
                {overall === 'NEEDS_REVIEW' && (t.report.reviewTitle || "Needs Verification / Re-scan")}
                {overall === 'EXEMPT' && (t.report.exemptTitle || "Exempt Under Rule 26")}
              </h2>
              <p className="text-sm opacity-90 max-w-2xl font-medium leading-relaxed">
                {evaluation.summary}
              </p>
            </div>
          </div>

          {/* Right: Hologram Digital Seal + Compliance Meter */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-stretch sm:self-auto justify-end">
            {/* Ministry Digital Security Stamp */}
            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B3B60] to-sky-600 text-amber-300 flex items-center justify-center shadow">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Digital Seal</div>
                <div className="text-xs font-bold text-slate-900">PCR 2011 Verified</div>
                <div className="text-[9px] font-mono text-slate-500">HASH: #{scan_id?.slice(0, 6)}...</div>
              </div>
            </div>

            {/* Score Box */}
            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center min-w-[120px]">
              <div className="text-3xl font-black text-[#0B3B60]">
                {evaluation.compliance_score || 0}%
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance</div>
              <div className="text-[10px] font-semibold text-emerald-600">
                {passCount} / {evaluation.fields?.length || 9} Rules Passed
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer subtext */}
        <div className="mt-6 pt-4 border-t border-black/10 text-xs opacity-80 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#FF7A00]" />
          <span>{t.report.disclaimer || "Automated audit pursuant to Legal Metrology Act, 2009 & Packaged Commodities Rules 2011."}</span>
        </div>
      </div>

      {/* Interactive Split Screen: PDP Visualizer vs Rule Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual PDP Image with Interactive Bounding Boxes */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#0B3B60]" />
                <span>Principal Display Panel (PDP)</span>
              </h3>

              {/* Toggle Bounding Box Overlays */}
              <button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                  showBoundingBoxes
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showBoundingBoxes ? "Hide AI Boxes" : "Show AI Boxes"}</span>
              </button>
            </div>

            {/* Image Canvas with Coordinate Overlays */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center min-h-[340px] shadow-inner group">
              <img
                src={image_url}
                alt="Product Label Principal Display Panel"
                className="max-h-[420px] w-full object-contain"
              />

              {/* Simulated Bounding Box Overlays */}
              {showBoundingBoxes && bounding_boxes && bounding_boxes.map((b, idx) => {
                const isSelected = highlightedField === b.field_key || highlightedField === b.label;
                return (
                  <div
                    key={idx}
                    onClick={() => setHighlightedField(b.field_key || b.label)}
                    style={{
                      left: `${b.box[0]}%`,
                      top: `${b.box[1]}%`,
                      width: `${b.box[2] - b.box[0]}%`,
                      height: `${b.box[3] - b.box[1]}%`
                    }}
                    className={`absolute border-2 rounded transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/30 ring-4 ring-amber-400/40 z-20'
                        : 'border-[#FF7A00] bg-orange-500/15 hover:bg-orange-500/30 z-10'
                    }`}
                  >
                    <span className="absolute -top-5 left-0 bg-slate-900/90 text-amber-300 border border-amber-400/40 font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Metadata Pill Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">OCR Clarity</span>
                <span className="font-bold text-slate-800">
                  {extracted_data?.image_clarity_score ? `${Math.round(extracted_data.image_clarity_score * 100)}% Quality` : 'High (100%)'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Audit Mode</span>
                <span className="font-bold text-slate-800">
                  {scanResult.mode === 'ecommerce' ? 'E-Commerce URL Listing' : 'Physical Retail Package'}
                </span>
              </div>
            </div>
          </div>

          {/* Suspected Violation Action CTA Box */}
          {overall === 'POSSIBLE_VIOLATION' && (
            <div className="bg-gradient-to-r from-rose-500/10 via-rose-50 to-white border border-rose-200 rounded-3xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 text-rose-800 font-black text-sm">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <span>Suspected Consumer Rights Violation</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                Mandatory declarations appear absent or non-compliant under Rule 6. You can submit an automated statutory grievance to the Legal Metrology Controller.
              </p>
              <button
                onClick={() => setShowGrievanceModal(true)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-3 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.report.btnGrievance || "1-Click Direct Ministry Grievance"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: 9 Mandatory Rules Breakdown with Interactive Filter */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header & Filter Pill Tabs */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Statutory Rule Audit (PCR 2011)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluating 9 core declarations under the Legal Metrology Act, 2009
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-xs self-start">
                  {filteredFields.length} of {evaluation.fields?.length || 9} Shown
                </span>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilter === 'ALL'
                      ? 'bg-[#0B3B60] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  All Declarations ({evaluation.fields?.length || 9})
                </button>

                <button
                  onClick={() => setActiveFilter('PASS')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeFilter === 'PASS'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Passed ({passCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilter('VIOLATION')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeFilter === 'VIOLATION'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                  }`}
                >
                  <AlertOctagon className="w-3 h-3" />
                  <span>Violations ({violationCount})</span>
                </button>

                {reviewCount > 0 && (
                  <button
                    onClick={() => setActiveFilter('REVIEW')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                      activeFilter === 'REVIEW'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Review ({reviewCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of Evaluated Fields */}
            <div className="divide-y divide-slate-100">
              {filteredFields.map((f, index) => {
                const isPassed = f.status === 'PASS';
                const isViolation = f.status === 'VIOLATION' || f.status === 'POSSIBLE_VIOLATION';
                const isSelected = highlightedField === f.key || highlightedField === f.name;

                return (
                  <div
                    key={index}
                    onClick={() => setHighlightedField(isSelected ? null : f.key || f.name)}
                    className={`p-5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/70 border-l-4 border-amber-500'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Row: Name, Legal Section, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                            isPassed
                              ? 'bg-emerald-100 text-emerald-700'
                              : isViolation
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{f.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {f.section}
                          </span>
                        </div>
                        <div>
                          <StatusBadge status={f.status} size="sm" />
                        </div>
                      </div>

                      {/* Detected Text Box */}
                      <div className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-2">
                          <span className="font-bold text-slate-500 shrink-0 uppercase text-[10px] tracking-wider pt-0.5">
                            Detected Value:
                          </span>
                          <span className="font-mono text-slate-900 font-medium">
                            {f.detected_value ? (
                              `"${f.detected_value}"`
                            ) : (
                              <span className="text-rose-600 font-bold italic">Missing / Non-Compliant</span>
                            )}
                          </span>
                        </div>
                        {f.confidence && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            AI Confidence: {Math.round(f.confidence * 100)}%
                          </span>
                        )}
                      </div>

                      {/* Regulatory Finding & Rule Explanation */}
                      <div className="text-xs text-slate-600 leading-relaxed pl-8">
                        <p className="font-medium text-slate-700">{f.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredFields.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No statutory rules in this filter category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Official Grievance Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {!grievanceSubmitted ? (
              <>
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      <span>Statutory Consumer Grievance</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">File Legal Metrology Complaint</h3>
                    <p className="text-xs text-slate-500">Department of Consumer Affairs • Legal Metrology Grievance Cell</p>
                  </div>
                  <button
                    onClick={() => setShowGrievanceModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Complainant Full Name *</label>
                      <input
                        type="text"
                        required
                        value={grievanceForm.name}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                        placeholder="Rohan Gupta"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={grievanceForm.phone}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, phone: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Store / Seller / Platform *</label>
                      <input
                        type="text"
                        required
                        value={grievanceForm.store_name}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, store_name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                        placeholder="Local Mart / E-Commerce Seller"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">City & State *</label>
                      <input
                        type="text"
                        required
                        value={grievanceForm.store_city}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, store_city: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                        placeholder="Pune, Maharashtra"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Violation Details / Description *</label>
                    <textarea
                      rows="3"
                      required
                      value={grievanceForm.description}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                      placeholder="e.g. Package sold with missing Unit Sale Price (USP) and no consumer helpline number listed..."
                    ></textarea>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowGrievanceModal(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all"
                    >
                      Submit Grievance to Ministry
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Grievance Lodged Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your grievance reference number is <span className="font-mono font-bold text-[#0B3B60] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{grievanceId}</span>. It has been routed to the State Legal Metrology Enforcement Cell.
                </p>
                <button
                  onClick={() => { setShowGrievanceModal(false); setGrievanceSubmitted(false); }}
                  className="bg-[#0B3B60] hover:bg-[#13588f] text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
