import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  FileCheck,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Calculator,
  ArrowRight,
  Info,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export default function SellerPortal({ setCurrentTab, t }) {
  const [activeTab, setActiveTab] = useState('single');
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Food / FMCG',
    mrp: '',
    net_weight: '',
    unit: 'g',
    usp: '',
    mfg_date: '03/2026',
    mfg_name: '',
    mfg_address: '',
    consumer_care: '',
    country_of_origin: 'India',
    is_ecommerce: false
  });

  const [auditResult, setAuditResult] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);

  // Auto-calculate suggested USP when MRP and Net Weight change
  const handleMrpOrWeightChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    const mrpNum = parseFloat(updated.mrp);
    const wtNum = parseFloat(updated.net_weight);

    if (mrpNum && wtNum && wtNum > 0) {
      const pricePerUnit = mrpNum / wtNum;
      updated.usp = `₹${pricePerUnit.toFixed(2)} per ${updated.unit}`;
      setFormData(updated);
    }
  };

  const handleSelfAuditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        products: [
          {
            id: 'SELF-CHK-01',
            name: formData.product_name || 'Self-Check Product',
            mrp: `Rs. ${formData.mrp}`,
            net_quantity: `${formData.net_weight} ${formData.unit}`,
            unit_sale_price: formData.usp,
            mfg_date: formData.mfg_date,
            manufacturer: `${formData.mfg_name}, ${formData.mfg_address}`,
            consumer_care: formData.consumer_care,
            country_of_origin: formData.country_of_origin,
            is_ecommerce: formData.is_ecommerce
          }
        ]
      };

      const res = await fetch('/api/seller/bulk-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setAuditResult(data.results[0]);
      }
    } catch (err) {
      alert('Error running packaging audit. Please check your inputs.');
    }
  };

  const handleRunSampleBulkAudit = async () => {
    setBulkProcessing(true);
    try {
      const samplePayload = {
        products: [
          {
            id: 'SKU-1001',
            name: 'SunFresh Sunflower Oil 1L',
            mrp: 'Rs. 165.00',
            net_quantity: '1 L',
            unit_sale_price: '₹165.00 per L',
            mfg_date: '02/2026',
            manufacturer: 'SunAgro Foods Ltd, GIDC Ahmedabad, Gujarat',
            consumer_care: 'care@sunagro.com | 1800-200-1122',
            country_of_origin: 'India',
            is_ecommerce: true
          },
          {
            id: 'SKU-1002',
            name: 'ChocoDelight Cookies 150g',
            mrp: '50.00', // Missing 'incl of taxes' / Rs.
            net_quantity: '150 grams', // Non-standard unit (should be g)
            unit_sale_price: '', // Missing USP
            mfg_date: '2026', // Missing month
            manufacturer: 'SweetBake Ltd', // Missing address
            consumer_care: '', // Missing
            country_of_origin: '', // Missing
            is_ecommerce: true
          },
          {
            id: 'SKU-1003',
            name: 'PureGlow Face Cream 50g',
            mrp: 'Rs. 249.00 (Incl. of all taxes)',
            net_quantity: '50 g',
            unit_sale_price: '₹4.98 per g',
            mfg_date: '01/2026',
            manufacturer: 'Herbal Organics Pvt Ltd, Baddi, HP',
            consumer_care: 'support@herbalorganics.in',
            country_of_origin: 'India',
            is_ecommerce: false
          },
          {
            id: 'SKU-1004',
            name: 'Imported Arabica Coffee Beans 250g',
            mrp: 'Rs. 599.00',
            net_quantity: '250 g',
            unit_sale_price: '₹2.40 per g',
            mfg_date: '12/2025',
            manufacturer: 'Imported by RoastCraft India, Mumbai',
            consumer_care: '1800-444-9988',
            country_of_origin: 'Ethiopia',
            is_ecommerce: true
          },
          {
            id: 'SKU-1005',
            name: 'Bulk Wheat Flour Bag 30kg',
            mrp: 'Rs. 1200.00',
            net_quantity: '30 kg',
            unit_sale_price: '₹40.00 per kg',
            mfg_date: '02/2026',
            manufacturer: 'AgroFlour Mills, MP',
            consumer_care: 'info@agroflour.com',
            country_of_origin: 'India',
            is_ecommerce: false
          }
        ]
      };

      const res = await fetch('/api/seller/bulk-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload)
      });
      const data = await res.json();
      setBulkResults(data);
      setBulkProcessing(false);
    } catch (err) {
      alert('Error running bulk catalog audit.');
      setBulkProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B3B60] to-[#13588f] text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-2">
        <div className="flex items-center space-x-2 text-xs text-amber-300 font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Business & Manufacturer Self-Audit Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Legal Metrology Pre-Launch Compliance Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
          Ensure 100% compliance with PCR 2011 & 2021 E-Commerce Amendments before printing packaging artwork or publishing marketplace listings. Prevent seizure, legal notices, and penalties.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-2 bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto border border-slate-200">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'single' ? 'bg-white shadow text-[#0B3B60]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Single Packaging Self-Audit
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bulk' ? 'bg-white shadow text-[#FF7A00]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Bulk Catalog SKU Audit
        </button>
      </div>

      {/* TAB 1: Single Packaging Self-Audit Form */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Packaging Declaration Input</h2>
              <p className="text-xs text-slate-500">Fill in the exact texts intended for your physical label or product page</p>
            </div>

            <form onSubmit={handleSelfAuditSubmit} className="space-y-4">
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Generic Product Name (Rule 6.1.b)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roasted Almond Cookies"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Commodity Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-[#0B3B60]"
                  >
                    <option>Food / FMCG</option>
                    <option>Cosmetics & Personal Care</option>
                    <option>Beverages / Packaged Water</option>
                    <option>Electronics & Appliances</option>
                    <option>Apparel & Textiles</option>
                    <option>Pharmaceuticals / Supplements</option>
                  </select>
                </div>
              </div>

              {/* MRP & Net Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">MRP in ₹ (Rule 6.1.e)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="150.00"
                    value={formData.mrp}
                    onChange={(e) => handleMrpOrWeightChange('mrp', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Net Quantity (Rule 6.1.c)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250"
                    value={formData.net_weight}
                    onChange={(e) => handleMrpOrWeightChange('net_weight', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Standard SI Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => {
                      const updated = { ...formData, unit: e.target.value };
                      setFormData(updated);
                      if (formData.mrp && formData.net_weight) {
                        const price = parseFloat(formData.mrp) / parseFloat(formData.net_weight);
                        setFormData({ ...updated, usp: `₹${price.toFixed(2)} per ${e.target.value}` });
                      }
                    }}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-[#0B3B60]"
                  >
                    <option value="g">g (grams)</option>
                    <option value="kg">kg (kilograms)</option>
                    <option value="ml">ml (milliliters)</option>
                    <option value="L">L (liters)</option>
                    <option value="N">N (numbers / pieces)</option>
                  </select>
                </div>
              </div>

              {/* Unit Sale Price (USP) Auto-computed */}
              <div className="bg-[#0B3B60]/5 p-3 rounded-xl border border-[#0B3B60]/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <Calculator className="w-3.5 h-3.5 text-[#0B3B60]" />
                    <span>Calculated Unit Sale Price (Rule 6.1.f):</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Auto-formatted in mandatory statutory syntax</div>
                </div>
                <div className="font-mono font-bold text-[#0B3B60] text-sm bg-white px-3 py-1 rounded-lg border border-[#0B3B60]/20">
                  {formData.usp || '₹0.00 per unit'}
                </div>
              </div>

              {/* Manufacturer Name & Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Manufacturer / Packer Details (Rule 6.1.a)</label>
                <input
                  type="text"
                  required
                  placeholder="Registered Entity Name, e.g. Apex Foods Pvt Ltd"
                  value={formData.mfg_name}
                  onChange={(e) => setFormData({ ...formData, mfg_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                />
                <input
                  type="text"
                  required
                  placeholder="Complete Address with City, State & PIN, e.g. Plot 45, Phase 2, Pune 411057"
                  value={formData.mfg_address}
                  onChange={(e) => setFormData({ ...formData, mfg_address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                />
              </div>

              {/* Consumer Care & Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Consumer Care Info (Rule 6.1.g)</label>
                  <input
                    type="text"
                    required
                    placeholder="Phone or Email (e.g. care@brand.com)"
                    value={formData.consumer_care}
                    onChange={(e) => setFormData({ ...formData, consumer_care: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Country of Origin (Rule 6.1.h)</label>
                  <input
                    type="text"
                    required
                    placeholder="India"
                    value={formData.country_of_origin}
                    onChange={(e) => setFormData({ ...formData, country_of_origin: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B3B60]"
                  />
                </div>
              </div>

              {/* E-Commerce Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="ecom_check"
                  checked={formData.is_ecommerce}
                  onChange={(e) => setFormData({ ...formData, is_ecommerce: e.target.checked })}
                  className="w-4 h-4 text-[#0B3B60] rounded border-slate-300 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="ecom_check" className="text-xs text-slate-700 font-medium cursor-pointer">
                  This product is listed on an e-commerce platform (Applies 2017 & 2021 E-Commerce Rules)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B3B60] hover:bg-[#13588f] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Packaging Compliance</span>
              </button>
            </form>
          </div>

          {/* Result / Certificate Preview */}
          <div className="lg:col-span-5 space-y-4">
            {auditResult ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pre-Audit Verdict</span>
                    <h3 className="text-lg font-black text-slate-900">{auditResult.name}</h3>
                  </div>
                  <StatusBadge status={auditResult.status} size="md" />
                </div>

                {/* Score Gauge */}
                <div className={`p-4 rounded-2xl border ${auditResult.status === 'PASS' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
                  <div className="text-2xl font-black">{auditResult.compliance_score}% Compliance Score</div>
                  <p className="text-xs mt-1 leading-relaxed">{auditResult.summary}</p>
                </div>

                {/* Rule Breakdown Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Clause Checklist</h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                    {auditResult.fields && auditResult.fields.map((f, i) => (
                      <div key={i} className="p-3 text-xs flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-800">{f.name}</div>
                          <div className="text-[10px] text-slate-500">{f.message}</div>
                        </div>
                        <StatusBadge status={f.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                {auditResult.status === 'PASS' && (
                  <div className="bg-[#0B3B60] text-white p-4 rounded-2xl text-center space-y-2">
                    <div className="inline-flex p-2 bg-[#FF7A00] rounded-full">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-bold text-xs">Ready for Production Print & Market Launch</div>
                    <p className="text-[10px] text-slate-300">
                      This packaging design satisfies all mandatory PCR 2011 declarations.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <FileCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-700 text-sm">No Audit Run Yet</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Fill out the packaging declarations on the left to generate an instant statutory compliance review.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Bulk Catalog SKU Audit */}
      {activeTab === 'bulk' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">E-Commerce Catalog Batch Verification</h2>
              <p className="text-xs text-slate-500">Audit your entire marketplace inventory feed (CSV, JSON or ERP sync) in seconds</p>
            </div>
            <button
              onClick={handleRunSampleBulkAudit}
              disabled={bulkProcessing}
              className="bg-[#FF7A00] hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{bulkProcessing ? 'Auditing 5 SKUs...' : 'Run 5-SKU Sample Catalog Test'}</span>
            </button>
          </div>

          {bulkResults && (
            <div className="space-y-6 pt-4">
              {/* Batch KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold uppercase">Total SKUs Audited</div>
                  <div className="text-2xl font-black text-slate-900">{bulkResults.total_products}</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-bold uppercase">Passed (Compliant)</div>
                  <div className="text-2xl font-black text-emerald-600">{bulkResults.passed}</div>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="text-xs text-rose-800 font-bold uppercase">Violations Found</div>
                  <div className="text-2xl font-black text-rose-600">{bulkResults.violations}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold uppercase">Exempt Products</div>
                  <div className="text-2xl font-black text-slate-600">{bulkResults.exempt}</div>
                </div>
              </div>

              {/* SKU Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">SKU ID</th>
                      <th className="p-3.5">Product Title</th>
                      <th className="p-3.5">MRP / Net Wt</th>
                      <th className="p-3.5">Compliance Score</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Key Findings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bulkResults.results.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="p-3.5 font-mono font-bold text-[#0B3B60]">{p.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                        <td className="p-3.5 text-slate-600">
                          <div>{p.input_data.mrp}</div>
                          <div className="text-[10px] text-slate-400">{p.input_data.net_quantity}</div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{p.compliance_score}%</td>
                        <td className="p-3.5">
                          <StatusBadge status={p.status} size="sm" />
                        </td>
                        <td className="p-3.5 text-slate-600 max-w-xs">{p.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
