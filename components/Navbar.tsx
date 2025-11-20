import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, X } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onNavigate: (view: 'HOME' | 'SEARCH' | 'MY_LIST' | 'NEW_POPULAR') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSearch = () => {
    if (isSearchActive && !searchValue) {
        setIsSearchActive(false);
    } else {
        setIsSearchActive(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleNavClick = (e: React.MouseEvent, view: 'HOME' | 'SEARCH' | 'MY_LIST' | 'NEW_POPULAR') => {
      e.preventDefault();
      clearSearch();
      setIsSearchActive(false);
      onNavigate(view);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <a href="#" onClick={(e) => handleNavClick(e, 'HOME')} className="text-red-600 font-bold text-2xl md:text-3xl tracking-tighter uppercase">
            AGENTFLIX
          </a>
          
          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 text-sm text-gray-300">
            <a 
                href="#" 
                onClick={(e) => handleNavClick(e, 'HOME')} 
                className={`hover:text-gray-300 transition ${currentView === 'HOME' ? 'text-white font-bold' : 'font-medium'}`}
            >
                Home
            </a>
            <a 
                href="#" 
                onClick={(e) => handleNavClick(e, 'HOME')} // Simplified for demo, could be a separate 'Agents' view
                className="hover:text-gray-300 transition"
            >
                Agents
            </a>
            <a 
                href="#" 
                onClick={(e) => handleNavClick(e, 'NEW_POPULAR')} 
                className={`hover:text-gray-300 transition ${currentView === 'NEW_POPULAR' ? 'text-white font-bold' : 'font-medium'}`}
            >
                New & Popular
            </a>
            <a 
                href="#" 
                onClick={(e) => handleNavClick(e, 'MY_LIST')} 
                className={`hover:text-gray-300 transition ${currentView === 'MY_LIST' ? 'text-white font-bold' : 'font-medium'}`}
            >
                My List
            </a>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6 text-white">
          
          {/* Animated Search Input */}
          <div className={`flex items-center border transition-all duration-300 ${isSearchActive ? 'border-white bg-black/80 px-2 py-1' : 'border-transparent'}`}>
            <Search 
                className="w-5 h-5 cursor-pointer hover:text-gray-300" 
                onClick={toggleSearch}
            />
            <input 
                ref={inputRef}
                type="text"
                placeholder="Titles, people, genres"
                className={`bg-transparent text-white text-sm border-none outline-none transition-all duration-300 placeholder-gray-500 ${isSearchActive ? 'w-32 md:w-60 ml-2' : 'w-0'}`}
                value={searchValue}
                onChange={handleSearchChange}
                onBlur={() => { if (!searchValue) setIsSearchActive(false); }}
            />
            {searchValue && (
                <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white ml-1" onClick={clearSearch} />
            )}
          </div>

          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          <div className="flex items-center space-x-2 cursor-pointer">
             <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <User className="w-5 h-5" />
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;