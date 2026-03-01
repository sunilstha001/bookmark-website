import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react'; // Change this import
import useBookmarkStore from '../store/bookmarkStore';
import BookmarkCard from '../components/BookmarkCard';
import CategoryTabs from '../components/CategoryTabs';
import { FiBookmark } from 'react-icons/fi';

const Dashboard = () => {
  const { filteredBookmarks, isLoading, fetchBookmarks } = useBookmarkStore();
  const { getToken, isSignedIn } = useAuth(); // Use useAuth instead of useUser

  useEffect(() => {
    const loadBookmarks = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            fetchBookmarks(token);
          }
        } catch (error) {
          console.error('Error loading bookmarks:', error);
        }
      }
    };
    
    loadBookmarks();
  }, [isSignedIn, getToken, fetchBookmarks]); // Add proper dependencies

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-800 mb-2">Your Bookmarks</h1>
        <CategoryTabs />
      </div>

      {filteredBookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <FiBookmark className="w-16 h-16 text-navy-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-navy-700 mb-2">No bookmarks found</h3>
          <p className="text-navy-500">
            Click the "Add Bookmark" button to create your first bookmark
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBookmarks.map((bookmark) => (
            <motion.div key={bookmark._id} variants={item}>
              <BookmarkCard bookmark={bookmark} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;