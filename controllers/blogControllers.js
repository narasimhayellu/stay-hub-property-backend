const Blog = require('../model/blogModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/blogs');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads/blogs directory');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
}).single('coverImage');

const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const sortBy = req.query.sortBy || 'latest';
    const skip = (page - 1) * limit;

    let sortQuery = {};
    if (sortBy === 'latest') {
      sortQuery = { createdAt: -1 };
    } else if (sortBy === 'trending') {
      sortQuery = { views: -1, likes: -1 };
    }

    const totalBlogs = await Blog.countDocuments({ status: 'published' });
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'firstName lastName')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages,
      totalBlogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'firstName lastName email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

const createBlog = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, content, tags } = req.body;
      
      const author = req.user._id || req.user.id || req.user.userId;
      
      console.log('User from auth middleware:', req.user); 
      console.log('Creating blog with author:', author); 

      if (!author) {
        return res.status(400).json({ message: 'User authentication failed. Please login again.' });
      }

      const blogData = {
        title,
        content,
        author,
        tags: typeof tags === 'string' ? JSON.parse(tags || '[]') : (tags || [])
      };

      if (req.file) {
        blogData.coverImage = `/uploads/blogs/${req.file.filename}`;
      }

      const blog = new Blog(blogData);
      await blog.save();

      const populatedBlog = await Blog.findById(blog._id)
        .populate('author', 'firstName lastName');

      res.status(201).json(populatedBlog);
    } catch (error) {
      console.error('Error creating blog:', error); 
      res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
  });
};

const updateBlog = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const blog = await Blog.findById(req.params.id);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      const userId = req.user._id || req.user.id || req.user.userId;
      if (blog.author.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this blog' });
      }

      if (req.body.title) blog.title = req.body.title;
      if (req.body.content) blog.content = req.body.content;
      if (req.body.tags) {
        blog.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags || '[]') : (req.body.tags || []);
      }
      
      if (req.file) {
        blog.coverImage = `/uploads/blogs/${req.file.filename}`;
      }

      await blog.save();
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
  });
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const userId = req.user._id || req.user.id || req.user.userId;
    if (blog.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

const incrementView = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ views: blog.views });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing view', error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?._id; 

    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    let liked = false;
    if (userId) {
      const likeIndex = blog.likedBy.indexOf(userId);
      
      if (likeIndex > -1) {
        blog.likedBy.splice(likeIndex, 1);
        blog.likes = Math.max(0, blog.likes - 1);
      } else {
        blog.likedBy.push(userId);
        blog.likes += 1;
        liked = true;
      }
    } else {
      blog.likes += 1;
      liked = true;
    }

    await blog.save();
    res.status(200).json({ likes: blog.likes, liked });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementView,
  toggleLike
};