const requireContentCreator = (req, res, next) => {
  // Check if user is authenticated first
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Check if user has content_creator role
  if (req.user.role !== 'content_creator' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Only content creators can perform this action.' 
    });
  }

  next();
};

module.exports = requireContentCreator;