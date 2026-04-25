import { useEffect, useState } from 'react';

const ASCII_ART = `
░█████╗░███╗░░██╗██╗░░░██╗██████╗░░█████╗░░██████╗
██╔══██╗████╗░██║██║░░░██║██╔══██╗██╔══██╗██╔════╝
███████║██╔██╗██║██║░░░██║██████╔╝███████║██║░░╗█╗
██╔══██║██║╚████║██║░░░██║██╔══██╗██╔══██║██║░░╚██╗
██║░░██║██║░╚███║╚██████╔╝██║░░██║██║░░██║╚██████╔╝
╚═╝░░╚═╝╚═╝░░╚══╝░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝
`.trim();

export default function HeroTerminal() {
  const [lines, setLines] = useState([]);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const sequence = async () => {
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      const typeLine = async (text, color, delayMs = 30) => {
        let currentText = '';
        setLines(prev => [...prev, { text: '', color }]);
        for (let i = 0; i < text.length; i++) {
          if (!isMounted) return;
          currentText += text[i];
          setLines(prev => {
            const newLines = [...prev];
            newLines[newLines.length - 1].text = currentText;
            return newLines;
          });
          await wait(delayMs);
        }
      };

      const addLine = (text, color) => {
        if (!isMounted) return;
        setLines(prev => [...prev, { text, color }]);
      };

      await wait(500);
      await typeLine('> QUERY: "Who is this person?"', 'text-[#00ff88]');
      await wait(400);
      addLine('> Searching embedding space...', 'text-gray-500');
      await wait(600);
      
      const progressBar = '[████████████████████]';
      let progressText = '> ';
      setLines(prev => [...prev, { text: progressText, color: 'text-white' }]);
      for(let i=0; i<progressBar.length; i++){
        if (!isMounted) return;
        progressText += progressBar[i];
        setLines(prev => {
          const newLines = [...prev];
          newLines[newLines.length - 1].text = progressText;
          return newLines;
        });
        await wait(20);
      }
      if(!isMounted) return;
      setLines(prev => {
        const newLines = [...prev];
        newLines[newLines.length - 1].text = progressText + ' 100% — 4 chunks retrieved';
        return newLines;
      });
      
      await wait(400);
      addLine('', 'text-white');
      
      await wait(200);
      const nameText = '> Name: Anurag Pratap Singh';
      let currentName = '> ';
      setLines(prev => [...prev, { text: currentName, color: 'text-white' }]);
      const words = nameText.split(' ').slice(1);
      for(let word of words) {
        if (!isMounted) return;
        currentName += word + ' ';
        setLines(prev => {
          const newLines = [...prev];
          newLines[newLines.length - 1].text = currentName;
          return newLines;
        });
        await wait(150);
      }
      
      await wait(300);
      addLine('> Role: AI Engineer — RAG pipelines · LLM evals · vector search at scale', 'text-white');
      await wait(300);
      addLine('> Location: Raipur, India · Open to remote opportunities', 'text-white');
      await wait(500);
      addLine('> Query complete. Confidence: 0.97', 'text-[#00ff88]');
      
      await wait(800);
      if (isMounted) {
        setShowButtons(true);
      }
    };
    
    sequence();
    
    return () => { isMounted = false; };
  }, []);

  const scrollToWork = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openAskAnurag = () => {
    const btn = document.getElementById('ask-anurag-trigger');
    if (btn) btn.click();
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden" id="hero">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))',
        backgroundSize: '100% 4px, 6px 100%',
        zIndex: 10
      }}></div>

      {/* Flicker animation wrapper */}
      <div className="w-full max-w-4xl flex flex-col items-center z-20 animate-pulse-flicker">
        
        <pre className="text-[#00ff88] font-mono text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight mb-12 select-none" style={{ textShadow: '0 0 10px #00ff88' }}>
          {ASCII_ART}
        </pre>
        
        <div className="w-full font-mono text-sm sm:text-base mb-8 min-h-[250px]">
          {lines.map((line, idx) => (
            <div key={idx} className={`${line.color} mb-2 break-words`}>
              {line.text}
              {idx === lines.length - 1 && !showButtons && (
                <span className="inline-block w-2 h-4 sm:h-5 bg-white ml-1 animate-pulse"></span>
              )}
            </div>
          ))}
          {showButtons && (
            <div className="text-[#00ff88] mb-2">
              <span className="inline-block w-2 h-4 sm:h-5 bg-[#00ff88] animate-pulse"></span>
            </div>
          )}
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 transition-opacity duration-1000 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={scrollToWork}
            className="px-6 py-3 bg-transparent border border-[#00ff88] text-[#00ff88] font-mono hover:bg-[#00ff88] hover:text-black transition-colors"
          >
            View My Work ↓
          </button>
          <button 
            onClick={openAskAnurag}
            className="px-6 py-3 bg-[#00ff88] text-black font-mono hover:bg-[#00cc66] transition-colors"
          >
            Ask Anurag →
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-flicker {
          0% { opacity: 1; }
          50% { opacity: 0.98; }
          100% { opacity: 1; }
        }
        .animate-pulse-flicker {
          animation: pulse-flicker 4s infinite;
        }
      `}} />
    </div>
  );
}
