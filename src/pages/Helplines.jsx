import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Ambulance, 
  HeartHandshake, 
  Baby, 
  Building, 
  PhoneCall, 
  Train, 
  Zap, 
  Droplet, 
  Phone, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHelplines } from '../services/api';

const iconMap = {
  ShieldAlert,
  Flame,
  Ambulance,
  HeartHandshake,
  Baby,
  Building,
  PhoneCall,
  Train,
  Zap,
  Droplet
};

export default function Helplines() {
  const [helplines, setHelplines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHelplines().then(setHelplines);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>24/7 Verified Emergency & Civic Numbers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Emergency & Public Helplines
        </h1>
        <p className="text-slate-500 text-sm">
          Verified 24/7 toll-free emergency contacts and municipal civic disruption numbers for Mysuru citizens.
        </p>
      </div>

      {/* Prominent Emergency Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {helplines.map((item) => {
          const Icon = iconMap[item.icon] || PhoneCall;
          const isHighEmergency = item.priority <= 3;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition-all duration-200 hover:shadow-md ${
                isHighEmergency
                  ? 'bg-gradient-to-br from-red-50/70 to-rose-50/40 border-red-200 hover:border-red-300'
                  : 'bg-white border-slate-200 hover:border-civic-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isHighEmergency
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-civic-50 text-civic-700 border border-civic-100'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isHighEmergency
                      ? 'bg-red-100 text-red-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-navy-900">{item.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{item.department}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                {/* Prominent Phone Number */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Helpline Number
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-navy-900 font-mono tracking-tight">
                      {item.number}
                    </span>
                    {item.altNumber && (
                      <span className="text-xs text-slate-500 font-mono">
                        / {item.altNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-200/70 flex items-center justify-between gap-2">
                <a
                  href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                  className={`flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                    isHighEmergency
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-civic-700 hover:bg-civic-800 text-white'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>

                <button
                  onClick={() => navigate(`/chat?q=${encodeURIComponent(`What is the contact and service procedure for ${item.name}?`)}`)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Ask AI about this helpline"
                >
                  <Sparkles className="w-4 h-4 text-civic-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
