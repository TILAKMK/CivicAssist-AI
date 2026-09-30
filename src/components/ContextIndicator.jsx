import React from 'react';
import { CornerDownRight, Sparkles } from 'lucide-react';

export default function ContextIndicator({ topic }) {
  if (!topic) return null;

  return (
    <div className="flex items-center space-x-2 py-1 px-3 mb-2 bg-civic-50/90 border border-civic-200/80 rounded-full text-xs font-medium text-civic-800 w-fit animate-fade-in shadow-2xs">
      <CornerDownRight className="w-3.5 h-3.5 text-civic-600 shrink-0" />
      <span>Continuing context from:</span>
      <span className="font-semibold text-civic-900 underline decoration-civic-300 underline-offset-2">
        {topic}
      </span>
    </div>
  );
}
