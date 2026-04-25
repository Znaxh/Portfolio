import { useState, useRef, useEffect } from 'react';

const RESUME_CHUNKS = [
  "Anurag interned at Lejit.AI (Dec 2025–Mar 2026) as AI Engineer. Built data pipelines for 3 government legal portals. Reduced manual data ingestion by 80%. Built WhatsApp Business API bot. Saved 3200 INR/month by switching to direct Meta Cloud API. Integrated FastAPI microservices with LangChain. 948,900+ legal documents. Resolved frontend bugs reducing render time by 60% (5s to 2s).",
  "JusticeGuide project: AI Legal Research Assistant. FastAPI, LangChain, LlamaIndex, FAISS, Ragas, Gemini. Enabled non-lawyers to query Indian Penal Code in plain language. Cited answers in under 2 seconds. RAG pipeline: LLM query enhancement, LlamaIndex CitationQueryEngine, 189 IPC chunks, FAISS IndexFlatIP 384-dim, Groq fallback chain, Arize Phoenix OTLP tracing.",
  "LogLens project: AI Log Analysis. FastAPI, React, DBSCAN, Sentence-Transformers, LangChain, Prometheus. Converts raw server logs to P1-P4 incident reports. Z-score anomaly detection across error-rate latency silence signals. DBSCAN semantic clustering. 7-rule root-cause inference across 5 log formats. LangChain LCEL report generation.",
  "AI Resume Screening System: Flask, Next.js, BERT, XGBoost, SpaCy, Sentence-Transformers, Redis. Improved recruiter matching accuracy from 72% to 85%. 9-algorithm parallel ensemble: BERT, DistilBERT, SBERT, TF-IDF, NER, XGBoost, RF, SVM, MLP. Weighted rank aggregation. LangChain + Groq structured JD expansion. Redis result cache TTL 1800s.",
  "Technical skills: Python, JavaScript, TypeScript, C/C++, SQL. AI/ML: LangChain, LlamaIndex, FAISS, Ragas, Arize Phoenix, Sentence-Transformers, HuggingFace, Scikit-learn, XGBoost, BERT, DistilBERT, SpaCy, NLTK, OpenCV, DBSCAN. Tools: FastAPI, Node.js, Express, REST APIs, WebSockets, Docker, Prometheus, React, Next.js, Tailwind CSS, PostgreSQL, MongoDB, Redis, Git.",
  "Education: B.Tech Data Science and Artificial Intelligence at IIIT Raipur, CGPA 7.25/10, Aug 2022 to May 2026. IEEE ACROSET 2024 co-author: 93% accuracy facial recognition using CNNs. Amazon ML Summer School: top 0.17% of 60,000+ applicants. Hack-a-Sol 2024: 2nd Runner-Up among 100+ participants for LLM-powered AI vulnerability scanner.",
];

const NO_MATCH = "I couldn't find that specific info. Try asking about his projects, skills, experience, or education.";
const MAX_MESSAGES = 8;

function searchChunks(query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return null;

  const scored = RESUME_CHUNKS.map((chunk) => {
    const lower = chunk.toLowerCase();
    let score = 0;
    for (const word of words) {
      // Count occurrences
      const regex = new RegExp(word, 'gi');
      const matches = lower.match(regex);
      if (matches) score += matches.length;
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter(s => s.score > 0).slice(0, 2);
  if (top.length === 0) return null;
  return top.map(t => t.chunk).join('\n\n');
}

export default function ResumeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I can answer questions about Anurag's resume. Try asking about his projects, skills, or experience." },
  ]);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSearching]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSearching) return;
    if (messages.length >= MAX_MESSAGES) return;

    const newMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      const result = searchChunks(trimmed);
      const answer = result
        ? `Based on Anurag's resume:\n\n${result}`
        : NO_MATCH;
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
      setIsSearching(false);
    }, 600);
  };

  // Collapsed state on mobile
  if (isMobile && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-[#0a0a0a] border border-gray-700 rounded-full px-4 py-2 text-[#00f5ff] font-mono text-xs hover:bg-[#111] transition-colors"
      >
        🤖 Ask My Resume
      </button>
    );
  }

  return (
    <div
      className={`${
        isMobile
          ? 'fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4'
          : 'sticky top-24 w-80 ml-auto'
      }`}
    >
      <div
        className={`flex flex-col bg-[#0a0a0a] border border-gray-700 rounded-xl overflow-hidden shadow-2xl ${
          isMobile ? 'w-full max-w-sm max-h-[80vh]' : 'max-h-[500px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm">🤖</span>
            <span className="text-xs font-mono text-[#00f5ff] font-bold">Ask My Resume</span>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white text-sm"
            >
              ×
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ minHeight: 200, maxHeight: 350 }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                msg.role === 'bot'
                  ? 'text-gray-300 bg-[#111] rounded-lg p-3 border border-gray-800'
                  : 'text-[#00f5ff] text-right'
              }`}
            >
              {msg.text}
            </div>
          ))}

          {isSearching && (
            <div className="text-xs font-mono text-gray-500 bg-[#111] rounded-lg p-3 border border-gray-800 flex gap-1 items-center">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
              <span className="ml-2 text-gray-600">Searching resume...</span>
            </div>
          )}

          {messages.length >= MAX_MESSAGES && (
            <div className="text-xs text-gray-500 font-mono text-center py-2">
              Max messages reached. Visit the About section or email directly.
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={messages.length >= MAX_MESSAGES ? 'Max reached' : 'Ask about Anurag...'}
            disabled={messages.length >= MAX_MESSAGES || isSearching}
            className="flex-1 bg-[#111] text-white text-xs font-mono outline-none px-3 py-2 rounded-lg border border-gray-800 placeholder-gray-600 disabled:opacity-40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSearching || messages.length >= MAX_MESSAGES}
            className="text-[#00f5ff] text-xs font-mono px-3 py-2 bg-[#111] rounded-lg border border-gray-800 hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
