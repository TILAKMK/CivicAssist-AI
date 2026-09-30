import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  MessageSquare, 
  AlertCircle, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Help() {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();

  const faqs = [
    {
      q: "What can I ask CivicAssist AI?",
      a: "You can ask natural-language questions about Mysuru City Corporation (MCC) services, including building license plan sanctions, property tax PID payments, commercial trade licenses, birth and death certificate modifications, water tap and UGD connections, waste segregation guidelines, 65 ward boundaries, and emergency helplines."
    },
    {
      q: "How does CivicAssist find verified answers?",
      a: "CivicAssist utilizes a Retrieval-Augmented Generation (RAG) architecture. When you ask a question, our retrieval engine searches the verified Mysuru Municipal Knowledge Base for matching statutory procedures, checklists, and Sakala standards. Gemini LLM then generates a concise, readable response strictly grounded in those retrieved documents."
    },
    {
      q: "What are the source attributions shown on responses?",
      a: "Every verified answer provides transparent attribution linking back to its official municipal document (such as 'MCC Application Procedures', 'MCC Property Tax User Manual', or 'MCC Trade License Regulations'). You can click 'View Source' on any message to inspect the exact citations and administrative authority."
    },
    {
      q: "Does CivicAssist remember conversation context?",
      a: "Yes! CivicAssist maintains multi-turn conversation memory. For example, if you ask 'What documents are required for a building license?' and follow up with 'What about the fees?' or 'How long does it take?', CivicAssist understands that you are still asking about building licenses and provides the contextual answer with a visual indicator (↳ Continuing from Building License)."
    },
    {
      q: "What happens if information is not available?",
      a: "Rather than fabricating or guessing government policies, CivicAssist activates a Safe Fallback mechanism. The system clearly states that verified information is unavailable in the municipal knowledge base and provides direct links to MCC zonal helplines and department contacts."
    },
    {
      q: "Can I use CivicAssist to look up private property owner records?",
      a: "No. CivicAssist is designed strictly as a public procedural assistant. In accordance with citizen privacy guidelines, private ownership records, personal contact numbers, and confidential tax balances are not disclosed through this assistant."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-civic-50 text-civic-800 text-xs font-semibold border border-civic-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Architecture & Citizen Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          How CivicAssist Works
        </h1>
        <p className="text-slate-500 text-sm">
          Understanding our AI-powered public-service information system.
        </p>
      </div>

      {/* 5 Core Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="civic-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="font-bold text-sm text-navy-900">Natural Queries</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Speak naturally without memorizing municipal department codes or complex legal terminology.
          </p>
        </div>

        <div className="civic-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="font-bold text-sm text-navy-900">Deterministic RAG</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every output is conditioned on retrieved MCC documentation to minimize AI hallucinations.
          </p>
        </div>

        <div className="civic-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="font-bold text-sm text-navy-900">Context Retention</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Multi-turn conversation memory allows seamless follow-up questions regarding fees and timelines.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-navy-900 mb-2">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-xs sm:text-sm text-navy-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-civic-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 pt-2 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100 animate-slide-up">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-civic-800 to-navy-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Have a specific municipal question?</h3>
          <p className="text-xs text-slate-300 mt-0.5">Start chatting with CivicAssist AI right away.</p>
        </div>
        <button
          onClick={() => navigate('/chat')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-navy-900 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-civic-700" />
          <span>Launch AI Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
