import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const Chat = ({ messages, onSendMessage, isJamieTyping, isThomasTyping }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isJamieTyping, isThomasTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.message;
    if (input.value.trim()) {
      onSendMessage(input.value);
      input.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-5 border-b border-gray-100 flex items-center space-x-4">
        <div className="flex -space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-orange-100 shadow-sm z-10">
            <img src="/assets/jamie_beaver.png" alt="Jamie" className="w-full h-full object-cover" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-blue-100 shadow-sm">
            <img src="/assets/thomas_goose.png" alt="Thomas" className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-base leading-tight">Thomas & Jamie</h2>
          <div className="flex items-center mt-0.5">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
            <span className="text-xs text-gray-500 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8fafc]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex items-center space-x-2 mb-2 ml-1">
                <div className={`w-5 h-5 rounded-full overflow-hidden ${msg.character === 'jamie' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                   <img src={`/assets/${msg.character === 'jamie' ? 'jamie_beaver.png' : 'thomas_goose.png'}`} alt={msg.character} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{msg.character}</span>
              </div>
            )}
            <div className={`max-w-[90%] rounded-[20px] px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#2563eb] text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {(isJamieTyping || isThomasTyping) && (
          <div className="flex items-start">
             <div className="bg-white text-gray-400 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-[11px] font-medium animate-pulse">
                {isJamieTyping ? 'Jamie is thinking...' : 'Thomas is reflecting...'}
             </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-5 border-t border-gray-100 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <input
            name="message"
            autoComplete="off"
            placeholder="Engage in the conversation here..."
            className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
