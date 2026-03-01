import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  filteredBookmarks: [],
  categories: [],
  selectedCategory: 'All',
  searchQuery: '',
  isLoading: false,
  error: null,

  fetchBookmarks: async (token) => {
    if (!token) {
      console.error('No token provided');
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching bookmarks with token');
      const response = await api.get('/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Bookmarks fetched:', response.data.length);
      set({ 
        bookmarks: response.data, 
        filteredBookmarks: response.data, 
        isLoading: false 
      });
      get().fetchCategories(token);
    } catch (error) {
      console.error('Error fetching bookmarks:', error.response || error);
      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to fetch bookmarks');
    }
  },

  fetchCategories: async (token) => {
    if (!token) return;
    
    try {
      const response = await api.get('/bookmarks/categories/counts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ categories: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error.response || error);
    }
  },

  addBookmark: async (bookmarkData, token) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      console.log('Adding bookmark:', bookmarkData);
      const response = await api.post('/bookmarks', bookmarkData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Bookmark added:', response.data);
      
      const updatedBookmarks = [response.data, ...get().bookmarks];
      set((state) => ({
        bookmarks: updatedBookmarks,
        filteredBookmarks: get().applyFilters(updatedBookmarks),
        isLoading: false
      }));
      
      toast.success('Bookmark added successfully!');
      get().fetchCategories(token);
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error.response || error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please sign in again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add bookmark');
      }
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateBookmark: async (id, bookmarkData, token) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/bookmarks/${id}`, bookmarkData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const updatedBookmarks = get().bookmarks.map(b => 
        b._id === id ? response.data : b
      );
      
      set((state) => ({
        bookmarks: updatedBookmarks,
        filteredBookmarks: get().applyFilters(updatedBookmarks),
        isLoading: false
      }));
      
      toast.success('Bookmark updated successfully!');
      get().fetchCategories(token);
    } catch (error) {
      console.error('Error updating bookmark:', error.response || error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please sign in again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update bookmark');
      }
    }
  },

  deleteBookmark: async (id, token) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedBookmarks = get().bookmarks.filter(b => b._id !== id);
      
      set((state) => ({
        bookmarks: updatedBookmarks,
        filteredBookmarks: get().applyFilters(updatedBookmarks),
        isLoading: false
      }));
      
      toast.success('Bookmark deleted successfully!');
      get().fetchCategories(token);
    } catch (error) {
      console.error('Error deleting bookmark:', error.response || error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please sign in again.');
      } else {
        toast.error('Failed to delete bookmark');
      }
    }
  },

  applyFilters: (bookmarks) => {
    const { selectedCategory, searchQuery } = get();
    let filtered = [...bookmarks];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    set((state) => ({
      filteredBookmarks: state.applyFilters(state.bookmarks)
    }));
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    set((state) => ({
      filteredBookmarks: state.applyFilters(state.bookmarks)
    }));
  },

  clearFilters: () => {
    set({
      selectedCategory: 'All',
      searchQuery: '',
      filteredBookmarks: get().bookmarks
    });
  }
}));

export default useBookmarkStore;