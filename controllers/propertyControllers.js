const Property = require('../model/propertyModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/properties';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    property.views = (property.views || 0) + 1;
    await property.save();
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    console.log('Auth user:', req.user); 
    const propertyData = { ...req.body };
    
    propertyData.userId = req.user.userId || req.user._id || req.user.id;
    
    if (typeof propertyData.appliances === 'string') {
      propertyData.appliances = propertyData.appliances.split(',').filter(item => item.trim());
    }
    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities.split(',').filter(item => item.trim());
    }
    
    if (req.files && req.files.length > 0) {
      propertyData.photos = req.files.map(file => `/uploads/properties/${file.filename}`);
    }
    
    if (!propertyData.userId) {
      console.log('No userId found. req.user:', req.user);
      return res.status(400).json({ message: 'User ID is required. Please ensure you are logged in.' });
    }
    
    console.log('Creating property with data:', propertyData);
    
    const property = new Property(propertyData);
    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    
    const propertyData = { ...req.body };
    
    if (typeof propertyData.appliances === 'string') {
      propertyData.appliances = propertyData.appliances.split(',').filter(item => item.trim());
    }
    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities.split(',').filter(item => item.trim());
    }
    
    let photos = [];
    if (req.body.existingPhotos) {
      photos = Array.isArray(req.body.existingPhotos) ? req.body.existingPhotos : [req.body.existingPhotos];
    }
    
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => `/uploads/properties/${file.filename}`);
      photos = [...photos, ...newPhotos];
    }
    
    propertyData.photos = photos;
    
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      propertyData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    
    if (property.photos && property.photos.length > 0) {
      property.photos.forEach(photo => {
        const filePath = path.join(__dirname, '..', photo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPhotos = upload.array('photos', 10); 