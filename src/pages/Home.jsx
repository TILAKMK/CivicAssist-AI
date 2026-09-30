import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Trash2, 
  Building2, 
  Receipt, 
  Store, 
  FileText, 
  Droplets, 
  Compass, 
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

export default function Home({ selectedWard, onOpenWardModal }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/chat?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/chat');
    }
  };

  const handleQuickPrompt = (promptText) => {
    navigate(`/chat?q=${encodeURIComponent(promptText)}`);
  };

  const promptChips = [
    { label: "🗑 Waste collection", query: "When is waste collection information available?" },
    { label: "🏗 Building license", query: "What documents are required for a building license?" },
    { label: "🧾 Property tax", query: "How do I pay property tax online?" },
    { label: "🏪 Trade license", query: "What documents are required for a trade license?" },
    { label: "☎ Emergency number", query: "What is the fire emergency number?" },
  ];

  const mainServiceCards = [
    {
      id: "waste",
      title: "Waste Management",
      icon: Trash2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      desc: "Collection, segregation and waste-management information",
      route: "/waste",
      aiQuery: "How does waste segregation and collection work in Mysuru?"
    },
    {
      id: "building-license",
      title: "Building Licenses",
      icon: Building2,
      color: "text-civic-700 bg-civic-50 border-civic-100",
      desc: "Building license procedures and required documents",
      route: "/services/building-license",
      aiQuery: "What documents are required for a building license?"
    },
    {
      id: "property-tax",
      title: "Property Tax",
      icon: Receipt,
      color: "text-blue-700 bg-blue-50 border-blue-100",
      desc: "Property information and online tax procedures",
      route: "/property-tax",
      aiQuery: "How do I calculate and pay property tax online?"
    },
    {
      id: "trade-license",
      title: "Trade License",
      icon: Store,
      color: "text-indigo-700 bg-indigo-50 border-indigo-100",
      desc: "License application requirements and information",
      route: "/trade-license",
      aiQuery: "What are the requirements for a commercial trade license?"
    },
    {
      id: "certificates",
      title: "Certificates",
      icon: FileText,
      color: "text-amber-700 bg-amber-50 border-amber-100",
      desc: "Birth and death certificate procedures",
      route: "/services/birth-death-modification",
      aiQuery: "How can I correct spelling in a birth certificate?"
    },
    {
      id: "water",
      title: "Water & UGD",
      icon: Droplets,
      color: "text-cyan-700 bg-cyan-50 border-cyan-100",
      desc: "New water tap and UGD connection procedures",
      route: "/services/water-tap-connection",
      aiQuery: "What is the procedure for a new water tap connection?"
    },
    {
      id: "wards",
      title: "Ward Information",
      icon: Compass,
      color: "text-purple-700 bg-purple-50 border-purple-100",
      desc: "Wards, streets, population and civic contacts",
      route: "/wards",
      aiQuery: "Tell me about Mysuru municipal wards and zonal offices"
    },
    {
      id: "helplines",
      title: "Emergency Helplines",
      icon: PhoneCall,
      color: "text-rose-700 bg-rose-50 border-rose-100",
      desc: "Important public emergency contacts",
      route: "/helplines",
      aiQuery: "What are the emergency helpline numbers in Mysuru?"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "ASK",
      desc: "Ask your question naturally in plain language.",
      tag: "Natural Query"
    },
    {
      step: "02",
      title: "UNDERSTAND",
      desc: "CivicAssist understands intent and conversation context.",
      tag: "Context Aware"
    },
    {
      step: "03",
      title: "RETRIEVE",
      desc: "Relevant municipal information is retrieved from the knowledge base.",
      tag: "RAG Retrieval"
    },
    {
      step: "04",
      title: "GENERATE",
      desc: "Gemini generates a deterministic, grounded response.",
      tag: "Grounded LLM"
    },
    {
      step: "05",
      title: "SOURCE",
      desc: "The response displays its exact supporting official source.",
      tag: "Transparency"
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center civic-hero-gradient">
        {/* Small Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-civic-50 border border-civic-200/80 text-civic-800 text-xs font-semibold tracking-wide uppercase shadow-2xs mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-civic-600 animate-pulse"></span>
          <span>Mysuru Municipal AI Assistant</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15] mb-6">
          Your city's services.<br />
          <span className="bg-gradient-to-r from-civic-700 via-civic-600 to-teal-600 bg-clip-text text-transparent">
            Simplified by AI.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Ask questions about Mysuru municipal services, permits, property procedures, waste management, ward information and public helplines.
        </p>

        {/* Main AI Search Box */}
        <div className="max-w-2xl mx-auto mb-4">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="flex items-center bg-white border-2 border-slate-200 group-hover:border-civic-400 group-focus-within:border-civic-600 group-focus-within:ring-4 group-focus-within:ring-civic-500/15 rounded-2xl shadow-md p-2 transition-all duration-200">
              <div className="pl-3 pr-2 text-civic-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about Mysuru municipal services..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden py-2"
              />
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2.5 bg-civic-700 hover:bg-civic-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 shadow-xs"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto text-xs text-slate-500 mb-6">
          <span className="font-medium text-slate-400">Try asking:</span>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(chip.query)}
              className="px-3 py-1.5 bg-white hover:bg-civic-50 hover:border-civic-300 border border-slate-200 rounded-lg text-slate-700 font-medium transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Location Context Selector */}
        <div className="inline-flex items-center space-x-2 bg-slate-100/90 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-civic-600" />
          <span>Mysuru City Corporation</span>
          <span className="text-slate-300">|</span>
          <button
            onClick={onOpenWardModal}
            className="text-civic-700 hover:text-civic-800 font-semibold underline decoration-civic-300 hover:decoration-civic-600 cursor-pointer"
          >
            {selectedWard ? `Ward ${selectedWard.wardNumber}: ${selectedWard.name.split('/')[0]}` : 'Select Ward ▼'}
          </button>
        </div>

        {/* Trust Indicators Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-10 mt-6 border-t border-slate-200/80 max-w-4xl mx-auto text-left">
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs text-navy-900">Source-backed</h4>
              <p className="text-[11px] text-slate-500">Grounded in official MCC rules</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs text-navy-900">Context-aware</h4>
              <p className="text-[11px] text-slate-500">Maintains conversation thread</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs text-navy-900">Mysuru Knowledge</h4>
              <p className="text-[11px] text-slate-500">65 Wards & 9 Zonal Offices</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs text-navy-900">Safe Fallback</h4>
              <p className="text-[11px] text-slate-500">No hallucinated schedules</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Cards (2x4 / 4x2 Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-civic-700 bg-civic-50 px-2.5 py-1 rounded border border-civic-200/60">
              MCC Information Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mt-2">
              Explore Municipal Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select any core public service to read guidelines or ask CivicAssist directly.
            </p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-civic-700 hover:text-civic-800 transition-colors"
          >
            <span>View all services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainServiceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="civic-card p-5 flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => navigate(card.route)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-base text-navy-900 mb-1 group-hover:text-civic-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleQuickPrompt(card.aiQuery)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-civic-700 hover:text-civic-800 transition-colors group/btn"
                  >
                    <span>Ask AI</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate(card.route)}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    Guide →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Assistant Preview Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900 to-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-navy-800 overflow-hidden relative">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-navy-800 text-teal-400 text-xs font-semibold mb-3 border border-navy-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask CivicAssist Interactive Preview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Concise, Context-Aware & Source-Backed
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              CivicAssist retrieves authentic MCC application guidelines and answers questions without confusing civic jargon.
            </p>
          </div>

          {/* Example Conversation Thread */}
          <div className="space-y-4 max-w-2xl">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-civic-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm max-w-md shadow-xs">
                "What documents are required for a building license?"
              </div>
            </div>

            {/* AI Response Card */}
            <div className="flex justify-start">
              <div className="bg-navy-900 border border-navy-750 p-4 sm:p-5 rounded-2xl rounded-tl-xs text-xs sm:text-sm max-w-xl space-y-3 text-slate-200 shadow-md">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-civic-600 text-white flex items-center justify-center text-xs">🏛</span>
                  <span className="font-semibold text-xs text-slate-100">CivicAssist AI</span>
                  <span className="text-[10px] text-teal-400 font-mono">✓ Verified RAG</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  According to the municipal application information, a building license application in Mysuru requires:
                </p>
                <ul className="text-xs space-y-1 text-slate-300 pl-2">
                  <li>• Latest Property Tax paid receipt</li>
                  <li>• Title/Sale Deed and latest Encumbrance Certificate</li>
                  <li>• Detailed architectural building plan signed by registered architect</li>
                  <li>• Applicable Fire NOC & MUDA clearance (if peripheral)</li>
                </ul>
                <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1 text-teal-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Source: MCC Application Procedures</span>
                  </span>
                  <span className="text-slate-500 font-mono">Sakala GSC-TP-01</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-8 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Ready to explore your municipal questions?
            </span>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-civic-500 hover:from-teal-600 hover:to-civic-600 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-navy-950" />
              <span>Continue conversation in AI Assistant</span>
              <ArrowRight className="w-4 h-4 text-navy-950" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works (01 ASK -> 02 UNDERSTAND -> 03 RETRIEVE -> 04 GENERATE -> 05 SOURCE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-civic-700 bg-civic-50 px-2.5 py-1 rounded border border-civic-200/60">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mt-2">
            How CivicAssist Works
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Deterministic public service answers powered by a transparent Retrieval-Augmented Generation (RAG) pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative flex flex-col justify-between hover:border-civic-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-mono font-extrabold text-civic-600">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-navy-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>

              {idx < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 border border-slate-200 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Verified Municipal Information Notice (No Fake Events) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-slate-500 text-xs font-semibold">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Civic Announcements & Schedules</span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            "Events, public hearings, and seasonal announcements will appear here when connected to a verified municipal source."
          </p>
        </div>
      </section>
    </div>
  );
}
