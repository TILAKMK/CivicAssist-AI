import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Store, 
  FileCheck, 
  RefreshCw, 
  Layers, 
  FileText, 
  Droplets, 
  Pipette, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { getService } from '../services/api';
import SourceModal from '../components/SourceModal';

const iconMap = {
  Building2,
  Store,
  FileCheck,
  RefreshCw,
  Layers,
  FileText,
  Droplets,
  Pipette
};

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);

  useEffect(() => {
    getService(id).then(setService);
  }, [id]);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin text-civic-600 mb-2">●</div>
        <p className="text-slate-500 text-sm">Loading service requirements...</p>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Building2;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/services"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all municipal services</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-civic-50 border border-civic-100 text-civic-700 flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-civic-700 bg-civic-50 px-2 py-0.5 rounded border border-civic-200">
                  {service.category}
                </span>
                {service.sakalaApplicable && (
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Sakala Guaranteed
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                {service.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/chat?q=${encodeURIComponent(`What is the complete checklist and procedure for ${service.title}?`)}`)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-civic-700 hover:bg-civic-800 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask CivicAssist</span>
            </button>
          </div>
        </div>

        {/* Overview banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Department</span>
            <span className="font-semibold text-slate-800">{service.department}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Statutory Sakala Timeline</span>
            <span className="font-semibold text-teal-700">{service.timeLimitDays} Working Days ({service.sakalaGSCNo})</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Jurisdiction</span>
            <span className="font-semibold text-slate-800">Mysuru City Corporation (MCC)</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Required Documents Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-civic-700" />
          <h2 className="text-base font-bold text-navy-900">
            Mandatory Prerequisite Documents & Checklist
          </h2>
        </div>

        <div className="space-y-2">
          {service.requiredDocuments.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3 bg-slate-50/70 border border-slate-100 rounded-xl text-xs text-slate-800"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Application Procedure Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-civic-700" />
          <h2 className="text-base font-bold text-navy-900">
            Official Application & Sanction Procedure
          </h2>
        </div>

        <div className="space-y-3">
          {service.procedure.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl text-xs text-slate-800"
            >
              <span className="w-5 h-5 rounded-full bg-civic-100 text-civic-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fees & Source Attribution Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Applicable Fees & Charges</h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {service.fees}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <BookOpen className="w-4 h-4 text-civic-600" />
            <span>Source: <strong className="text-slate-800">{service.sourceTitle}</strong></span>
          </div>

          <button
            onClick={() => setSourceModalOpen(true)}
            className="text-xs font-semibold text-civic-700 hover:text-civic-800 underline decoration-civic-300"
          >
            View Source Details →
          </button>
        </div>
      </div>

      {/* Data Safety Notice */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start space-x-3 text-xs text-slate-500">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Public Procedural Information Notice:</strong> This portal provides procedural guidance and checklists under MCC regulations. Private property titles and individual tax ledgers are not disclosed publicly through this conversational assistant.
        </p>
      </div>

      {/* Source Modal */}
      <SourceModal
        source={{
          title: service.sourceTitle,
          category: service.sourceCategory,
          excerpt: `Official procedure document for ${service.title} under ${service.department}.`
        }}
        isOpen={sourceModalOpen}
        onClose={() => setSourceModalOpen(false)}
      />
    </div>
  );
}
