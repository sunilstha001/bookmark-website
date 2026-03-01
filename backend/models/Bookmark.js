const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Shopping', 'Learning', 'Work', 'Entertainment', 'Other'],
    default: 'Other'
  },
  favicon: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
bookmarkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate favicon URL from the website URL
bookmarkSchema.pre('save', function(next) {
  if (this.url && !this.favicon) {
    try {
      const urlObj = new URL(this.url);
      this.favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch (error) {
      this.favicon = '';
    }
  }
  next();
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);