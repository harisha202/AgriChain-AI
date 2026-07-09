import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import client from '../api/client';

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AgriChain AI Assistant. I can help you analyze your crop predictions, inventory, and logistics. How can I help you optimize your supply chain today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await client.post('/api/assistant/ask', {
        messages: [...messages, userMessage]
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the intelligence server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-teal-50/50 relative">
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AgriChain Co-Pilot</h1>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              AI Assistant grounded in your supply chain data
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-primary text-white shadow-md'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-sm text-sm leading-relaxed
                ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white shadow-md flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-6 py-4 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 p-6 z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about inventory levels, demand forecasts, or logistics..."
              className="w-full pl-6 pr-16 py-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm bg-white transition-all text-slate-700"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-slate-400">
            AI can make mistakes. Verify critical supply chain actions before executing.
          </div>
        </div>
      </div>
    </div>
  );
}
