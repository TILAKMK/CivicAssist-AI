import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, MapPin, Phone, FileText, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 text-sm mt-auto">
      {/* Trust banner */}
      <div className="border-b border-navy-800/80 bg-navy-950/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-teal-400 font-bold">✓</span>
              <span>Source-backed information</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-teal-400 font-bold">✓</span>
              <span>Context-aware conversations</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-teal-400 font-bold">✓</span>
              <span>Mysuru municipal knowledge</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-teal-400 font-bold">✓</span>
              <span>Safe fallback when unavailable</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <span className="text-2xl select-none" role="img" aria-label="Civic Emblem">🏛</span>
              <span className="font-bold text-lg tracking-tight">CivicAssist AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Your city. Your questions. One intelligent assistant." Get reliable, source-backed answers for Mysuru City Corporation services.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-navy-800 border border-navy-700 text-xs text-civic-300">
              <MapPin className="w-3 h-3 text-civic-400" />
              <span>Mysuru City Corporation, Karnataka</span>
            </div>
          </div>

          {/* Col 2: Fast Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Municipal Services
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/services/building-license" className="hover:text-white transition-colors">Building License & Plan Sanction</Link></li>
              <li><Link to="/property-tax" className="hover:text-white transition-colors">Property Tax & PID Payment</Link></li>
              <li><Link to="/trade-license" className="hover:text-white transition-colors">Trade License Application</Link></li>
              <li><Link to="/waste" className="hover:text-white transition-colors">Solid Waste & Segregation</Link></li>
              <li><Link to="/services/mutation" className="hover:text-white transition-colors">Khata Transfer (Mutation)</Link></li>
              <li><Link to="/services/water-tap-connection" className="hover:text-white transition-colors">Water Supply & UGD</Link></li>
            </ul>
          </div>

          {/* Col 3: Civic & Ward Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Civic Knowledge
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/wards" className="hover:text-white transition-colors">65 Wards & Zonal Directory</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Mysuru Ward GIS Map</Link></li>
              <li><Link to="/sources" className="hover:text-white transition-colors">Verified Knowledge Sources</Link></li>
              <li><Link to="/helplines" className="hover:text-white transition-colors">24/7 Emergency Numbers</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">How RAG AI Works</Link></li>
            </ul>
          </div>

          {/* Col 4: Important Public Disclaimer */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Public Service Notice
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed bg-navy-850 p-3 rounded-lg border border-navy-800">
              CivicAssist AI is an information assistant grounded in public MCC guidelines. It is <strong>not</strong> for filing formal grievance appeals or accessing private property records.
            </p>
            <div className="text-xs text-slate-400 pt-1">
              <span>MCC Control Room: </span>
              <a href="tel:08212418800" className="text-civic-300 hover:underline">0821-2418800</a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CivicAssist AI • Mysuru Municipal Public Service Assistant.
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Link to="/help" className="hover:text-slate-400">Architecture</Link>
            <span>•</span>
            <Link to="/sources" className="hover:text-slate-400">Knowledge Sources</Link>
            <span>•</span>
            <Link to="/helplines" className="hover:text-slate-400">Helplines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
