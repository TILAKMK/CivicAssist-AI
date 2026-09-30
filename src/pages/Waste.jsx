import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Recycle, 
  Truck, 
  Factory, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Info,
  AlertTriangle
} from 'lucide-react';

export default function Waste() {
  const navigate = useNavigate();

  const handleAskAI = (query) => {
    navigate(`/chat?q=${encodeURIComponent(query)}`);
  };

  const segregationBins = [
    {
      type: "Wet / Organic Waste",
      bin: "Green Bin",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      badgeColor: "bg-emerald-600 text-white",
      items: ["Vegetable & fruit peels", "Cooked food leftovers", "Tea leaves & egg shells", "Garden dry leaves & flowers", "Soiled paper napkins"],
      destination: "Processed at 9 Zero Waste Management (ZWM) Plants & Vidyaranyapuram Compost Plant."
    },
    {
      type: "Dry / Recyclable Waste",
      bin: "Blue Bin",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      badgeColor: "bg-blue-600 text-white",
      items: ["Plastic containers & bottles", "Cardboard, newspapers & books", "Glass bottles & jars", "Metal cans & aluminium foil", "Clean milk sachets"],
      destination: "Collected for material recovery facilities (MRF) and authorized recycling units."
    },
    {
      type: "Domestic Hazardous & Sanitary",
      bin: "Red / Marked Wrap",
      color: "bg-rose-50 border-rose-200 text-rose-800",
      badgeColor: "bg-rose-600 text-white",
      items: ["Diapers & sanitary napkins (wrapped in newspaper marked with red cross)", "Expired medicines", "Broken thermometers & tube lights", "Batteries & e-waste"],
      destination: "Dispatched to Common Bio-Medical & Hazardous Waste Incineration facilities."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/10">
            <Recycle className="w-3.5 h-3.5" />
            <span>Solid Waste Management (SWM) • Mysuru City Corporation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Solid Waste Management & Segregation
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Mysuru's award-winning civic waste segregation protocols, 3-bin guidelines, processing facilities, and collection mechanisms.
          </p>

          <div className="pt-3">
            <button
              onClick={() => handleAskAI("What are the rules for household waste segregation in Mysuru?")}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-emerald-50 text-navy-900 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Ask CivicAssist about Waste Management</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Accurate Schedule Notice */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4.5 rounded-r-2xl text-xs space-y-1 text-slate-800 shadow-2xs">
        <div className="flex items-center space-x-2 text-amber-900 font-semibold">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>Real-Time Collection Schedule Notice</span>
        </div>
        <p className="text-amber-950/80 leading-relaxed">
          "Current area-specific schedule not available in the connected knowledge base. Morning door-to-door auto-tipper collection typically takes place between 6:30 AM and 11:30 AM across residential wards."
        </p>
      </div>

      {/* 3-Way Source Segregation Guide */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Mandatory 3-Way Source Segregation</h2>
          <p className="text-xs text-slate-500">Every household and commercial establishment in MCC limits must segregate at source</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segregationBins.map((bin, idx) => (
            <div key={idx} className={`rounded-2xl border p-5 space-y-4 flex flex-col justify-between ${bin.color}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${bin.badgeColor}`}>
                    {bin.bin}
                  </span>
                  <Recycle className="w-4 h-4 opacity-70" />
                </div>

                <h3 className="font-bold text-sm text-navy-900">{bin.type}</h3>

                <ul className="space-y-1.5 text-xs text-slate-700">
                  {bin.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="font-bold text-slate-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-600">
                <strong>Facility: </strong> {bin.destination}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection System & Processing Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="civic-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-civic-700">
            <Truck className="w-5 h-5" />
            <h2 className="text-base font-bold text-navy-900">Collection System (Door-to-Door)</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            MCC operates GPS-tracked segregated auto-tippers and civic push carts covering all 65 wards. Bulk waste generators (apartments with &gt;50 units, marriage halls, hotels) are required to install on-site wet waste processing or contract authorized private concessionaires.
          </p>
          <div className="text-xs text-slate-600 pt-1 space-y-1">
            <p>• Daily wet and sanitary waste collection</p>
            <p>• Bi-weekly dry recyclable collection</p>
            <p>• Strict ban on single-use plastics under municipal bylaws</p>
          </div>
        </div>

        <div className="civic-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-civic-700">
            <Factory className="w-5 h-5" />
            <h2 className="text-base font-bold text-navy-900">Zero Waste Management Plants</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mysuru's decentralized waste processing model relies on 9 Zero Waste Management (ZWM) units located across zones (including Kumbarakoppal, Vidyaranyapuram, Gokulam, and Roopa Nagar) capable of converting organic waste into certified compost.
          </p>
          <button
            onClick={() => handleAskAI("Where are the Zero Waste Management plants located in Mysuru?")}
            className="text-xs font-semibold text-civic-700 hover:underline pt-2 inline-block"
          >
            Ask about ZWM plant locations →
          </button>
        </div>
      </div>
    </div>
  );
}
