import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useUser, useAuth } from '@clerk/clerk-react';
import useBookmarkStore from '../store/bookmarkStore';
import toast from 'react-hot-toast';

const AddBookmarkModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth(); // Fix: use useAuth instead of useUser for getToken

  const { addBookmark, updateBookmark } = useBookmarkStore();

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'Other'
  });

  const categories = ['Shopping', 'Learning', 'Work', 'Entertainment', 'Other'];

  useEffect(() => {
    const handleEditBookmark = (e) => {
      const bookmark = e.detail;
      console.log('Editing bookmark:', bookmark);
      setEditingBookmark(bookmark);
      setFormData({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || '',
        category: bookmark.category
      });
      openModal();
    };

    const handleAddBookmark = () => {
      console.log('Adding new bookmark');
      setEditingBookmark(null);
      setFormData({
        title: '',
        url: '',
        description: '',
        category: 'Other'
      });
      openModal();
    };

    window.addEventListener('edit-bookmark', handleEditBookmark);
    window.addEventListener('add-bookmark-open', handleAddBookmark);

    return () => {
      window.removeEventListener('edit-bookmark', handleEditBookmark);
      window.removeEventListener('add-bookmark-open', handleAddBookmark);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
    setEditingBookmark(null);
    setFormData({
      title: '',
      url: '',
      description: '',
      category: 'Other'
    });
    setIsSubmitting(false);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      toast.error('You must be signed in to save bookmarks');
      return;
    }

    // Validate URL
    if (!validateUrl(formData.url)) {
      toast.error('Please enter a valid URL (include https://)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Fix: await the getToken() function
      const token = await getToken();
      console.log('Got token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        toast.error('Authentication failed. Please try signing in again.');
        return;
      }

      if (editingBookmark) {
        console.log('Updating bookmark with ID:', editingBookmark._id);
        await updateBookmark(editingBookmark._id, formData, token);
      } else {
        console.log('Creating new bookmark');
        await addBookmark(formData, token);
      }
      
      closeModal();
      toast.success(editingBookmark ? 'Bookmark updated successfully!' : 'Bookmark added successfully!');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(error.response?.data?.message || 'Failed to save bookmark. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-navy-200">
          <h2 className="text-xl font-semibold text-navy-800">
            {editingBookmark ? 'Edit Bookmark' : 'New Bookmark'}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="p-2 text-navy-500 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="My favorite site"
              className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 disabled:bg-navy-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 disabled:bg-navy-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              disabled={isSubmitting}
              placeholder="A short note about this bookmark"
              className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none disabled:bg-navy-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white disabled:bg-navy-50 disabled:cursor-not-allowed"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                editingBookmark ? 'Update Bookmark' : 'Save Bookmark'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBookmarkModal;