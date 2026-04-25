import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const SUDO_SEQUENCE = 'sudo hire me';

const HIRE_LINES = [
  '$ sudo hire me',
  '[sudo] password for recruiter: ••••••••',
  'Checking credentials...',
  'Permission granted. ✓',
  'Executing: contact_anurag --urgent',
  'Opening: anurag.ps.contact@gmail.com',
  'Done. Good choice. 🚀',
];

const TOKEN_WORDS = [
  'FAISS', 'BERT', 'RAG', 'LLM', 'ATEN', 'GRAD', 'LCEL', 'LORA', 'RLHF', 'PEFT',
  'VLLM', 'SBERT', 'CLIP', 'GPT4', 'LSTM', 'CNN', 'ADAM', 'RELU', 'LOSS', 'EPOCH',
];

export default function useEasterEggs() {
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireLines, setHireLines] = useState([]);
  const [tokenRainActive, setTokenRainActive] = useState(false);

  const bufferRef = useRef('');
  const konamiRef = useRef([]);
  const inactivityTimerRef = useRef(null);
  const tokenCanvasRef = useRef(null);
  const tokenRafRef = useRef(null);

  // Clear buffer after 3 seconds of inactivity
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      bufferRef.current = '';
      konamiRef.current = [];
    }, 3000);
  }, []);

  // Token rain effect
  const startTokenRain = useCallback(() => {
    setTokenRainActive(true);
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:10000;pointer-events:auto;';
    document.body.appendChild(canvas);
    tokenCanvasRef.current = canvas;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Initialize columns
    const numCols = 15;
    const colWidth = w / numCols;
    const columns = Array.from({ length: numCols }, (_, i) => {
      const tokens = [];
      const numTokens = Math.floor(h / 24) + 5;
      let y = -Math.random() * h;
      for (let j = 0; j < numTokens; j++) {
        tokens.push({
          word: TOKEN_WORDS[Math.floor(Math.random() * TOKEN_WORDS.length)],
          y,
        });
        y -= 24;
      }
      return {
        x: i * colWidth + colWidth / 2,
        speed: 1 + Math.random() * 2,
        tokens,
      };
    });

    const startTime = performance.now();

    const render = (time) => {
      const elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      // Fade out starting at 4.5s
      let globalAlpha = 1;
      if (elapsed > 4.5) {
        globalAlpha = Math.max(0, 1 - (elapsed - 4.5) / 1.5);
      }
      if (globalAlpha <= 0 || elapsed > 6) {
        cleanup();
        return;
      }

      ctx.globalAlpha = globalAlpha;
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';

      for (const col of columns) {
        for (let ti = 0; ti < col.tokens.length; ti++) {
          const token = col.tokens[ti];
          token.y += col.speed;
          if (token.y > h + 30) token.y = -30;

          // Leading token is bright white
          if (ti === 0) {
            ctx.fillStyle = '#ffffff';
          } else {
            ctx.fillStyle = 'rgba(0, 245, 255, 0.8)';
          }
          ctx.fillText(token.word, col.x, token.y);
        }
      }

      tokenRafRef.current = requestAnimationFrame(render);
    };

    const cleanup = () => {
      cancelAnimationFrame(tokenRafRef.current);
      if (tokenCanvasRef.current && tokenCanvasRef.current.parentNode) {
        tokenCanvasRef.current.parentNode.removeChild(tokenCanvasRef.current);
      }
      tokenCanvasRef.current = null;
      setTokenRainActive(false);
    };

    // Click to cancel
    canvas.addEventListener('click', cleanup, { once: true });

    tokenRafRef.current = requestAnimationFrame(render);

    // Auto cleanup after 6.5s
    setTimeout(cleanup, 6500);
  }, []);

  // Hire modal animation
  const triggerHireModal = useCallback(() => {
    setShowHireModal(true);
    setHireLines([]);

    let i = 0;
    const addLine = () => {
      if (i < HIRE_LINES.length) {
        setHireLines(prev => [...prev, HIRE_LINES[i]]);
        i++;
        setTimeout(addLine, 80);
      } else {
        // Fire confetti after last line
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f5ff', '#7c3aed', '#f59e0b', '#10b981', '#00ff88'],
          });
        }, 300);

        // Scroll to contact after a bit
        setTimeout(() => {
          const contact = document.getElementById('contact');
          if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
      }
    };
    setTimeout(addLine, 300);
  }, []);

  // Key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't fire when typing in inputs
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

      resetInactivityTimer();

      // Track character keys for "sudo hire me"
      if (e.key.length === 1) {
        bufferRef.current += e.key.toLowerCase();
        if (bufferRef.current.length > 12) {
          bufferRef.current = bufferRef.current.slice(-12);
        }
        if (bufferRef.current.endsWith(SUDO_SEQUENCE)) {
          bufferRef.current = '';
          triggerHireModal();
        }
      }

      // Track special keys for Konami
      konamiRef.current.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (konamiRef.current.length > 10) {
        konamiRef.current = konamiRef.current.slice(-10);
      }
      if (konamiRef.current.length === 10) {
        let isKonami = true;
        for (let i = 0; i < 10; i++) {
          const expected = KONAMI_CODE[i].length === 1 ? KONAMI_CODE[i].toLowerCase() : KONAMI_CODE[i];
          if (konamiRef.current[i] !== expected) {
            isKonami = false;
            break;
          }
        }
        if (isKonami) {
          konamiRef.current = [];
          startTokenRain();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer, triggerHireModal, startTokenRain]);

  const EasterEggComponents = (
    <AnimatePresence>
      {showHireModal && (
        <motion.div
          key="hire-modal"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-[10000] flex items-end justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Hire me terminal"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowHireModal(false)}
          />
          {/* Terminal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-full max-w-lg mb-8 rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
            style={{ backgroundColor: '#0a0a0a' }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-500 text-xs font-mono">recruit@terminal</span>
              <button
                onClick={() => setShowHireModal(false)}
                className="text-gray-500 hover:text-white text-lg leading-none"
                aria-label="Close terminal"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="p-6 font-mono text-sm min-h-[200px]" style={{ color: '#00ff41' }}>
              {hireLines.map((line, i) => (
                <div key={i} className="mb-1">{line}</div>
              ))}
              <span className="inline-block w-2 h-4 bg-[#00ff41] animate-pulse ml-1" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Escape key handler for hire modal
  useEffect(() => {
    if (!showHireModal) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowHireModal(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showHireModal]);

  return { EasterEggComponents };
}
