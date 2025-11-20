import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { sendMessageToGemini, initializeChat } from '../services/geminiService';
import { ChatMessage, ChatStatus } from '../types';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: "Hi! I'm Agent X. Ask me anything about Bryan's portfolio.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSend = async () => {
    if (!input.trim() || status === ChatStatus.THINKING || status === ChatStatus.STREAMING) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStatus(ChatStatus.THINKING);

    try {
      const responseStream = await sendMessageToGemini(userMsg.text);
      
      setStatus(ChatStatus.STREAMING);
      let fullResponse = "";
      const msgId = (Date.now() + 1).toString();
      
      // Add placeholder for streaming message
      setMessages(prev => [...prev, { id: msgId, role: 'model', text: '', timestamp: Date.now() }]);

      for await (const chunk of responseStream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
            m.id === msgId ? { ...m, text: fullResponse } : m
        ));
      }
      
      setStatus(ChatStatus.IDLE);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I'm having trouble connecting to the mainframe. Please try again.", timestamp: Date.now() }]);
      setStatus(ChatStatus.ERROR);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 group"
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6 group-hover:animate-pulse" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-96 h-[500px] bg-[#181818] border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-900 to-black p-4 border-b border-gray-700 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Agent X Assistant</h3>
              <p className="text-xs text-gray-300">Powered by Gemini 2.5</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-red-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {status === ChatStatus.THINKING && (
               <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-400 rounded-lg p-3 text-xs flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  </div>
               </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-black/50 border-t border-gray-700">
            <div className="flex items-center space-x-2 bg-[#2a2a2a] rounded-full px-4 py-2 border border-gray-600 focus-within:border-white transition">
              <input 
                type="text" 
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                placeholder="Ask about agents..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || status === ChatStatus.THINKING}
                className="text-gray-400 hover:text-white disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;