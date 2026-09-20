import React from 'react';
import { ShieldCheck, Scale, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ setCurrentTab }) {
  return (
    <footer className="bg-[#072740] text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF7A00] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">ComplyScan AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated compliance verification system for Packaged Commodities under Legal Metrology Rules, 2011.
            </p>
            <div className="text-xs text-amber-400/90 font-medium">
              Smart India Hackathon (SIH 2026) Prototype
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Quick Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentTab('scan')} className="hover:text-white transition-colors">Citizen Scan Tool</button></li>
              <li><button onClick={() => setCurrentTab('rights')} className="hover:text-white transition-colors">Know Your Rights (Rule 6)</button></li>
              <li><button onClick={() => setCurrentTab('seller')} className="hover:text-white transition-colors">Seller Self-Audit & Bulk Check</button></li>
              <li><button onClick={() => setCurrentTab('dashboard')} className="hover:text-white transition-colors">Legal Metrology Officer Portal</button></li>
              <li><button onClick={() => setCurrentTab('history')} className="hover:text-white transition-colors">National Scan History</button></li>
              <li><button onClick={() => setCurrentTab('contact')} className="hover:text-white transition-colors">Contact &amp; Support</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Statutory Backing</h4>
            <ul className="space-y-2 text-xs">
              <li>Legal Metrology Act, 2009</li>
              <li>Packaged Commodities Rules, 2011</li>
              <li>2017 & 2021 E-Commerce Amendments</li>
              <li>Ministry of Consumer Affairs, Food & Public Distribution</li>
            </ul>
          </div>

          {/* Col 4: Disclaimer */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Compliance Disclaimer</h4>
            <p className="text-[11px] text-slate-400 leading-normal bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              This system provides automated AI auditing assistance. It is designed to assist consumers, businesses, and enforcement officers. Final legal authority remains with appointed Legal Metrology Inspectors.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <div>
            © 2026 Ministry of Consumer Affairs, Food & Public Distribution • SIH Team ByteBusters
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built for Digital India & Transparent Consumer Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
