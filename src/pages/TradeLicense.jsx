import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Building,
  AlertCircle
} from 'lucide-react';

export default function TradeLicense() {
  const navigate = useNavigate();

  const handleAskAI = (query) => {
    navigate(`/chat?q=${encodeURIComponent(query)}`);
  };

  const tradeCategories = [
    { name: "General Retail & Wholesale", desc: "Grocery, clothing, electronics, hardware, stationary shops" },
    { name: "Food & Beverage (F&B)", desc: "Hotels, restaurants, bakeries, cafes (requires FSSAI & Health NOC)" },
    { name: "Automobile & Mechanical", desc: "Service centers, battery workshops, tyre retreading" },
    { name: "Health, Spa & Lodging", desc: "Hotels, lodges, hospitals, beauty salons, gyms" },
    { name: "Manufacturing & Industrial", desc: "Small scale units, flour mills, fabrication (requires KSPCB NOC)" }
  ];

  const requiredFields = [
    { label: "Application & Firm Name", desc: "Registered commercial trading style / business entity name" },
    { label: "Premises PID & Tax", desc: "Property Identification Number with up-to-date MCC tax receipt" },
    { label: "Trade Category & Horsepower", desc: "Nature of trade classification and connected electric load (HP)" },
    { label: "Applicant Identification", desc: "Aadhaar / PAN of proprietor or authorized managing partner" },
    { label: "Premise Tenancy", desc: "Registered Lease Deed or Owner NOC with property tax receipt" },
    { label: "Validity & Renewal", desc: "Valid for 1 financial year (April 1 to March 31); renewable annually" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-navy-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/10">
            <Store className="w-3.5 h-3.5" />
            <span>Health & Revenue Department • Mysuru City Corporation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Commercial Trade License Information
          </h1>
          <p className="text-sm text-indigo-100/90 leading-relaxed">
            Statutory licensing requirements, trade schedule categories, inspection norms, and Sakala application timelines for businesses in Mysuru.
          </p>

          <div className="pt-3">
            <button
              onClick={() => handleAskAI("What documents and NOCs are required for a trade license in Mysuru?")}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-indigo-50 text-navy-900 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <span>Ask CivicAssist about Trade Licenses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Structured Trade Application Fields */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Application Components & Structure</h2>
          <p className="text-xs text-slate-500">Key data points required when filing an MCC Trade License application</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requiredFields.map((field, idx) => (
            <div key={idx} className="civic-card p-4.5 space-y-1.5">
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                {field.label}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {field.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Categories Schedule */}
      <div className="civic-card p-6 sm:p-7 space-y-4">
        <h2 className="text-base font-bold text-navy-900">Trade Categories & Applicable NOCs</h2>
        <div className="space-y-2.5">
          {tradeCategories.map((cat, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900">{cat.name}</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">{cat.desc}</p>
              </div>
              <button
                onClick={() => handleAskAI(`What are the fees and NOC rules for ${cat.name} trade license?`)}
                className="text-civic-700 font-semibold hover:underline shrink-0 text-left sm:text-right"
              >
                Ask about {cat.name.split(' ')[0]} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sakala Guarantee & Official Source */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-600">
          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Sakala Service GSC-HD-04: Guaranteed processing within <strong>15 Working Days</strong></span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <ShieldCheck className="w-4 h-4 text-civic-600" />
          <span>Source: MCC Trade License Schedule of Rates</span>
        </div>
      </div>
    </div>
  );
}
