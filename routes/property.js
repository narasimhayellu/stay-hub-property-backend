const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyControllers');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (require authentication)
// GET user's properties - This must come before /:id to avoid route conflicts
router.get('/user/properties', authMiddleware, propertyController.getUserProperties);

// Public routes
// GET all properties (no auth required for browsing)
router.get('/', propertyController.getAllProperties);

// GET single property (no auth required for viewing)
router.get('/:id', propertyController.getProperty);

// POST create new property (requires auth)
router.post('/', authMiddleware, propertyController.uploadPhotos, propertyController.createProperty);

// PUT update property (requires auth and ownership)
router.put('/:id', authMiddleware, propertyController.uploadPhotos, propertyController.updateProperty);

// DELETE property (requires auth and ownership)
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;