import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Agent } from '../types';
import AgentCard from './AgentCard';

interface RowProps {
  title: string;
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  myList: string[];
  likedAgents: string[];
  onToggleMyList: (id: string) => void;
  onToggleLike: (id: string) => void;
}

const Row: React.FC<RowProps> = ({ 
  title, 
  agents, 
  onSelectAgent,
  myList,
  likedAgents,
  onToggleMyList,
  onToggleLike
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      
      if (direction === 'left' && scrollTo <= 0) {
          setIsMoved(false);
      }
    }
  };

  return (
    <div className="h-40 md:h-52 space-y-2 mb-8 pl-4 md:pl-12 relative group">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      
      <div className="group relative md:-ml-2">
        <ChevronLeft 
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        />

        <div 
          ref={rowRef}
          className="flex items-center space-x-2 md:space-x-4 overflow-x-scroll scrollbar-hide md:p-2 h-full scroll-smooth"
        >
          {agents.map((agent) => (
            <AgentCard 
                key={agent.id} 
                agent={agent} 
                onSelect={onSelectAgent} 
                isInMyList={myList.includes(agent.id)}
                isLiked={likedAgents.includes(agent.id)}
                onToggleMyList={() => onToggleMyList(agent.id)}
                onToggleLike={() => onToggleLike(agent.id)}
            />
          ))}
        </div>

        <ChevronRight 
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
};

export default Row;