import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, ThumbsUp, ChevronDown, ImageOff } from 'lucide-react';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  isInMyList?: boolean;
  isLiked?: boolean;
  onToggleMyList?: () => void;
  onToggleLike?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  onSelect, 
  isInMyList = false, 
  isLiked = false, 
  onToggleMyList, 
  onToggleLike 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset error if agent changes (though mostly stable for card)
  useEffect(() => {
    setImageError(false);
  }, [agent.imageUrl]);

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

  // Fallback content when image fails
  const FallbackImage = () => (
    <div className={`w-full h-full ${getCategoryGradient(agent.category)} flex flex-col items-center justify-center p-4 text-center`}>
      <h3 className="text-white font-black text-lg md:text-xl leading-tight tracking-tight drop-shadow-md">
        {agent.title}
      </h3>
      <span className="mt-2 text-white/60 text-[10px] font-bold tracking-widest uppercase border border-white/30 px-2 py-0.5 rounded">
        {agent.category}
      </span>
    </div>
  );

  return (
    <div 
      className="relative h-28 min-w-[180px] md:h-36 md:min-w-[260px] cursor-pointer transition-all duration-300 ease-in-out group z-10 hover:z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(agent)}
    >
      {/* Base Card (Visible by default) */}
      <div className="relative w-full h-full rounded-md overflow-hidden bg-[#202020]">
        {imageError ? (
            <FallbackImage />
        ) : (
            <img
                src={agent.imageUrl}
                alt={agent.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
            />
        )}
        {/* Title Gradient Overlay (Only show if image is loaded, otherwise fallback has title) */}
        {!imageError && (
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent flex items-end p-3">
                <p className="text-white font-bold text-xs md:text-sm leading-snug shadow-black drop-shadow-md line-clamp-2">
                    {agent.title}
                </p>
            </div>
        )}
      </div>

      {/* Hover Overlay (Detailed View - Pops out) */}
      <div 
        className={`
          absolute top-0 left-0 w-full bg-[#181818] rounded-md shadow-xl transition-all duration-300 origin-center
          ${isHovered ? 'opacity-100 scale-125 md:scale-110 -translate-y-6 h-auto min-h-[280px] ring-2 ring-gray-800' : 'opacity-0 h-full pointer-events-none'}
        `}
      >
        <div className="relative h-32 w-full bg-[#202020]">
            {imageError ? (
                <FallbackImage />
            ) : (
                <img 
                    src={agent.imageUrl} 
                    alt={agent.title}
                    className="w-full h-full object-cover rounded-t-md"
                    onError={() => setImageError(true)}
                />
            )}
        </div>
        
        <div className="p-4 space-y-3 bg-[#181818] rounded-b-md">
            {/* Actions Row */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                    <a 
                        href={agent.externalUrl} 
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Play className="w-4 h-4 fill-black text-black" />
                    </a>
                    
                    {onToggleMyList && (
                        <button 
                            className="w-8 h-8 border-2 border-gray-500 rounded-full flex items-center justify-center hover:border-white transition"
                            onClick={(e) => { e.stopPropagation(); onToggleMyList(); }}
                            title={isInMyList ? "Remove from My List" : "Add to My List"}
                        >
                            {isInMyList ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-gray-300" />}
                        </button>
                    )}

                    {onToggleLike && (
                        <button 
                            className="w-8 h-8 border-2 border-gray-500 rounded-full flex items-center justify-center hover:border-white transition"
                            onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
                        >
                            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'text-white fill-white' : 'text-gray-300'}`} />
                        </button>
                    )}
                </div>
                <button className="w-8 h-8 border-2 border-gray-500 rounded-full flex items-center justify-center hover:border-white transition ml-auto">
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                </button>
            </div>

            {/* Metadata */}
            <div>
                <h3 className="text-white font-bold text-sm">{agent.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="text-green-400 text-xs font-bold">{agent.match}% Match</span>
                    <span className="border border-gray-500 text-gray-400 text-[10px] px-1 py-0.5 uppercase">{agent.rating}</span>
                    <span className="text-gray-400 text-xs">{agent.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {agent.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] text-gray-300 flex items-center">
                            <span className="w-1 h-1 bg-gray-500 rounded-full mr-1"></span>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;