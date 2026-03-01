import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { FiBookmark, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import useBookmarkStore from '../store/bookmarkStore';

const Header = ({ onToggleSidebar = () => {} }) => {
  const location = useLocation();
  const { user } = useUser();
  const { searchQuery, setSearchQuery } = useBookmarkStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/profile':
        return 'Profile';
      default:
        return 'Bookmark Manager';
    }
  };

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-navy-200 px-6 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-md text-navy-600 hover:bg-navy-100"
            aria-label="Open sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <Link to="/dashboard" className="flex items-center space-x-2">
            <FiBookmark className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl font-semibold text-navy-800">Markly</h1>
          </Link>
          <span className="text-sm text-navy-500">/</span>
          <span className="text-navy-600 font-medium">{getPageTitle()}</span>
        </div>

        {location.pathname === '/dashboard' && (
          <>
            {/* Desktop search */}
            <motion.div 
              className="hidden md:flex flex-1 max-w-md mx-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </motion.div>

            {/* Mobile search button */}
            <div className="md:hidden">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-md text-navy-600 hover:bg-navy-100"
                aria-label="Open search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile search overlay */}
            {searchOpen && (
              <div className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-sm flex items-start p-4 md:hidden" onClick={() => setSearchOpen(false)}>
                <div className="w-full max-w-md bg-white rounded-lg p-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search bookmarks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-navy-600"
                      aria-label="Close search"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-block text-sm text-navy-600">{user?.fullName || user?.username}</span>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-10 h-10 border-2 border-amber-500'
              }
            }}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;