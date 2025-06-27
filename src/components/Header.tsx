import React, { useState } from 'react';
import { Coffee, Heart, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, onAuthClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', key: 'home' },
    { name: 'Playlists', key: 'playlists' },
    { name: 'Artists', key: 'artists' },
    { name: 'About', key: 'about' }
  ];

  const handleNavClick = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">LoFi Café</h1>
              <p className="text-xs text-white/80 leading-tight">Chill beats & study vibes</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`font-medium transition-colors ${
                  currentPage === item.key
                    ? 'text-white'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('search')}
              className={`p-2 rounded-full transition-colors ${
                currentPage === 'search'
                  ? 'bg-white/30'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Search className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleNavClick('favorites')}
              className={`p-2 rounded-full transition-colors ${
                currentPage === 'favorites'
                  ? 'bg-white/30'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={onAuthClick}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-lg"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === item.key
                      ? 'bg-white/20 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 py-2">
                <button
                  onClick={() => handleNavClick('search')}
                  className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    currentPage === 'search'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button
                  onClick={() => handleNavClick('favorites')}
                  className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    currentPage === 'favorites'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Favorites
                </button>
              </div>
              <div className="px-4 py-2">
                <button 
                  onClick={onAuthClick}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;