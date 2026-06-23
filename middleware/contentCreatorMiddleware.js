const requireContentCreator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'content_creator' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Only content creators can perform this action.' 
    });
  }

  next();
};

module.exports = requireContentCreator;