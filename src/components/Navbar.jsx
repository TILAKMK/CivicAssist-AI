import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Sparkles, 
  Menu, 
  X, 
  ChevronDown,
  Layers,
  FileText,
  HelpCircle,
  PhoneCall,
  Map
} from 'lucide-react';

export default function Navbar({ selectedWard, onOpenWardModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Assistant', path: '/chat', badge: 'AI' },
    { name: 'Services', path: '/services' },
    { name: 'Wards', path: '/wards' },
    { name: 'Map', path: '/map' },
    { name: 'Sources', path: '/sources' },
    { name: 'Help', path: '/help' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-civic-800 to-civic-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
                <span className="text-xl select-none" role="img" aria-label="Civic Emblem">🏛</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight text-navy-900 group-hover:text-civic-700 transition-colors">
                    CivicAssist
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-civic-100 text-civic-800 rounded uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:inline-block font-medium">
                  Mysuru Municipal Public Assistant
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-1.5 ${
                    active
                      ? 'bg-civic-50 text-civic-800 font-semibold border border-civic-200/60'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Ward Selector + Lang + Ask AI CTA */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Location / Ward Selector Context */}
            <button
              onClick={onOpenWardModal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200/80 transition-colors"
              title="Click to set your Mysuru Ward"
            >
              <MapPin className="w-3.5 h-3.5 text-civic-600" />
              <span>{selectedWard ? `Ward ${selectedWard.wardNumber}: ${selectedWard.name.split('/')[0].trim()}` : '📍 Mysuru City'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Language Tag */}
            <div className="flex items-center space-x-1 px-2 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>EN</span>
            </div>

            {/* Primary Ask AI CTA */}
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-civic-700 to-civic-600 hover:from-civic-800 hover:to-civic-700 rounded-lg shadow-xs hover:shadow transition-all duration-200 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Mobile Menu & Quick Ask Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-civic-700 rounded-lg shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-slide-up">
          {/* Location context bar on mobile */}
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWardModal();
              }}
              className="flex items-center space-x-1.5 text-xs font-medium text-civic-800 bg-civic-50 px-2.5 py-1.5 rounded-lg border border-civic-200/80 w-full"
            >
              <MapPin className="w-3.5 h-3.5 text-civic-600 shrink-0" />
              <span className="truncate">
                {selectedWard ? `Ward ${selectedWard.wardNumber}: ${selectedWard.name}` : '📍 Mysuru City Corporation (Select Ward)'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                    active
                      ? 'bg-civic-50 text-civic-800 font-semibold border-l-4 border-civic-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Language: English</span>
            <Link
              to="/helplines"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-1 text-red-600 font-medium"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Emergency 100/101</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
