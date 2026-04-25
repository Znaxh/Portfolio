import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_BASE = [
  {
    keywords: ['experience', 'work', 'intern', 'job', 'lejit'],
    answer: 'Anurag interned at Lejit.AI as an AI Engineer (Dec 2025 – Mar 2026), building RAG pipelines over 948,900+ legal documents and saving ₹3,200/month by replacing AiSensy with direct Meta Cloud API integration.',
  },
  {
    keywords: ['project', 'build', 'made', 'created'],
    answer: 'His top projects: JusticeGuide (RAG over Indian Penal Code, <2s response), LogLens (AI log analysis to P1-P4 incident reports), and an AI Resume Screening System (72% → 85% accuracy with a 9-algorithm ensemble).',
  },
  {
    keywords: ['skill', 'tech', 'stack', 'language', 'python', 'langchain'],
    answer: "Core stack: Python, FastAPI, LangChain, LlamaIndex, FAISS, Ragas — he's built production RAG systems. Also: React, Next.js, TypeScript, Docker, PostgreSQL, Redis.",
  },
  {
    keywords: ['award', 'achievement', 'ieee', 'amazon', 'hackathon'],
    answer: 'IEEE ACROSET 2024 co-author (93% facial recognition accuracy). Top 0.17% of 60,000+ applicants at Amazon ML Summer School. 2nd Runner-Up at Hack-a-Sol 2024 for an LLM-powered AI vulnerability scanner.',
  },
  {
    keywords: ['contact', 'email', 'hire', 'reach'],
    answer: "Reach him at anurag.ps.contact@gmail.com or linkedin.com/in/pratapsinghanurag. He's currently open to full-time roles and interesting internships in AI/ML.",
  },
  {
    keywords: ['education', 'college', 'university', 'iiit', 'degree'],
    answer: "B.Tech in Data Science & AI at IIIT Raipur (Aug 2022 – May 2026), CGPA 7.25/10. Selected for Amazon ML Summer School, which accepts top 0.17% of applicants — the real measure of talent here.",
  },
];

const DEFAULT_ANSWER = "I'm a simple bot — try asking about Anurag's experience, projects, skills, or how to contact him.";
const GREETING = "Hey. I've been waiting. Ask me anything about Anurag.";
const MAX_MESSAGES = 6;
const IDLE_TIMEOUT = 30000;

function findAnswer(message) {
  const lower = message.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return DEFAULT_ANSWER;
}

export default function IdleChatbot() {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const idleTimerRef = useRef(null);
  const chatRef = useRef(null);
  const hasAppearedRef = useRef(false);
  const messageCountRef = useRef(0);
  const isReducedMotion = useRef(false);

  // Type text character by character
  const typeText = useCallback((text, onComplete) => {
    setIsTyping(true);
    setTypingText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypingText((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.(text);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // Reset idle timer on activity
  const resetIdleTimer = useCallback(() => {
    if (isVisible) {
      setIsVisible(false);
    }
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      // Only show if we haven't exceeded message count
      if (messageCountRef.current < MAX_MESSAGES) {
        setIsVisible(true);
        if (!hasAppearedRef.current) {
          hasAppearedRef.current = true;
          // Type the greeting
          setMessages([]);
          setTypingText('');
        }
      }
    }, IDLE_TIMEOUT);
  }, [isVisible]);

  useEffect(() => {
    // Check mobile and reduced motion
    if (window.innerWidth < 768) return;
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleActivity = (e) => {
      // Don't reset if clicking inside chatbot
      if (chatRef.current && chatRef.current.contains(e.target)) return;
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Start idle timer
    idleTimerRef.current = setTimeout(() => {
      setIsVisible(true);
      hasAppearedRef.current = true;
    }, IDLE_TIMEOUT);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Type greeting when chatbot first appears
  useEffect(() => {
    if (isVisible && messages.length === 0 && !isTyping) {
      const cleanup = typeText(GREETING, (text) => {
        setMessages([{ role: 'bot', text }]);
        setTypingText('');
      });
      return cleanup;
    }
  }, [isVisible, messages.length, isTyping, typeText]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      const scrollArea = chatRef.current.querySelector('.chat-scroll');
      if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages, typingText]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    messageCountRef.current++;
    const newMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');

    if (messageCountRef.current >= MAX_MESSAGES) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: 'Want to know more? Visit the About section or email directly.' },
        ]);
      }, 600);
      return;
    }

    const answer = findAnswer(trimmed);
    // Type bot response with delay
    setTimeout(() => {
      typeText(answer, (text) => {
        setMessages((prev) => [...prev, { role: 'bot', text }]);
        setTypingText('');
      });
    }, 600);
  };

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  const motionProps = isReducedMotion.current
    ? {}
    : {
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 300, opacity: 0 },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={chatRef}
          {...motionProps}
          className="fixed bottom-4 right-4 z-[9998] flex flex-col"
          style={{ width: 280, maxHeight: 350 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#0a0a0a] border border-gray-700 rounded-t-xl px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f5ff]">ANURAG.AI v1.0</span>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-white text-sm"
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className="chat-scroll bg-[#111] border-x border-gray-700 flex-1 overflow-y-auto p-3 space-y-3"
            style={{ maxHeight: 240, minHeight: 120 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-xs font-mono leading-relaxed ${
                  msg.role === 'bot' ? 'text-[#00f5ff]' : 'text-gray-300 text-right'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && typingText && (
              <div className="text-xs font-mono text-[#00f5ff] leading-relaxed">
                {typingText}
                <span className="inline-block w-1.5 h-3 bg-[#00f5ff] animate-pulse ml-0.5" />
              </div>
            )}
            {isTyping && !typingText && (
              <div className="text-xs font-mono text-gray-500 flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="bg-[#0a0a0a] border border-gray-700 rounded-b-xl p-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..."
              className="flex-1 bg-transparent text-white text-xs font-mono outline-none placeholder-gray-600 px-2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="text-[#00f5ff] text-xs font-mono px-2 py-1 hover:bg-[#00f5ff]/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
