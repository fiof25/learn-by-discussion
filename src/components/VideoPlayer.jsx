import React from 'react';
import { ArrowLeft, Play, SkipBack, SkipForward } from 'lucide-react';

const VideoPlayer = ({ onComplete }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-12 py-8">
        <button className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to student list
        </button>
        <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Watch and discuss the contents of this video</h1>
        <p className="text-gray-400 mt-2 font-medium">Press continue when you are finished watching this lecture</p>
      </div>

      {/* Video Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start px-12 pb-12">
        <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-gray-100">
           {/* Video Title Bar */}
           <div className="bg-[#1e40af] px-8 py-5 text-white">
             <h2 className="text-xl font-bold">The Aztecs: Part 1</h2>
             <p className="text-xs opacity-70 mt-0.5 font-medium">Source: Youtube</p>
           </div>
           
           {/* Video Content Container */}
           <div className="p-8 pb-4">
             {/* YouTube Embed */}
             <div className="aspect-video relative bg-black rounded-xl overflow-hidden border border-gray-100 shadow-sm">
               <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/UO5ktwPXsyM" 
                  title="The Rise and Fall of the Inca Empire"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
               ></iframe>
             </div>

             {/* Controls Bar */}
             <div className="py-8 flex items-center justify-center space-x-12">
                <button className="text-gray-300 hover:text-blue-600 transition-all">
                  <SkipBack className="w-8 h-8" />
                </button>
                <button className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <button className="text-gray-300 hover:text-blue-600 transition-all">
                  <SkipForward className="w-8 h-8" />
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-12 py-8 flex justify-end items-center border-t border-gray-50">
        <button 
          onClick={onComplete}
          className="px-10 py-4 bg-[#16a34a] text-white font-bold rounded-xl hover:bg-[#15803d] transition-all flex items-center shadow-lg shadow-green-100"
        >
          Continue
          <span className="ml-3 text-xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
