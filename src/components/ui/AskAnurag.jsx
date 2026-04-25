import { useState, useRef, useEffect } from 'react';
import { Groq } from 'groq-sdk';
import portfolioData from '../../data/portfolio.json';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const groq = API_KEY ? new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : null;

const SYSTEM_PROMPT = `You are a helpful assistant for Anurag Pratap Singh's portfolio website. Answer questions about Anurag accurately and concisely based only on this information: ${JSON.stringify(portfolioData)}. Keep all answers under 4 sentences. If asked something not covered in the data, say: 'I don't have that info — reach out directly at anurag.ps.contact@gmail.com'. Never make up information.`;

export default function AskAnurag() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! Ask me anything about Anurag's experience, projects, or skills." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !API_KEY) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Keep last 6 messages (which means the userMessage we just added + 5 older ones)
      const recentMessages = messages.slice(-5);
      
      const chatStream = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages,
          userMessage
        ],
        model: 'llama-3.1-8b-instant',
        stream: true,
      });

      let assistantContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      for await (const chunk of chatStream) {
        assistantContent += chunk.choices[0]?.delta?.content || '';
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="ask-anurag-trigger"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-[#00ff88] text-black px-4 py-3 rounded-full font-mono text-sm font-bold shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_rgba(0,255,136,0.5)] hover:-translate-y-1 transition-all flex items-center ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <span className="mr-2">Ask Anurag</span>
        <span className="text-lg">✦</span>
      </button>

      {/* Chat Panel */}
      <div 
        className={`fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[360px] h-[480px] sm:h-[480px] sm:rounded-xl bg-[#0a0a0a] border border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 translate-y-0' : 'scale-0 translate-y-20 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#111] sm:rounded-t-xl">
          <div>
            <h3 className="text-white font-bold font-mono">Ask Anurag <span className="text-[#00ff88]">✦</span></h3>
            <p className="text-gray-500 text-[10px] font-mono mt-1">Powered by Groq · llama-3.1-8b-instant</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!API_KEY && (
            <div className="bg-red-900/20 text-red-400 text-xs p-3 rounded border border-red-900/50">
              Chat unavailable — API key not configured.
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-[#00ff88] text-black font-medium' : 'bg-[#1a1a1a] text-gray-300 border border-gray-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-[#00ff88]">
                <span className="animate-pulse">▋</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 border-t border-gray-800 bg-[#111] sm:rounded-b-xl flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff88]"
            disabled={!API_KEY || isTyping}
          />
          <button 
            type="submit"
            disabled={!API_KEY || isTyping || !input.trim()}
            className="bg-[#00ff88] text-black p-2 rounded-lg disabled:opacity-50 hover:bg-[#00cc66] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </>
  );
}
