import React from 'react';
import { BookOpen, Scale, AlertTriangle, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function KnowYourRights({ t }) {
  const rules = [
    {
      id: "a",
      title: "Manufacturer / Packer / Importer Details",
      desc: "Mandatory declaration of name and full address of manufacturer, packer, or importer.",
      why: "Ensures accountability for product quality and consumer recourse.",
      penalty: "Incorrect or missing details can lead to product seizure."
    },
    {
      id: "b",
      title: "Generic Name of Commodity",
      desc: "Declaration of the commodity's generic or common name.",
      why: "Prevents misleading packaging or hidden product identity.",
      penalty: "Product can be deemed 'misbranded'."
    },
    {
      id: "c",
      title: "Net Quantity",
      desc: "Net quantity in standard SI units (g, kg, ml, L, N).",
      why: "Ensures consumer transparency in pricing relative to quantity.",
      penalty: "Short-measure penalties strictly enforced under Act."
    },
    {
      id: "d",
      title: "Month & Year of Manufacture/Packing",
      desc: "Must clearly state when the product was packed for sale.",
      why: "Essential for determining product freshness and safety.",
      penalty: "Fines for concealing expiry-related information."
    },
    {
      id: "e",
      title: "Retail Sale Price (MRP)",
      desc: "Must state 'Maximum Retail Price (Incl. of all taxes)'.",
      why: "Stops illegal overcharging by retailers over printed MRP.",
      penalty: "Penalties for charging more than printed MRP."
    },
    {
      id: "f",
      title: "Unit Sale Price (USP)",
      desc: "Price per gram/ml for packaging above 20g/20ml.",
      why: "Enables easier price comparison across different pack sizes.",
      penalty: "Mandatory for standardized comparison."
    },
    {
      id: "g",
      title: "Consumer Care Contact",
      desc: "Full address, phone, and email of the consumer grievance officer.",
      why: "Direct channel for resolving consumer issues.",
      penalty: "Essential for the legal right to redressal."
    },
    {
      id: "h",
      title: "Country of Origin",
      desc: "Mandatory for all imports.",
      why: "Informs consumers about product sourcing origins.",
      penalty: "Statutory requirement under E-com amendments."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-[#0B3B60]/10 text-[#0B3B60] rounded-2xl">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Know Your Consumer Rights</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Under the Legal Metrology (Packaged Commodities) Rules, 2011, every packaged product
          sold in India must adhere to these foundational transparency declarations.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-[#FF7A00]/50 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-lg font-black text-sm">
                {rule.id.toUpperCase()}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{rule.title}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-bold text-[#0B3B60] bg-[#0B3B60]/10 px-2 py-1 rounded inline-block">
                Why: {rule.why}
              </div>
              <div className="text-[10px] font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-1 rounded inline-block">
                Penalty: {rule.penalty}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Factoids Banner */}
      <div className="bg-[#0B3B60] rounded-3xl p-8 text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-black flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span>Common Deceptions</span>
          </h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Retailers cannot charge over MRP.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Small print hiding mandatory details is illegal.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Over 25kg bulk items are legally exempt.</span>
            </li>
          </ul>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl border border-white/10 text-center space-y-2">
          <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
          <h4 className="font-bold text-base">Know the Law</h4>
          <p className="text-xs text-slate-300">
             First violation: ₹25,000 fine.<br/>
             Subsequent violations: ₹50,000 fine / imprisonment.
          </p>
        </div>
      </div>
    </div>
  );
}
