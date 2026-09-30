import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, CircleDashed, Search, Sparkles } from 'lucide-react';

export default function RetrievalState() {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 220);
    const t2 = setTimeout(() => setStage(3), 460);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="flex items-start space-x-3 max-w-2xl animate-fade-in my-3">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-civic-700 to-civic-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
        <Bot className="w-4 h-4 animate-pulse" />
      </div>

      {/* RAG Process Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2 text-xs w-full max-w-md">
        <div className="flex items-center space-x-2 text-slate-700 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-civic-600 animate-spin" />
          <span>CivicAssist is retrieving verified municipal information...</span>
        </div>

        <div className="space-y-1.5 pt-1 border-t border-slate-100 font-mono text-[11px]">
          {/* Stage 1: Understanding Question */}
          <div className="flex items-center space-x-2 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Understanding question & intent</span>
          </div>

          {/* Stage 2: Searching Knowledge Base */}
          <div className={`flex items-center space-x-2 ${stage >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
            {stage >= 2 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <CircleDashed className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />
            )}
            <span>Searching Mysuru Municipal Knowledge Base</span>
          </div>

          {/* Stage 3: Grounding Response */}
          <div className={`flex items-center space-x-2 ${stage >= 3 ? 'text-civic-700 font-semibold' : 'text-slate-400'}`}>
            <CircleDashed className="w-3.5 h-3.5 text-civic-600 animate-spin shrink-0" />
            <span>Grounding answer with verified source documents...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
