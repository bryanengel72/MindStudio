import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import AgentModal from './components/AgentModal';
import GeminiChat from './components/GeminiChat';
import AgentCard from './components/AgentCard';
import { AGENTS, CATEGORIES } from './constants';
import { Agent } from './types';

type ViewState = 'HOME' | 'SEARCH' | 'MY_LIST' | 'NEW_POPULAR';

const App: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [featuredAgent, setFeaturedAgent] = useState<Agent>(AGENTS[0]);
  
  // Interaction State with LocalStorage persistence
  const [myList, setMyList] = useState<string[]>(() => {
    const saved = localStorage.getItem('agentflix_mylist');
    return saved ? JSON.parse(saved) : [];
  });

  const [likedAgents, setLikedAgents] = useState<string[]>(() => {
    const saved = localStorage.getItem('agentflix_liked');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & Search State
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // --- Effects ---

  // Persist state
  useEffect(() => {
    localStorage.setItem('agentflix_mylist', JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    localStorage.setItem('agentflix_liked', JSON.stringify(likedAgents));
  }, [likedAgents]);

  // Randomize featured agent on mount
  useEffect(() => {
    const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    setFeaturedAgent(randomAgent);
  }, []);

  // Switch to Search view if query exists
  useEffect(() => {
    if (searchQuery || selectedCategoryFilter !== 'All') {
      setCurrentView('SEARCH');
    } else if (currentView === 'SEARCH' && !searchQuery && selectedCategoryFilter === 'All') {
      setCurrentView('HOME');
    }
  }, [searchQuery, selectedCategoryFilter]);

  // --- Handlers ---

  const toggleMyList = (agentId: string) => {
    setMyList(prev => 
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  const toggleLike = (agentId: string) => {
    setLikedAgents(prev => 
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleCloseModal = () => {
    setSelectedAgent(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNavigate = (view: ViewState) => {
    // Reset search when navigating via menu
    if (view !== 'SEARCH') {
        setSearchQuery('');
        setSelectedCategoryFilter('All');
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Data Derivation ---

  const filterCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set(AGENTS.map(a => a.category)));
    return ['All', ...uniqueCats];
  }, []);

  const filteredAgents = useMemo(() => {
    // SEARCH VIEW LOGIC
    if (currentView === 'SEARCH') {
        return AGENTS.filter(agent => {
        const matchesSearch = 
            agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategoryFilter === 'All' || agent.category === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
        });
    }
    
    // MY LIST VIEW LOGIC
    if (currentView === 'MY_LIST') {
        return AGENTS.filter(agent => myList.includes(agent.id));
    }

    // NEW & POPULAR LOGIC (Simulated by High Match % or Recent)
    if (currentView === 'NEW_POPULAR') {
        return AGENTS.filter(agent => agent.match >= 95 || agent.duration === 'New');
    }

    return [];
  }, [searchQuery, selectedCategoryFilter, currentView, myList]);

  // Helper to render a grid of agents
  const renderGrid = (agents: Agent[], title: string, emptyMessage: string) => (
    <div className="pt-24 px-4 md:px-12 min-h-screen animate-fadeIn">
        <h2 className="text-2xl text-gray-200 font-bold mb-6">{title}</h2>
        
        {/* Filter Bar (Only for Search) */}
        {currentView === 'SEARCH' && (
            <div className="flex flex-wrap gap-2 mb-8">
                {filterCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-4 py-1 rounded-full text-sm border transition-all ${
                            selectedCategoryFilter === cat 
                            ? 'bg-white text-black border-white font-bold' 
                            : 'bg-black/40 text-gray-300 border-gray-600 hover:border-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        )}

        {agents.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                {agents.map(agent => (
                    <div key={agent.id} className="transform hover:scale-105 transition-transform duration-300">
                        <AgentCard 
                            agent={agent} 
                            onSelect={handleSelectAgent}
                            isInMyList={myList.includes(agent.id)}
                            isLiked={likedAgents.includes(agent.id)}
                            onToggleMyList={() => toggleMyList(agent.id)}
                            onToggleLike={() => toggleLike(agent.id)}
                        />
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-xl">{emptyMessage}</p>
                {currentView === 'SEARCH' && (
                    <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategoryFilter('All'); }}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Clear Filters
                    </button>
                )}
                {currentView === 'MY_LIST' && (
                     <button 
                        onClick={() => handleNavigate('HOME')}
                        className="mt-4 px-6 py-2 border border-gray-500 text-white rounded hover:bg-gray-800 transition"
                    >
                        Browse Agents
                    </button>
                )}
            </div>
        )}
    </div>
  );

  return (
    <div className="bg-[#141414] min-h-screen pb-20 overflow-x-hidden">
      <Navbar 
        onSearch={handleSearch} 
        onNavigate={handleNavigate}
        currentView={currentView}
      />
      
      {/* Main Content Routing */}
      {currentView === 'SEARCH' && renderGrid(filteredAgents, searchQuery ? `Results for "${searchQuery}"` : "Browse Agents", "No agents found matching your criteria.")}
      
      {currentView === 'MY_LIST' && renderGrid(filteredAgents, "My List", "You haven't added any agents to your list yet.")}

      {currentView === 'NEW_POPULAR' && renderGrid(filteredAgents, "New & Popular", "Check back later for new arrivals.")}

      {currentView === 'HOME' && (
        <>
          <Hero 
            agent={featuredAgent} 
            onInfoClick={handleSelectAgent}
            isInMyList={myList.includes(featuredAgent.id)}
            isLiked={likedAgents.includes(featuredAgent.id)}
            onToggleMyList={() => toggleMyList(featuredAgent.id)}
            onToggleLike={() => toggleLike(featuredAgent.id)}
          />

          {/* Adjusted top margin from -32 to -20 to resolve button overlap issues */}
          <div className="relative z-20 -mt-10 md:-mt-20 space-y-6 md:space-y-12">
            {CATEGORIES.map((category) => {
              const rowAgents = AGENTS.filter(a => 
                category === "Trending Now" ? a.match > 90 :
                category === "New Releases" ? true : 
                a.category === category
              );

              if (rowAgents.length === 0 && category !== "Trending Now") return null;
              const displayAgents = rowAgents.length > 0 ? rowAgents : AGENTS;

              return (
                <Row 
                  key={category} 
                  title={category} 
                  agents={displayAgents} 
                  onSelectAgent={handleSelectAgent}
                  myList={myList}
                  likedAgents={likedAgents}
                  onToggleMyList={toggleMyList}
                  onToggleLike={toggleLike}
                />
              );
            })}
          </div>
        </>
      )}

      <AgentModal 
        agent={selectedAgent} 
        onClose={handleCloseModal}
        isInMyList={selectedAgent ? myList.includes(selectedAgent.id) : false}
        isLiked={selectedAgent ? likedAgents.includes(selectedAgent.id) : false}
        onToggleMyList={() => selectedAgent && toggleMyList(selectedAgent.id)}
        onToggleLike={() => selectedAgent && toggleLike(selectedAgent.id)}
      />
      
      <GeminiChat />

      <footer className="mt-20 py-8 px-12 text-gray-500 text-sm text-center">
         <p className="mb-4">All agents powered by MindStudio. Built with React, Tailwind, and Gemini API.</p>
         <p>&copy; 2025 AgentFlix Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;