const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');

// Get all bookmarks for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookmark by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    res.json(bookmark);
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new bookmark
router.post('/',
  authMiddleware,
  [
    body('title').notEmpty().trim().escape(),
    body('url').isURL().withMessage('Please provide a valid URL'),
    body('description').optional().trim().escape(),
    body('category').isIn(['Shopping', 'Learning', 'Work', 'Entertainment', 'Other'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const bookmark = new Bookmark({
        ...req.body,
        userId: req.userId
      });
      
      await bookmark.save();
      res.status(201).json(bookmark);
    } catch (error) {
      console.error('Error creating bookmark:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a bookmark
router.put('/:id',
  authMiddleware,
  [
    body('title').optional().notEmpty().trim().escape(),
    body('url').optional().isURL().withMessage('Please provide a valid URL'),
    body('description').optional().trim().escape(),
    body('category').optional().isIn(['Shopping', 'Learning', 'Work', 'Entertainment', 'Other'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const bookmark = await Bookmark.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!bookmark) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }

      res.json(bookmark);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a bookmark
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories with counts
router.get('/categories/counts', authMiddleware, async (req, res) => {
  try {
    const categories = await Bookmark.aggregate([
      { $match: { userId: req.userId } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;