import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Sparkles, 
  Users, 
  Compass, 
  ArrowLeft, 
  Building2, 
  PhoneCall, 
  Layers,
  Info
} from 'lucide-react';
import { MYSURU_WARDS } from '../data/wardsData';

// Fix standard Leaflet default icon path issue in Vite
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapFocusHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

export default function WardMap({ selectedWard, onSelectWard }) {
  const [activeWard, setActiveWard] = useState(selectedWard || MYSURU_WARDS[0]);
  const navigate = useNavigate();

  const mysuruCenter = [12.2958, 76.6394];

  const handleAskAboutWard = (ward) => {
    onSelectWard(ward);
    navigate(`/chat?q=${encodeURIComponent(`Tell me about Ward ${ward.wardNumber}: ${ward.name}, its zonal office and corporator contacts`)}`);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100">
      {/* Ward Details Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto z-10 shrink-0 shadow-md">
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl" role="img" aria-label="Map Emblem">📍</span>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-navy-900">Mysuru Ward GIS Explorer</h2>
              <p className="text-[11px] text-slate-500">Interactive Municipal Geographic Boundaries</p>
            </div>
          </div>

          {/* Active Ward Details Card */}
          {activeWard && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 animate-slide-up shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-civic-700 text-white rounded-lg">
                  Ward {activeWard.wardNumber}
                </span>
                <span className="text-[11px] font-medium text-slate-500">{activeWard.zoneName.split('-')[0]}</span>
              </div>

              <div>
                <h3 className="font-bold text-base text-navy-900">{activeWard.name}</h3>
                <p className="text-xs text-slate-500">{activeWard.area}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Population</span>
                  <span className="font-semibold text-slate-800">~{activeWard.population.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Streets</span>
                  <span className="font-semibold text-slate-800">{activeWard.streetsCount} Streets</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-medium text-slate-600 block">Registered Streets:</span>
                <div className="flex flex-wrap gap-1">
                  {activeWard.keyStreets.map((st, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {activeWard.corporator && (
                <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                  <p className="font-semibold text-slate-800">{activeWard.corporator.name}</p>
                  <p>{activeWard.corporator.officeLocation}</p>
                  <p className="text-civic-700 font-mono">{activeWard.corporator.contact}</p>
                </div>
              )}

              <button
                onClick={() => handleAskAboutWard(activeWard)}
                className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold text-white bg-civic-700 hover:bg-civic-800 rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask CivicAssist about this ward</span>
              </button>
            </div>
          )}

          {/* Quick Ward Picker List */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Mysuru Wards
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {MYSURU_WARDS.map((w) => (
                <button
                  key={w.wardNumber}
                  onClick={() => setActiveWard(w)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    activeWard.wardNumber === w.wardNumber
                      ? 'bg-civic-50 text-civic-800 font-semibold border border-civic-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate">Ward {w.wardNumber}: {w.name.split('/')[0]}</span>
                  <span className="text-[10px] text-slate-400">Zone {w.zone}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Click any marker to inspect</span>
          <button onClick={() => navigate('/wards')} className="text-civic-700 hover:underline">
            Full Directory →
          </button>
        </div>
      </div>

      {/* Map View Canvas Container */}
      <div className="flex-1 h-full min-h-[350px] relative">
        <MapContainer
          center={mysuruCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFocusHandler center={activeWard ? activeWard.coordinates : mysuruCenter} />

          {MYSURU_WARDS.map((ward) => (
            <Marker
              key={ward.wardNumber}
              position={ward.coordinates}
              icon={customIcon}
              eventHandlers={{
                click: () => setActiveWard(ward),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <strong className="text-navy-900 block font-bold">Ward {ward.wardNumber}: {ward.name}</strong>
                  <p className="text-slate-600 text-[11px]">{ward.area}</p>
                  <p className="text-slate-500 text-[10px]">Pop: ~{ward.population.toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
