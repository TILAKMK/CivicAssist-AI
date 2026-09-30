import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Store, 
  FileCheck, 
  RefreshCw, 
  Layers, 
  FileText, 
  Droplets, 
  Pipette, 
  Search, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { getServices } from '../services/api';

const iconMap = {
  Building2,
  Store,
  FileCheck,
  RefreshCw,
  Layers,
  FileText,
  Droplets,
  Pipette
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  const categories = ['All', 'Building', 'Licenses', 'Property', 'Certificates', 'Water'];

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-civic-50 text-civic-800 text-xs font-semibold border border-civic-200">
          <span>Mysuru City Corporation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Mysuru Municipal Services
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Explore public procedural requirements, required checklists, and Sakala timelines, or ask CivicAssist directly.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services (e.g. Building plan, Mutation, Water tap)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-civic-500/20 focus:border-civic-600 transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-civic-700 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = iconMap[service.icon] || Building2;
          return (
            <div
              key={service.id}
              className="civic-card p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-civic-50 border border-civic-100 text-civic-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  {service.sakalaApplicable && (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      <Clock className="w-3 h-3 text-teal-600" />
                      <span>Sakala: {service.timeLimitDays} Days</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-navy-900 group-hover:text-civic-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{service.department}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/services/${service.id}`)}
                  className="text-xs font-semibold text-slate-700 hover:text-navy-900 transition-colors"
                >
                  View Requirements →
                </button>
                <button
                  onClick={() => navigate(`/chat?q=${encodeURIComponent(`What is the procedure and documents for ${service.title}?`)}`)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-civic-50 hover:bg-civic-100 text-civic-800 text-xs font-semibold rounded-lg border border-civic-200/80 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-civic-600" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
