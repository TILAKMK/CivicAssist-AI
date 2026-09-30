import React, { useState } from 'react';
import { 
  Bot, 
  CheckCircle, 
  BookOpen, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Check, 
  Info, 
  FileCheck2, 
  Building, 
  Clock, 
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import ContextIndicator from './ContextIndicator';
import SafeFallback from './SafeFallback';

export default function AIResponse({ 
  message, 
  onViewSource, 
  onAskFollowUp 
}) {
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null
  const [copied, setCopied] = useState(false);

  if (message.safe_fallback) {
    return (
      <div className="space-y-2 animate-slide-up">
        <SafeFallback onResetQuery={() => onAskFollowUp && onAskFollowUp('')} />
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const keyInfo = message.key_info;
  const primarySource = message.sources && message.sources.length > 0 ? message.sources[0] : null;

  return (
    <div className="space-y-2.5 max-w-3xl animate-slide-up">
      {/* Context indicator if continuation was detected */}
      {message.context_used && message.context_topic && (
        <ContextIndicator topic={message.context_topic} />
      )}

      {/* Main AI Response Bubble */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-civic-200 transition-colors space-y-4 text-slate-800">
        {/* Header with CivicAssist Bot Badge & Copy Action */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-civic-700 to-civic-600 text-white flex items-center justify-center shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-xs text-navy-900 tracking-tight">CivicAssist AI</span>
                <span className="text-[10px] font-medium px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200/60 rounded">
                  Grounded Response
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Mysuru Municipal Knowledge Base</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Copy answer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Core Answer Text */}
        <div className="text-sm text-slate-800 leading-relaxed font-normal">
          <p>{message.answer}</p>
        </div>

        {/* Structured KEY INFORMATION Box (if present) */}
        {keyInfo && (
          <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex items-center space-x-1.5 text-navy-900 font-semibold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200/60">
              <Info className="w-3.5 h-3.5 text-civic-600" />
              <span>Key Information Summary</span>
            </div>

            {/* Department */}
            {keyInfo.department && (
              <div className="flex items-start space-x-2">
                <Building className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-slate-600">Department: </span>
                  <span className="text-slate-900 font-medium">{keyInfo.department}</span>
                </div>
              </div>
            )}

            {/* Timelines */}
            {keyInfo.timelines && (
              <div className="flex items-start space-x-2">
                <Clock className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-slate-600">Statutory Timeline: </span>
                  <span className="text-slate-900 font-semibold">{keyInfo.timelines}</span>
                </div>
              </div>
            )}

            {/* Contact / Emergency Number */}
            {keyInfo.contactNumber && (
              <div className="flex items-start space-x-2 bg-red-50/70 p-2 rounded-lg border border-red-200/60">
                <PhoneCall className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-red-900">Direct Helpline: </span>
                  <span className="text-red-700 font-bold text-sm">{keyInfo.contactNumber}</span>
                </div>
              </div>
            )}

            {/* Required Documents list */}
            {keyInfo.documents && keyInfo.documents.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="font-semibold text-slate-700 block">Required Checklist / Documents:</span>
                <ul className="space-y-1 pl-1">
                  {keyInfo.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-700">
                      <span className="text-civic-600 font-bold shrink-0">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Procedure steps */}
            {keyInfo.procedure && keyInfo.procedure.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="font-semibold text-slate-700 block">Application Procedure:</span>
                <ol className="space-y-1 pl-1">
                  {keyInfo.procedure.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-700">
                      <span className="text-slate-400 font-semibold text-[11px] shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Fees */}
            {keyInfo.fees && (
              <div className="pt-1 text-slate-700">
                <span className="font-semibold text-slate-800">Applicable Fees: </span>
                <span>{keyInfo.fees}</span>
              </div>
            )}

            {/* Notes */}
            {keyInfo.notes && (
              <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/50">
                {keyInfo.notes}
              </div>
            )}
          </div>
        )}

        {/* Source Attribution & Verification Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Source Tag */}
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="inline-flex items-center text-teal-700 font-semibold text-[11px]">
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Source-backed response
            </span>
          </div>

          {/* Primary Source Snippet + Button */}
          {primarySource && (
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs" title={primarySource.title}>
                📚 {primarySource.title}
              </span>
              <button
                onClick={() => onViewSource && onViewSource(primarySource)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold text-civic-700 bg-civic-50 hover:bg-civic-100 border border-civic-200/70 rounded-md transition-colors shrink-0"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Feedback Bar */}
        <div className="pt-2 border-t border-slate-100/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Was this municipal information helpful?</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFeedback('up')}
              className={`p-1 rounded-md transition-colors flex items-center space-x-1 ${
                feedback === 'up'
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Helpful</span>
            </button>
            <button
              onClick={() => setFeedback('down')}
              className={`p-1 rounded-md transition-colors flex items-center space-x-1 ${
                feedback === 'down'
                  ? 'bg-rose-50 text-rose-700 font-medium'
                  : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Not helpful</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
