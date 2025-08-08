const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementView,
  toggleLike
} = require('../controllers/blogControllers');
const requireSignIn = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/:id/view', incrementView);

// Protected routes - require authentication only
router.post('/', requireSignIn, createBlog);
router.put('/:id', requireSignIn, updateBlog);
router.delete('/:id', requireSignIn, deleteBlog);

// Like route (optional authentication)
router.post('/:id/like', toggleLike);

module.exports = router;