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

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/:id/view', incrementView);

router.post('/', requireSignIn, createBlog);
router.put('/:id', requireSignIn, updateBlog);
router.delete('/:id', requireSignIn, deleteBlog);

router.post('/:id/like', toggleLike);

module.exports = router;