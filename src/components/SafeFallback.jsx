import React from 'react';
import { AlertCircle, ArrowRight, PhoneCall, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SafeFallback({ onResetQuery }) {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-4.5 my-2 space-y-3 text-slate-800 shadow-xs max-w-2xl">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-amber-900 flex items-center space-x-1.5">
            <span>Verified Information Unavailable</span>
          </h4>
          <p className="text-xs text-amber-950/80 leading-relaxed">
            I don't have enough verified information in the current Mysuru municipal knowledge base to answer this reliably. Rather than guessing, please contact the relevant municipal department.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-amber-200/60 flex flex-wrap gap-2">
        {onResetQuery && (
          <button
            onClick={onResetQuery}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 rounded-lg border border-amber-300/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-800" />
            <span>Ask another question</span>
          </button>
        )}
        <button
          onClick={() => navigate('/helplines')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-civic-700 hover:bg-civic-800 rounded-lg shadow-2xs transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>View MCC Helplines & Contacts</span>
        </button>
      </div>
    </div>
  );
}
