import React, { useState } from 'react';
import { X, Search, MapPin, Check, Building2, Users } from 'lucide-react';
import { MYSURU_WARDS, MYSURU_ZONES } from '../data/wardsData';

export default function WardSelectorModal({ isOpen, onClose, selectedWard, onSelectWard }) {
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  if (!isOpen) return null;

  const filteredWards = MYSURU_WARDS.filter((ward) => {
    const matchesSearch =
      ward.name.toLowerCase().includes(search.toLowerCase()) ||
      `ward ${ward.wardNumber}`.includes(search.toLowerCase()) ||
      ward.keyStreets.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      ward.area.toLowerCase().includes(search.toLowerCase());

    const matchesZone = selectedZone === 'all' || ward.zone === Number(selectedZone);

    return matchesSearch && matchesZone;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-civic-100 text-civic-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-900">Select Mysuru Municipal Ward</h3>
              <p className="text-[11px] text-slate-500">Filters context for localized civic queries and corporator details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Zone Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ward name, number, or street (e.g., Gokulam, Kalidasa Road)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-civic-500/20 focus:border-civic-600 transition-all"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-medium text-slate-500 shrink-0">Zone:</span>
            <button
              onClick={() => setSelectedZone('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedZone === 'all'
                  ? 'bg-civic-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Zones
            </button>
            {MYSURU_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id.toString())}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedZone === zone.id.toString()
                    ? 'bg-civic-700 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Zone {zone.id}
              </button>
            ))}
          </div>
        </div>

        {/* Wards Grid List */}
        <div className="p-4 overflow-y-auto space-y-2 max-h-[50vh]">
          {filteredWards.map((ward) => {
            const isSelected = selectedWard && selectedWard.wardNumber === ward.wardNumber;
            return (
              <div
                key={ward.wardNumber}
                onClick={() => {
                  onSelectWard(ward);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 flex items-start justify-between ${
                  isSelected
                    ? 'bg-civic-50/80 border-civic-500 ring-2 ring-civic-500/20'
                    : 'bg-white border-slate-200 hover:border-civic-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-navy-850 text-white rounded">
                      Ward {ward.wardNumber}
                    </span>
                    <span className="font-semibold text-xs text-navy-900">{ward.name}</span>
                  </div>

                  <p className="text-[11px] text-slate-500">{ward.area}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {ward.keyStreets.slice(0, 3).map((st, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {st}
                      </span>
                    ))}
                    {ward.keyStreets.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{ward.keyStreets.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3 flex flex-col items-end justify-between self-stretch">
                  <span className="text-[10px] font-medium text-slate-400">{ward.zoneName.split('-')[0]}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-civic-700 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredWards.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No wards found matching "{search}". Try searching for another locality.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>65 Wards administered under Mysuru City Corporation</span>
          <button
            onClick={() => {
              onSelectWard(null);
              onClose();
            }}
            className="text-civic-700 hover:underline font-medium"
          >
            Reset to Entire Mysuru
          </button>
        </div>
      </div>
    </div>
  );
}
