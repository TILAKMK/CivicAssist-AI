import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Plus, 
  Trash2, 
  Building2, 
  Receipt, 
  Store, 
  PhoneCall, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  PanelRightClose, 
  PanelRightOpen, 
  Menu, 
  X, 
  MapPin, 
  ShieldCheck, 
  Info,
  CornerDownRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { sendChatMessage } from '../services/api';
import AIResponse from '../components/AIResponse';
import RetrievalState from '../components/RetrievalState';
import SourceModal from '../components/SourceModal';

export default function Chat({ selectedWard, onOpenWardModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSourceModal, setActiveSourceModal] = useState(null);
  const [showRightSourcePanel, setShowRightSourcePanel] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const initialPrompts = [
    "When is waste collection information available?",
    "What documents are required for a building license?",
    "How do I pay property tax online?",
    "What documents are required for a trade license?",
    "What is the fire emergency number?"
  ];

  const recentConversations = [
    { title: "Waste collection guidelines", query: "When is waste collection information available?", icon: "🗑" },
    { title: "Building plan sanction", query: "What documents are required for a building license?", icon: "🏗" },
    { title: "Property tax payment", query: "How do I pay property tax online?", icon: "🧾" },
    { title: "Commercial trade license", query: "What documents are required for a trade license?", icon: "🏪" },
    { title: "Emergency & fire helpline", query: "What is the fire emergency number?", icon: "☎" },
  ];

  const categoryChips = [
    { name: "Municipal Services", query: "What municipal services are offered under Sakala by MCC?" },
    { name: "Ward Information", query: "Tell me about Mysuru wards, corporators and zonal offices" },
    { name: "Property & PID", query: "What is PID and how is it used in property records?" },
    { name: "Solid Waste", query: "What is the rule for household waste segregation in Mysuru?" },
    { name: "Commercial Licenses", query: "What is the trade license fee and inspection procedure?" },
    { name: "Emergency Helplines", query: "What are the emergency numbers for police, ambulance and fire?" }
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle URL query parameter on mount or change
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
      setSearchParams({}); // Clear query param
    }
  }, [searchParams]);

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: new Date()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: queryText,
        conversation_id: 'civic-chat-session-1',
        location: {
          city: 'Mysuru',
          ward: selectedWard ? selectedWard.wardNumber : null
        },
        history: newHistory
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        answer: response.answer,
        key_info: response.key_info,
        sources: response.sources,
        category: response.category,
        context_used: response.context_used,
        context_topic: response.context_topic,
        safe_fallback: response.safe_fallback,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          answer: "I couldn't reach the municipal service backend at this moment. Please check your network or try again.",
          safe_fallback: true,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  // Find all active sources from the conversation
  const activeSources = messages
    .filter((m) => m.role === 'assistant' && m.sources && m.sources.length > 0)
    .flatMap((m) => m.sources);

  // Deduplicate sources
  const uniqueSources = Array.from(new Map(activeSources.map((s) => [s.title, s])).values());

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-100">
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-slate-200 flex-col justify-between shrink-0">
        {/* Top Header & New Conversation */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl" role="img" aria-label="Logo">🏛</span>
            <div>
              <h2 className="font-bold text-sm text-navy-900">CivicAssist AI</h2>
              <p className="text-[10px] text-slate-400">Mysuru Municipal Assistant</p>
            </div>
          </div>

          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center space-x-2 px-3.5 py-2 text-xs font-semibold text-civic-800 bg-civic-50 hover:bg-civic-100 border border-civic-200/80 rounded-xl transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4 text-civic-600" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Scrollable Recents & Categories */}
        <div className="px-4 py-2 flex-1 overflow-y-auto space-y-5 text-xs">
          {/* Recent topics */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Sample Inquiries
            </span>
            <div className="space-y-1">
              {recentConversations.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.query)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-navy-900 transition-colors flex items-center space-x-2 group"
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <span className="truncate text-xs font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Knowledge Domains
            </span>
            <div className="space-y-1">
              {categoryChips.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(cat.query)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center justify-between text-xs"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status & Help */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-500">
          <button
            onClick={() => navigate('/help')}
            className="flex items-center space-x-1 hover:text-civic-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>How it Works</span>
          </button>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500">
            RAG v1.0
          </span>
        </div>
      </aside>

      {/* 2. CENTER CHAT STREAM */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Chat Sub-Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Topics Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-xs sm:text-sm text-navy-900">Mysuru Municipal Assistant</span>
            </div>

            {/* Active Ward Badge */}
            <button
              onClick={onOpenWardModal}
              className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-md border border-slate-200 transition-colors"
            >
              <MapPin className="w-3 h-3 text-civic-600" />
              <span>{selectedWard ? `Ward ${selectedWard.wardNumber}` : 'Mysuru City'}</span>
            </button>
          </div>

          {/* Right Panel Toggle (Desktop) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRightSourcePanel(!showRightSourcePanel)}
              className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Toggle Sources Panel"
            >
              <BookOpen className="w-3.5 h-3.5 text-civic-600" />
              <span>Sources ({uniqueSources.length})</span>
              {showRightSourcePanel ? <PanelRightClose className="w-3.5 h-3.5 ml-1 text-slate-400" /> : <PanelRightOpen className="w-3.5 h-3.5 ml-1 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Empty State */}
          {messages.length === 0 && !loading && (
            <div className="max-w-2xl mx-auto my-auto py-8 text-center space-y-6 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-civic-800 to-civic-600 text-white flex items-center justify-center mx-auto shadow-md">
                <span className="text-3xl select-none" role="img" aria-label="Logo">🏛</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-navy-900">
                  How can CivicAssist help you today?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Ask about Mysuru municipal services, procedures, documents, schedules and public information.
                </p>
              </div>

              {/* Suggested Prompts Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto text-left">
                {initialPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-3 bg-white hover:bg-civic-50/70 border border-slate-200/90 hover:border-civic-300 rounded-xl text-xs text-slate-700 font-medium transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span className="leading-snug">{prompt}</span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-civic-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rendered Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className="w-full">
              {msg.role === 'user' ? (
                /* User Message (Right-aligned Civic Blue Bubble) */
                <div className="flex justify-end animate-slide-up">
                  <div className="max-w-xl bg-civic-700 text-white px-4.5 py-3 rounded-2xl rounded-tr-xs shadow-xs text-sm leading-relaxed">
                    <p>{msg.content}</p>
                  </div>
                </div>
              ) : (
                /* AI Response (Left-aligned with rich key info & source) */
                <div className="flex justify-start">
                  <AIResponse
                    message={msg}
                    onViewSource={(source) => setActiveSourceModal(source)}
                    onAskFollowUp={(query) => handleSendMessage(query)}
                  />
                </div>
              )}
            </div>
          ))}

          {/* RAG Retrieval in-progress indicator */}
          {loading && <RetrievalState />}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. CHAT BOTTOM INPUT BAR */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="relative flex items-center bg-slate-50 border border-slate-300 focus-within:border-civic-600 focus-within:ring-3 focus-within:ring-civic-500/15 focus-within:bg-white rounded-2xl transition-all shadow-xs">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask a municipal question (e.g., What documents are required for a building license?)..."
                className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden resize-none max-h-32 min-h-[44px]"
              />

              <div className="flex items-center space-x-1.5 pr-2.5">
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                    input.trim() && !loading
                      ? 'bg-civic-700 hover:bg-civic-800 text-white shadow-xs active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title="Send Message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Input Footer Note */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Mysuru City Corporation</span>
              </div>
              <span className="hidden sm:inline">Press Enter to send • Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. RIGHT CONTEXT / SOURCES PANEL (Desktop Collapsible) */}
      {showRightSourcePanel && (
        <aside className="hidden xl:flex w-72 bg-white border-l border-slate-200 flex-col shrink-0 animate-fade-in">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-civic-700" />
              <h3 className="font-bold text-xs text-navy-900 uppercase tracking-wider">
                Grounding Sources
              </h3>
            </div>
            <button
              onClick={() => setShowRightSourcePanel(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
            {uniqueSources.length === 0 ? (
              <div className="text-center py-10 space-y-2 text-slate-400">
                <ShieldCheck className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">
                  Sources retrieved during your conversation will appear here for verification.
                </p>
              </div>
            ) : (
              uniqueSources.map((source, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-civic-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-civic-700 bg-civic-50 px-1.5 py-0.2 rounded border border-civic-200">
                      {source.category}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified</span>
                  </div>

                  <h4 className="font-semibold text-xs text-navy-900 leading-tight">
                    {source.title}
                  </h4>

                  {source.excerpt && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                      "{source.excerpt}"
                    </p>
                  )}

                  <button
                    onClick={() => setActiveSourceModal(source)}
                    className="w-full text-center py-1 text-[11px] font-medium text-civic-700 hover:text-civic-800 bg-white border border-slate-200 rounded-lg hover:bg-civic-50 transition-colors"
                  >
                    View Source Details
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Grounded in official MCC documentation</span>
            </span>
          </div>
        </aside>
      )}

      {/* 5. MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🏛</span>
                  <span className="font-bold text-sm text-navy-900">CivicAssist AI</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  handleNewConversation();
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-civic-800 bg-civic-50 border border-civic-200 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>New Conversation</span>
              </button>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Topics
                </span>
                {recentConversations.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSendMessage(item.query);
                      setMobileSidebarOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 text-xs flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  navigate('/help');
                }}
                className="hover:underline"
              >
                Help & System Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source Details Modal */}
      <SourceModal
        source={activeSourceModal}
        isOpen={Boolean(activeSourceModal)}
        onClose={() => setActiveSourceModal(null)}
      />
    </div>
  );
}
