import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBookmarkStore from '../store/bookmarkStore';

const CategoryTabs = () => {
  const { categories, selectedCategory, setSelectedCategory, bookmarks } = useBookmarkStore();
  
  const allCategories = [
    { _id: 'All', count: bookmarks.length },
    ...categories
  ];

  const getCategoryStyle = (category, isSelected) => {
    const styles = {
      All: {
  bg: isSelected ? 'bg-gray-700' : 'bg-navy-50', // Dark gray, much softer than black
  border: isSelected ? 'border-gray-700' : 'border-navy-200',
  text: isSelected ? 'text-white' : 'text-navy-700',
  countBg: isSelected ? 'bg-white/30' : 'bg-navy-200',
  countText: isSelected ? 'text-white' : 'text-navy-700',
  hover: 'hover:bg-navy-100'
},
      Shopping: {
        bg: isSelected ? 'bg-green-500' : 'bg-green-50',
        border: isSelected ? 'border-green-500' : 'border-green-200',
        text: isSelected ? 'text-white' : 'text-green-700',
        countBg: isSelected ? 'bg-white/30' : 'bg-green-200',
        countText: isSelected ? 'text-white' : 'text-green-700',
        hover: 'hover:bg-green-100'
      },
      Learning: {
        bg: isSelected ? 'bg-blue-500' : 'bg-blue-50',
        border: isSelected ? 'border-blue-500' : 'border-blue-200',
        text: isSelected ? 'text-white' : 'text-blue-700',
        countBg: isSelected ? 'bg-white/30' : 'bg-blue-200',
        countText: isSelected ? 'text-white' : 'text-blue-700',
        hover: 'hover:bg-blue-100'
      },
      Work: {
        bg: isSelected ? 'bg-purple-500' : 'bg-purple-50',
        border: isSelected ? 'border-purple-500' : 'border-purple-200',
        text: isSelected ? 'text-white' : 'text-purple-700',
        countBg: isSelected ? 'bg-white/30' : 'bg-purple-200',
        countText: isSelected ? 'text-white' : 'text-purple-700',
        hover: 'hover:bg-purple-100'
      },
      Entertainment: {
        bg: isSelected ? 'bg-pink-500' : 'bg-pink-50',
        border: isSelected ? 'border-pink-500' : 'border-pink-200',
        text: isSelected ? 'text-white' : 'text-pink-700',
        countBg: isSelected ? 'bg-white/30' : 'bg-pink-200',
        countText: isSelected ? 'text-white' : 'text-pink-700',
        hover: 'hover:bg-pink-100'
      },
      Other: {
        bg: isSelected ? 'bg-gray-500' : 'bg-gray-50',
        border: isSelected ? 'border-gray-500' : 'border-gray-200',
        text: isSelected ? 'text-white' : 'text-gray-700',
        countBg: isSelected ? 'bg-white/30' : 'bg-gray-200',
        countText: isSelected ? 'text-white' : 'text-gray-700',
        hover: 'hover:bg-gray-100'
      }
    };
    
    return styles[category] || styles.Other;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <AnimatePresence mode="wait">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category._id;
          const style = getCategoryStyle(category._id, isSelected);
          
          return (
            <motion.button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 overflow-hidden border
                ${style.bg} ${style.border} ${style.text} ${style.hover}
                ${isSelected ? 'shadow-md' : 'shadow-sm hover:shadow'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 ${style.bg}`}
                  layoutId="activeCategory"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center space-x-2">
                <span>{category._id}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${style.countBg} ${style.countText}`}>
                  {category.count || 0}
                </span>
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CategoryTabs;