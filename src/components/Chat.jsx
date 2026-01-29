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
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex items-center space-x-2 mb-1 ml-1">
                <div className={`w-5 h-5 rounded-full overflow-hidden ${msg.character === 'jamie' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                   <img src={`/assets/${msg.character === 'jamie' ? 'jamie_beaver.png' : 'thomas_goose.png'}`} alt={msg.character} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className={`max-w-[85%] rounded-lg px-4 py-2 text-xs leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#2563eb] text-white' 
                : 'bg-white text-gray-800 border border-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {(isJamieTyping || isThomasTyping) && (
          <div className="flex items-start">
             <div className="bg-white text-gray-400 shadow-sm border border-gray-100 rounded-lg px-4 py-2 text-[10px] font-medium animate-pulse">
                {isJamieTyping ? 'Jamie is thinking...' : 'Thomas is reflecting...'}
             </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            name="message"
            autoComplete="off"
            placeholder="Engage in the conversation here..."
            className="flex-1 p-3 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-400"
          />
          <button type="submit" className="p-3 border border-gray-200 text-gray-400 rounded-lg hover:text-blue-600 transition-all active:scale-95">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
