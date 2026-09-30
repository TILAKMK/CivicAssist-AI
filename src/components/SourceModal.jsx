import React from 'react';
import { X, BookOpen, ShieldCheck, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { KNOWLEDGE_SOURCES } from '../data/sourcesData';

export default function SourceModal({ source, isOpen, onClose }) {
  if (!isOpen || !source) return null;

  // Find rich metadata from registered knowledge sources if available
  const fullSourceData = KNOWLEDGE_SOURCES.find(
    (s) => s.id === source.id || s.title.toLowerCase().includes(source.title.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-civic-100 text-civic-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-900">Knowledge Base Source Details</h3>
              <p className="text-[11px] text-slate-500">Verified Mysore City Corporation Knowledge Item</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-sm text-slate-700">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-civic-700 bg-civic-50 px-2 py-0.5 rounded border border-civic-200/60">
              {source.category || fullSourceData?.category || 'Municipal Document'}
            </span>
            <h2 className="text-base font-bold text-navy-900 pt-1">
              {source.title || fullSourceData?.title}
            </h2>
          </div>

          {/* Excerpt / Grounding text */}
          {source.excerpt && (
            <div className="bg-slate-50 border-l-4 border-civic-600 p-3.5 rounded-r-lg text-xs leading-relaxed text-slate-800">
              <span className="font-semibold text-slate-900 block mb-1">Grounding Reference:</span>
              "{source.excerpt}"
            </div>
          )}

          {fullSourceData && (
            <>
              {/* Summary */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-900">Document Overview:</span>
                <p className="text-slate-600 leading-relaxed">{fullSourceData.summary}</p>
              </div>

              {/* Authority & Format */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                  <span className="text-slate-500 block text-[11px]">Issuing Authority</span>
                  <span className="font-semibold text-slate-800">{fullSourceData.authority}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                  <span className="text-slate-500 block text-[11px]">Source Format</span>
                  <span className="font-semibold text-slate-800">{fullSourceData.format}</span>
                </div>
              </div>

              {/* Topics Covered */}
              {fullSourceData.topics && (
                <div className="space-y-2 pt-2 text-xs">
                  <span className="font-semibold text-slate-900">Indexed Municipal Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fullSourceData.topics.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex items-center space-x-2 pt-3 text-xs text-teal-800 bg-teal-50/80 p-3 rounded-xl border border-teal-200/60">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>This source is indexed in the Mysuru Municipal RAG Pipeline for deterministic fact-grounding.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-civic-700 hover:bg-civic-800 rounded-lg shadow-xs transition-colors"
          >
            Close Source
          </button>
        </div>
      </div>
    </div>
  );
}
