const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

import { MUNICIPAL_SERVICES } from '../data/servicesData';
import { MYSURU_WARDS } from '../data/wardsData';
import { HELPLINES } from '../data/helplinesData';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail = payload?.detail || `Request failed with status ${response.status}`;
    throw new Error(detail);
  }

  return payload;
}

function mapSource(source) {
  return {
    id: source.chunk_id || `${source.source}-${source.page ?? 'document'}-${source.row ?? 'source'}`,
    title: source.source,
    document_id: source.document_id,
    chunk_id: source.chunk_id,
    category: source.category || 'Municipal Document',
    status: 'Indexed',
    summary: 'Indexed source returned by the municipal RAG backend.',
    authority: 'Municipal Public Service Knowledge Base',
    format: 'Indexed document',
    excerpt: [
      source.page != null ? `Page ${source.page}` : null,
      source.row != null ? `Row ${source.row}` : null,
      source.source_url && source.source_url !== 'unknown' ? source.source_url : null,
    ].filter(Boolean).join(' | '),
  };
}

export async function sendChatMessage({ message }) {
  const response = await request('/chat', {
    method: 'POST',
    body: JSON.stringify({ question: message }),
  });

  const sources = (response.sources || []).map(mapSource);

  return {
    answer: response.answer,
    key_info: response.confidence != null
      ? { notes: `Confidence score: ${response.confidence.toFixed(3)}` }
      : null,
    sources,
    category: sources[0]?.category || 'Municipal Information',
    context_used: response.grounded,
    context_topic: sources[0]?.category || null,
    safe_fallback: !response.grounded,
    grounded: response.grounded,
    latency_ms: response.latency_ms,
  };
}

export async function getSources() {
  const response = await request('/sources');
  return (response.sources || []).map((source) => ({
    ...mapSource({
      source: source.name,
      category: source.category,
      source_url: source.source_url,
    }),
    id: source.name,
    summary: `${source.total_chunks} indexed chunk${source.total_chunks === 1 ? '' : 's'} available from this source.`,
    source_url: source.source_url,
    total_chunks: source.total_chunks,
  }));
}

export function getHealth() {
  return request('/health');
}

export function getServices() {
  return Promise.resolve(MUNICIPAL_SERVICES);
}

export function getService(id) {
  return Promise.resolve(MUNICIPAL_SERVICES.find((service) => service.id === id) || null);
}

export function getHelplines() {
  return Promise.resolve(HELPLINES);
}

export function getWards() {
  return Promise.resolve(MYSURU_WARDS);
}
