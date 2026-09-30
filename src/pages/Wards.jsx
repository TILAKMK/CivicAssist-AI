import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Users, 
  Sparkles, 
  PhoneCall, 
  Building2, 
  Compass, 
  ArrowRight,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { getWards } from '../services/api';

export default function Wards({ selectedWard, onSelectWard }) {
  const [data, setData] = useState({ wards: [], zones: [] });
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    getWards().then(setData);
  }, []);

  const filteredWards = (data.wards || []).filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.area.toLowerCase().includes(search.toLowerCase()) ||
      `ward ${w.wardNumber}`.includes(search.toLowerCase()) ||
      w.keyStreets.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesZone = selectedZone === 'all' || w.zone === Number(selectedZone);

    return matchesSearch && matchesZone;
  });

  const handleAskAboutWard = (ward) => {
    onSelectWard(ward);
    navigate(`/chat?q=${encodeURIComponent(`Tell me about Ward ${ward.wardNumber}: ${ward.name}, its zonal office and corporator contacts`)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-civic-50 text-civic-800 text-xs font-semibold border border-civic-200">
            <Compass className="w-3.5 h-3.5" />
            <span>65 Administrative Wards • 9 Zonal Offices</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Mysuru Ward Explorer
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl">
            Locate your municipal ward, examine registered street networks, population figures, and administrative zonal offices.
          </p>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <MapIcon className="w-4 h-4 text-teal-400" />
          <span>Open Ward GIS Map</span>
        </button>
      </div>

      {/* Search & Zone Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ward name, street, or area (e.g. Gokulam, Kalidasa Road)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-civic-500/20 focus:border-civic-600 transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-400 text-xs font-medium shrink-0">Zone:</span>
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedZone === 'all'
                ? 'bg-civic-700 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Wards
          </button>
          {data.zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id.toString())}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedZone === zone.id.toString()
                  ? 'bg-civic-700 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Zone {zone.id}
            </button>
          ))}
        </div>
      </div>

      {/* Wards Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWards.map((ward) => (
          <div
            key={ward.wardNumber}
            className="civic-card p-6 flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 text-xs font-bold bg-navy-900 text-white rounded-lg">
                  Ward {ward.wardNumber}
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {ward.zoneName.split('-')[0].trim()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-navy-900 group-hover:text-civic-700 transition-colors">
                  {ward.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{ward.area}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                    <Users className="w-3 h-3" />
                    <span>Population</span>
                  </div>
                  <span className="font-semibold text-slate-800 text-xs">
                    ~{ward.population.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                    <MapPin className="w-3 h-3" />
                    <span>Streets</span>
                  </div>
                  <span className="font-semibold text-slate-800 text-xs">
                    {ward.streetsCount} Streets
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-medium text-slate-400">Key Street Networks:</span>
                <div className="flex flex-wrap gap-1">
                  {ward.keyStreets.map((street, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {street}
                    </span>
                  ))}
                </div>
              </div>

              {ward.corporator && (
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                  <p><strong className="text-slate-700">{ward.corporator.name}:</strong> {ward.corporator.officeLocation}</p>
                  <p className="text-slate-400">Contact: {ward.corporator.contact}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onSelectWard(ward)}
                className="text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                Set as my ward
              </button>
              <button
                onClick={() => handleAskAboutWard(ward)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-civic-50 hover:bg-civic-100 text-civic-800 text-xs font-semibold rounded-lg border border-civic-200/80 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-civic-600" />
                <span>Ask about this ward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
