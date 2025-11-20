import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, ThumbsUp } from 'lucide-react';
import { Agent } from '../types';

interface HeroProps {
  agent: Agent;
  onInfoClick: (agent: Agent) => void;
  isInMyList?: boolean;
  isLiked?: boolean;
  onToggleMyList?: () => void;
  onToggleLike?: () => void;
}

const Hero: React.FC<HeroProps> = ({ 
  agent, 
  onInfoClick, 
  isInMyList = false, 
  isLiked = false, 
  onToggleMyList, 
  onToggleLike 
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
      setImageError(false);
  }, [agent.id]);

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
    <div className="relative h-[56.25vw] md:h-[85vh] w-full object-cover bg-[#141414]">
      {/* Background Image */}
      <div className="absolute inset-0">
        {imageError ? (
           <div className={`w-full h-full ${getCategoryGradient(agent.category)} flex items-center justify-center`}>
                <div className="text-center opacity-50 scale-150 blur-sm select-none">
                    <h1 className="text-9xl font-black text-white">{agent.category}</h1>
                </div>
           </div>
        ) : (
           <img 
            src={agent.imageUrl} 
            alt={agent.title} 
            className="w-full h-full object-cover brightness-[0.6]"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />
      </div>

      {/* Content - Added z-40 to ensure it sits above the overlapping rows container */}
      <div className="absolute top-[30%] md:top-[40%] left-4 md:left-12 max-w-2xl space-y-4 z-40">
        {/* Branding Badge */}
        <div className="flex items-center space-x-3 mb-2">
           <div className="flex items-center">
             <span className="text-[#E50914] font-black tracking-widest text-sm md:text-lg uppercase drop-shadow-md">MINDSTUDIO</span>
           </div>
           <span className="text-gray-300 text-xs md:text-sm tracking-[0.2em] font-medium border-l border-gray-500 pl-3">COLLECTION</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
          {agent.title}
        </h1>
        
        <p className="text-white text-sm md:text-lg font-medium drop-shadow-md line-clamp-3 md:line-clamp-none max-w-lg">
          {agent.description}
        </p>
        
        <div className="flex items-center space-x-3 pt-4">
          <a 
            href={agent.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center px-6 py-2 md:py-3 bg-white text-black rounded hover:bg-white/90 transition font-bold text-sm md:text-xl space-x-2"
          >
            <Play className="w-5 h-5 md:w-7 md:h-7 fill-black" />
            <span>Play on MindStudio</span>
          </a>
          
          <button 
            onClick={() => onInfoClick(agent)}
            className="flex items-center px-6 py-2 md:py-3 bg-gray-500/70 text-white rounded hover:bg-gray-500/50 transition font-bold text-sm md:text-xl space-x-2"
          >
            <Info className="w-5 h-5 md:w-7 md:h-7" />
            <span>More Info</span>
          </button>
            
          {onToggleMyList && (
            <button 
                onClick={onToggleMyList}
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-500/70 text-white rounded-full hover:bg-gray-500/50 transition border-2 border-transparent hover:border-white"
                title={isInMyList ? "Remove from My List" : "Add to My List"}
            >
                {isInMyList ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Plus className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          )}

          {onToggleLike && (
             <button 
                onClick={onToggleLike}
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-500/70 text-white rounded-full hover:bg-gray-500/50 transition border-2 border-transparent hover:border-white"
            >
                <ThumbsUp className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'fill-white text-white' : 'text-white'}`} />
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default Hero;