import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import useBookmarkStore from '../store/bookmarkStore';
import { useAuth } from '@clerk/clerk-react';

const BookmarkCard = ({ bookmark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { deleteBookmark } = useBookmarkStore();
  const { getToken } = useAuth();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      const token = await getToken();
      deleteBookmark(bookmark._id, token);
    }
  };

  const handleEdit = () => {
    // Open edit modal with bookmark data
    const event = new CustomEvent('edit-bookmark', { detail: bookmark });
    window.dispatchEvent(event);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Shopping: 'bg-green-100 text-green-800 border-green-200',
      Learning: 'bg-blue-100 text-blue-800 border-blue-200',
      Work: 'bg-purple-100 text-purple-800 border-purple-200',
      Entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
      Other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const getFaviconUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return 'https://www.google.com/s2/favicons?domain=default.com&sz=64';
    }
  };

  const getHostname = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <motion.div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-navy-100"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-navy-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-5">
        {/* Header with favicon and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <motion.img
              src={bookmark.favicon || getFaviconUrl(bookmark.url)}
              alt=""
              className="w-8 h-8 rounded-lg border border-navy-200"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                e.target.src = 'https://www.google.com/s2/favicons?domain=default.com&sz=64';
              }}
            />
            <div>
              <h3 className="font-semibold text-navy-800 line-clamp-1">{bookmark.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(bookmark.category)}`}>
                {bookmark.category}
              </span>
            </div>
          </div>

          <motion.div
            className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: 20 }}
            animate={{ x: isHovered ? 0 : 20 }}
          >
            <motion.button
              onClick={handleEdit}
              className="p-2 text-navy-600 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiEdit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleDelete}
              className="p-2 text-navy-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className="text-sm text-navy-600 mb-4 line-clamp-2">
            {bookmark.description}
          </p>
        )}

        {/* URL and metadata */}
        <div className="flex items-center justify-between text-xs text-navy-500">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-amber-500 transition-colors"
          >
            <FiExternalLink className="w-3 h-3" />
            <span className="truncate max-w-[150px]">
              {getHostname(bookmark.url)}
            </span>
          </a>
          
          <div className="flex items-center space-x-1">
            <FiCalendar className="w-3 h-3" />
            <span>
              {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookmarkCard;