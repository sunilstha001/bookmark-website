import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiUser, FiPlus, FiLogOut } from 'react-icons/fi';
import { useClerk } from '@clerk/clerk-react';

const Sidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after component mounts
    setIsMounted(true);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const openAddModal = () => {
    const modal = document.getElementById('add-bookmark-modal');
    if (modal) {
      modal.showModal();
      window.dispatchEvent(new Event('add-bookmark-open'));
      onClose();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const currentYear = new Date().getFullYear();

  // Animation variants - only animate on initial mount, not on refresh
  const sidebarVariants = {
    hidden: { x: -100 },
    visible: { 
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 20,
        duration: 0.3 
      }
    }
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-navy-200 flex flex-col transform transition-transform duration-300 md:static md:translate-x-0 md:flex ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        initial={isMounted ? false : "hidden"}
        animate={isMounted ? "visible" : "hidden"}
        variants={sidebarVariants}
      >
        {/* Header */}
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-navy-800">Markly</h2>
          <p className="text-xs md:text-sm text-navy-500 mt-1">Your Bookmark Manager</p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 md:px-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-1 md:mb-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'text-navy-600 hover:bg-navy-100'
                }`
              }
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">{item.label}</span>
            </NavLink>
          ))}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-1 md:mb-2 text-navy-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <FiLogOut className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Sign Out</span>
          </button>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Add Bookmark Button - Commented out as per your code */}
          {/* <div className="p-3 md:p-4 border-t border-navy-200">
            <button
              onClick={openAddModal}
              className="w-full flex items-center justify-center space-x-2 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-lg hover:from-navy-700 hover:to-navy-800 transition-all duration-200 shadow-lg text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Add Bookmark</span>
            </button>
          </div> */}

          {/* Powered By and Copyright inside a small box */}
          <div className="px-4 pb-4">
            <div className="bg-navy-50 border border-navy-200 rounded-lg p-2 text-center">
              <p className="text-xs text-navy-500">
                Powered by <span className="text-amber-500 font-medium">Markly</span>
              </p>
              <p className="text-xs text-navy-400 mt-0.5">
                © {currentYear} All rights reserved
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;