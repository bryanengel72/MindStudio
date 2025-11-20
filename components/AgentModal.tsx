import React, { useState, useEffect } from 'react';
import { X, Play, Plus, Check, ThumbsUp } from 'lucide-react';
import { Agent } from '../types';

interface AgentModalProps {
  agent: Agent | null;
  onClose: () => void;
  isInMyList?: boolean;
  isLiked?: boolean;
  onToggleMyList?: () => void;
  onToggleLike?: () => void;
}

const AgentModal: React.FC<AgentModalProps> = ({ 
  agent, 
  onClose,
  isInMyList = false,
  isLiked = false, 
  onToggleMyList,
  onToggleLike
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset error state when agent changes
  useEffect(() => {
    setImageError(false);
  }, [agent]);

  if (!agent) return null;

  const getCategoryGradient = (category: string) => {
    const map: Record<string, string> = {
        'Finance': 'bg-gradient-to-br from-emerald-900 to-black',
        'Marketing': 'bg-gradient-to-br from-blue-900 to-black',
        'Career': 'bg-gradient-to-br from-amber-900 to-black',
        'Business': 'bg-gradient-to-br from-slate-800 to-black',
        'Legal': 'bg-gradient-to-br from-stone-800 to-black',
        'Creative': 'bg-gradient-to-br from-pink-900 to-black',
        'Productivity': 'bg-gradient-to-br from-teal-900 to-black',
        'Content': 'bg-gradient-to-br from-violet-900 to-black',
        'Social Media': 'bg-gradient-to-br from-fuchsia-900 to-black',
        'Development': 'bg-gradient-to-br from-indigo-900 to-black',
        'Lifestyle': 'bg-gradient-to-br from-lime-900 to-black',
        'Research': 'bg-gradient-to-br from-sky-900 to-black',
        'Data': 'bg-gradient-to-br from-gray-800 to-black',
    };
    return map[category] || 'bg-gradient-to-br from-red-900 to-black';
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-[#181818] rounded-lg shadow-2xl overflow-hidden animate-fadeIn" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2a2a2a]"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Hero Banner inside Modal */}
        <div className="relative h-[40vh] md:h-[50vh] bg-[#202020]">
          {imageError ? (
            <div className={`w-full h-full ${getCategoryGradient(agent.category)} flex items-center justify-center`}>
                <h1 className="text-6xl font-black text-white opacity-20">{agent.category.toUpperCase()}</h1>
            </div>
          ) : (
            <img 
                src={agent.imageUrl} 
                alt={agent.title} 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
          
          <div className="absolute bottom-10 left-8 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">{agent.title}</h2>
            <div className="flex items-center space-x-4">
              <a 
                href={agent.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center px-8 py-2 bg-white text-black font-bold rounded hover:bg-white/90 transition"
              >
                <Play className="w-5 h-5 fill-black mr-2" />
                Play on MindStudio
              </a>
              
              {onToggleMyList && (
                  <button 
                    onClick={onToggleMyList}
                    className="w-10 h-10 border-2 border-gray-500 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition"
                    title={isInMyList ? "Remove from My List" : "Add to My List"}
                  >
                    {isInMyList ? <Check className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-gray-300" />}
                  </button>
              )}

              {onToggleLike && (
                  <button 
                    onClick={onToggleLike}
                    className="w-10 h-10 border-2 border-gray-500 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition"
                  >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-white fill-white' : 'text-gray-300'}`} />
                  </button>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:px-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-green-400 font-bold">{agent.match}% Match</span>
              <span className="text-gray-400">{agent.duration}</span>
              <span className="border border-gray-500 px-1 text-xs text-gray-300">{agent.rating}</span>
            </div>
            <p className="text-white text-lg leading-relaxed">
              {agent.description}
            </p>
             <p className="text-gray-400 text-sm pt-4">
               This agent uses advanced logic patterns to solve real-world problems. Click 'Play on MindStudio' to interact with it directly.
             </p>
          </div>
          
          <div className="col-span-1 space-y-4 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">Platform:</span>
              <span className="text-gray-200 font-semibold">MindStudio</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Category:</span>
              <span className="text-gray-200 hover:underline cursor-pointer">{agent.category}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Tags:</span>
              {agent.tags.map((tag, idx) => (
                <span key={tag} className="text-gray-200 hover:underline cursor-pointer inline-block mr-1">
                  {tag}{idx < agent.tags.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentModal;