import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import AddBookmarkModal from './AddBookmarkModal';
import { FiPlus } from 'react-icons/fi';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const openAddModal = () => {
    window.dispatchEvent(new Event('add-bookmark-open'));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onClose={closeMobile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setMobileOpen((v) => !v)} />
        <motion.main 
          className="flex-1 overflow-y-auto p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
      
      {/* Floating Add button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={openAddModal}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Add Bookmark"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

      <AddBookmarkModal />
    </div>
  );
};

export default Layout;