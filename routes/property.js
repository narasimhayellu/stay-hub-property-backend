const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/properties', authMiddleware, propertyController.getUserProperties);

router.get('/', propertyController.getAllProperties);

router.get('/:id', propertyController.getProperty);

router.post('/', authMiddleware, propertyController.uploadPhotos, propertyController.createProperty);

router.put('/:id', authMiddleware, propertyController.uploadPhotos, propertyController.updateProperty);

router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;