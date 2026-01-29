import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import VideoPlayer from './components/VideoPlayer';
import QuestionSection from './components/QuestionSection';

function App() {
  const [activeStep, setActiveStep] = useState('video'); // 'video' or 'question'
  const [messages, setMessages] = useState([]);
  const [isJamieTyping, setIsJamieTyping] = useState(false);
  const [isThomasTyping, setIsThomasTyping] = useState(false);

  // Initial greeting - Triggered when moving to the question step
  useEffect(() => {
    if (activeStep === 'question' && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          character: 'jamie',
          content: "That was such a cool video! Any ideas who the emperor was? I'm blanking on the name!",
          timestamp: new Date()
        },
        {
          role: 'assistant',
          character: 'thomas',
          content: "The date 1450 is definitely a major clue. What do you remember about the ruler from that period, user?",
          timestamp: new Date()
        }
      ]);
    }
  }, [activeStep, messages.length]);

  const handleSendMessage = async (text) => {
    if (isJamieTyping || isThomasTyping) return; // Prevent double-triggering

    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    
    // Trigger AI responses outside of the state updater
    getAIResponses(newMessages);
  };

  const getAIResponses = async (history) => {
    // Format messages for API
    const formatMessages = (msgs) => msgs.map(m => ({
      role: m.role,
      content: m.role === 'assistant' ? `[${m.character.toUpperCase()}]: ${m.content}` : m.content
    }));

    // Jamie responds first
    setIsJamieTyping(true);
    try {
      const jamieResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: formatMessages(history), 
          character: 'jamie',
          context: "Jamie, respond to the user's last message. You can also briefly react to Thomas if he said something relevant."
        })
      }).then(res => res.json());

      let currentHistory = history;

      if (jamieResponse.message) {
        const jamieMsg = {
          role: 'assistant',
          character: 'jamie',
          content: jamieResponse.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, jamieMsg]);
        currentHistory = [...history, jamieMsg];
      }

      setIsJamieTyping(false);
      setIsThomasTyping(true);
      
      const thomasResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: formatMessages(currentHistory), 
          character: 'thomas',
          context: "Thomas, respond to the user and Jamie. Maintain your rigorous peer student persona."
        })
      }).then(res => res.json());

      if (thomasResponse.message) {
        const thomasMsg = {
          role: 'assistant',
          character: 'thomas',
          content: thomasResponse.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, thomasMsg]);
      }
    } catch (error) {
      console.error('Error getting AI responses:', error);
    } finally {
      setIsJamieTyping(false);
      setIsThomasTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden">
      {/* Sidebar - Fix to left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat - Only show when on 'question' step */}
        {activeStep === 'question' && (
          <div className="w-80 border-r border-gray-200 bg-white flex flex-col flex-shrink-0 animate-in slide-in-from-left duration-300">
            <Chat 
              messages={messages} 
              onSendMessage={handleSendMessage}
              isJamieTyping={isJamieTyping}
              isThomasTyping={isThomasTyping}
            />
          </div>
        )}

        {/* Main Workspace - Video or Question */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
          {activeStep === 'video' ? (
            <VideoPlayer onComplete={() => setActiveStep('question')} />
          ) : (
            <QuestionSection onBack={() => setActiveStep('video')} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
