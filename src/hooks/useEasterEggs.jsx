import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import portfolioData from '../data/portfolio.json';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function useEasterEggs() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [showHallucinationAlert, setShowHallucinationAlert] = useState(false);
  
  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalRef = useRef(null);
  const terminalInputRef = useRef(null);

  // Key tracking
  const keysRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Except if it's our terminal input
        if (e.target !== terminalInputRef.current) return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keysRef.current.push(key);
      
      // Keep only last 10 keys for Konami
      if (keysRef.current.length > 10) {
        keysRef.current.shift();
      }

      // Check "sudo"
      const last4 = keysRef.current.slice(-4).join('');
      if (last4 === 'sudo' && !showTerminal) {
        setShowTerminal(true);
        keysRef.current = [];
      }

      // Check Konami
      if (keysRef.current.length === 10) {
        let isKonami = true;
        for (let i = 0; i < 10; i++) {
          const expected = KONAMI_CODE[i].length === 1 ? KONAMI_CODE[i].toLowerCase() : KONAMI_CODE[i];
          if (keysRef.current[i] !== expected) {
            isKonami = false;
            break;
          }
        }
        if (isKonami) {
          triggerHallucination();
          keysRef.current = [];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTerminal]);

  // Terminal Entrance Animation
  useEffect(() => {
    if (showTerminal && terminalRef.current) {
      gsap.fromTo(terminalRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 100);
    }
  }, [showTerminal]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    }

    const newHistory = [...terminalHistory, { type: 'command', text: `root@anurag-portfolio:~$ ${cmd}` }];
    
    const response = portfolioData.terminalCommands[cmd];
    if (response) {
      newHistory.push({ type: 'response', text: response });
    } else {
      newHistory.push({ type: 'error', text: `bash: ${cmd}: command not found. Type 'help'.` });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const triggerHallucination = () => {
    document.body.classList.add('hallucinating');
    
    // GSAP text scramble
    const elements = document.querySelectorAll('h1, h2, p');
    const originalTexts = new Map();
    
    elements.forEach(el => {
      if (!el.children.length) { // Only target elements with text, not nested elements
        originalTexts.set(el, el.textContent);
      }
    });

    const chars = '!<>-_\\\\/[]{}—=+*^?#________';
    
    const interval = setInterval(() => {
      elements.forEach(el => {
        if (originalTexts.has(el)) {
          let scramble = '';
          const len = originalTexts.get(el).length;
          for(let i=0; i<len; i++) {
            scramble += chars[Math.floor(Math.random() * chars.length)];
          }
          el.textContent = scramble;
        }
      });
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      elements.forEach(el => {
        if (originalTexts.has(el)) {
          el.textContent = originalTexts.get(el);
        }
      });
      document.body.classList.remove('hallucinating');
      
      setShowHallucinationAlert(true);
      setTimeout(() => {
        setShowHallucinationAlert(false);
      }, 3000);
    }, 1500);
  };

  // The hook returns the components to be rendered in App.js
  const EasterEggComponents = (
    <>
      {/* Hallucination Alert */}
      {showHallucinationAlert && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900 border border-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-[10000] flex flex-col items-center">
          <p className="font-mono text-center font-bold mb-4">⚠ HALLUCINATION DETECTED — This model has been corrected. Even LLMs have bad days.</p>
          <button 
            onClick={() => setShowHallucinationAlert(false)}
            className="px-4 py-2 bg-black text-red-500 font-mono text-sm hover:bg-red-950 transition-colors"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Terminal Modal */}
      {showTerminal && (
        <div 
          className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowTerminal(false)}
        >
          <div 
            ref={terminalRef}
            className="w-full max-w-2xl bg-[#0a0a0a] rounded-lg border border-gray-700 shadow-2xl overflow-hidden flex flex-col h-[400px]"
            onClick={e => e.stopPropagation()}
          >
            {/* Terminal Header */}
            <div className="bg-[#1a1a1a] px-4 py-2 border-b border-gray-700 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setShowTerminal(false)}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-xs font-mono ml-4">root@anurag-portfolio:~</div>
            </div>
            
            {/* Terminal Body */}
            <div 
              className="flex-1 p-4 overflow-y-auto font-mono text-sm text-white bg-black/50"
              onClick={() => terminalInputRef.current?.focus()}
            >
              {terminalHistory.map((line, i) => (
                <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-red-400' : line.type === 'response' ? 'text-gray-300' : 'text-white'}`}>
                  {line.text}
                </div>
              ))}
              
              <form onSubmit={handleTerminalSubmit} className="flex mt-2">
                <span className="text-[#00ff88] mr-2">root@anurag-portfolio:~$</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  onChange={e => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none border-none text-white caret-white"
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return { EasterEggComponents };
}
