import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Receipt, 
  Sparkles, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Layers, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function PropertyTax() {
  const navigate = useNavigate();

  const handleAskAI = (query) => {
    navigate(`/chat?q=${encodeURIComponent(query)}`);
  };

  const exampleQuestionChips = [
    "How do I pay property tax online?",
    "What is PID?",
    "How can I search property information?",
    "What is the Self-Assessment Scheme (SAS)?",
    "Where do I find my Ward and Assessment Number?",
    "What is the early bird tax rebate deadline?"
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-civic-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold border border-white/10">
            <Receipt className="w-3.5 h-3.5" />
            <span>Revenue Department • Mysuru City Corporation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Property Tax & Self-Assessment (SAS)
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Guidance on Mysuru property tax calculation, unique PID structure, online SAS payment procedure, and tax receipts.
          </p>

          <div className="pt-3">
            <button
              onClick={() => handleAskAI("How do I calculate and pay property tax online in Mysuru?")}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-blue-50 text-navy-900 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-civic-700" />
              <span>Ask CivicAssist about Property Tax</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Question Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 block">Frequently Asked Tax Inquiries:</span>
        <div className="flex flex-wrap gap-2">
          {exampleQuestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleAskAI(chip)}
              className="px-3 py-1.5 bg-white hover:bg-civic-50 border border-slate-200 hover:border-civic-300 rounded-lg text-xs font-medium text-slate-700 transition-all shadow-2xs"
            >
              ✨ {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: What is PID? */}
        <div className="civic-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-civic-700">
            <Layers className="w-5 h-5" />
            <h2 className="text-base font-bold text-navy-900">PID & Property Number</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A Property Identification Number (PID) is a unique identifier assigned to every registered property in Mysuru. It encodes the Administrative Zone, Ward Number, and Assessment Sequence.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
            <span className="font-semibold text-slate-800 block">Where to find your PID:</span>
            <p className="text-slate-600">• Top header of your previous year's Property Tax paid receipt</p>
            <p className="text-slate-600">• Official MCC Khata Certificate (A-Khata)</p>
          </div>
        </div>

        {/* Section 2: Online Payment Procedure */}
        <div className="civic-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-civic-700">
            <CreditCard className="w-5 h-5" />
            <h2 className="text-base font-bold text-navy-900">Online SAS Payment Procedure</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mysuru property owners can pay tax online under the Self-Assessment Scheme without visiting zonal offices:
          </p>
          <ol className="text-xs space-y-1.5 text-slate-700 pl-4 list-decimal">
            <li>Visit the official MCC SAS Property Tax portal</li>
            <li>Enter your 15-digit PID or Ward + Property Assessment Number</li>
            <li>Verify auto-calculated tax demand, solid waste cess, and rebate</li>
            <li>Complete payment via UPI / Netbanking / Debit card</li>
            <li>Download the digitally signed SAS e-Receipt</li>
          </ol>
        </div>

        {/* Section 3: Property Search Principles */}
        <div className="civic-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-civic-700">
            <Search className="w-5 h-5" />
            <h2 className="text-base font-bold text-navy-900">Property Search Concepts</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Public property searches allow verification of municipal assessment records, zonal unit rates, and pending tax dues.
          </p>
          <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl text-xs text-amber-900">
            <span className="font-semibold block mb-0.5">Privacy Safeguard Notice:</span>
            Personal phone numbers, private identity documents, and sensitive ownership records are protected and never displayed in public inquiries.
          </div>
        </div>

        {/* Section 4: Ward Information in Assessment */}
        <div className="civic-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-civic-700">
            <FileText className="w-5 h-5" />
            <h2 className="text-base font-bold text-navy-900">Zonal Tax Rates & Wards</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tax rates in Mysuru are classified by zones (Principal Commercial, Primary Residential, and Developing Peripheral).
          </p>
          <div className="text-xs text-slate-600 space-y-1 pt-1">
            <p>• Commercial properties attract commercial unit rates based on built-up area</p>
            <p>• Vacant sites are taxed based on square meter plot area</p>
            <p>• 5% early payment rebate is granted for prompt payment in April</p>
          </div>
        </div>
      </div>

      {/* Official Source Banner */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Information grounded in: <strong>MCC Property Tax User Manual & Karnataka Municipal Corporations Act</strong></span>
        </div>
        <button
          onClick={() => handleAskAI("Explain the formula used for Mysuru property tax calculation")}
          className="text-civic-700 font-semibold hover:underline"
        >
          Ask calculation formula →
        </button>
      </div>
    </div>
  );
}
