import React, { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';

const QuestionSection = ({ onBack }) => {
  const [answer, setAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(null); // 'correct' or 'incorrect'

  const checkAnswer = () => {
    if (answer.toLowerCase().includes('pachacuti')) {
      setShowFeedback('correct');
    } else {
      setShowFeedback('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative">
      {/* Header */}
      <div className="p-10 pb-6">
        <div className="flex items-center justify-between mb-8">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Question 1 of 3</span>
            <div className="w-80 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#22c55e] rounded-full"></div>
            </div>
        </div>
        <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Discuss this discussion prompt with us</h1>
        <p className="text-gray-400 mt-2 font-medium">Highlight and annotate the text and make suggestions to the text.</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-10 pb-10 overflow-y-auto">
        <div className="max-w-[800px] bg-white rounded-[32px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-gray-100">
           <div className="h-64 w-full overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=1000" 
              alt="Machu Picchu" 
              className="w-full h-full object-cover"
             />
           </div>
           <div className="p-10">
             <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">Who was ruling when the famous Machu Picchu estate was constructed?</h2>
             <p className="text-gray-600 text-[17px] leading-relaxed mb-8">
               Machu Picchu is a 15th-century Inca royal estate and religious retreat located 2,430 meters (7,970 feet) above sea level on a mountain ridge in Peru. Built around 1450 for Emperor ________, the site features advanced dry-stone masonry, agricultural terraces, and temples, functioning as a ceremonial center, and, astronomical observatory before its abandonment during the Spanish conquest.
             </p>

             <div className="relative">
               <input 
                 value={answer}
                 onChange={(e) => setAnswer(e.target.value)}
                 placeholder="Enter Your answer here when your complete"
                 className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white outline-none transition-all text-gray-700 font-medium placeholder:text-gray-400 shadow-sm"
               />
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-10 border-t border-gray-100 bg-white flex justify-between items-center">
        <button 
          onClick={onBack}
          className="px-8 py-4 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Previous page
        </button>
        <button 
          onClick={checkAnswer}
          className="px-10 py-4 bg-[#22c55e]/20 text-[#15803d] font-bold rounded-xl hover:bg-[#22c55e]/30 transition-all flex items-center"
        >
          Check answer
          <span className="ml-3 text-xl">→</span>
        </button>
      </div>

      {/* Feedback Overlay */}
      {showFeedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[40px] p-10 max-w-xl w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] transform transition-all animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <h2 className={`text-3xl font-black mb-4 leading-tight ${showFeedback === 'correct' ? 'text-gray-900' : 'text-gray-900'}`}>
                {showFeedback === 'correct' ? 'Congrats you’ve answered this question correctly!' : 'Incorrect'}
              </h2>
              <p className="text-gray-500 font-medium mb-10 text-lg">Click continue to move on the next question</p>
              
              <div className="w-full space-y-6 mb-10">
                <div className="text-left">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Your answer:</label>
                  <div className={`p-6 rounded-3xl border-2 flex items-center justify-between font-bold text-lg ${
                    showFeedback === 'correct' 
                      ? 'bg-green-50 border-green-500/50 text-green-700' 
                      : 'bg-red-50 border-red-500/50 text-red-700'
                  }`}>
                    <span>{answer}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showFeedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {showFeedback === 'correct' ? <Check className="w-5 h-5 stroke-[3px]" /> : <X className="w-5 h-5 stroke-[3px]" />}
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Correct answer(s)</label>
                  <div className="p-6 rounded-3xl border-2 border-green-500/50 bg-green-50 text-green-700 flex items-center justify-between font-bold text-lg">
                    <span>Pachacuti</span>
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Check className="w-5 h-5 stroke-[3px]" />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowFeedback(null)}
                className="w-full py-5 bg-[#16a34a] text-white font-black text-xl rounded-[24px] hover:bg-[#15803d] transition-all flex items-center justify-center shadow-xl shadow-green-200/50 hover:-translate-y-1 active:scale-[0.98]"
              >
                Continue
                <span className="ml-4 text-2xl">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
