const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  altContact: {
    type: String
  },
  locality: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  spaceType: {
    type: String,
    required: true,
    enum: ['Flat', 'House', 'PG', 'Warehouse', 'Office', 'Shop']
  },
  petsAllowed: {
    type: String,
    default: 'No'
  },
  preference: {
    type: String
  },
  bachelors: {
    type: String
  },
  furnishingType: {
    type: String
  },
  bhk: {
    type: String
  },
  floor: {
    type: String
  },
  landmark: {
    type: String
  },
  washroomType: {
    type: String
  },
  cooling: {
    type: String
  },
  parking: {
    type: String,
    default: 'No'
  },
  rent: {
    type: Number,
    required: true
  },
  maintenance: {
    type: Number
  },
  area: {
    type: Number
  },
  appliances: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  about: {
    type: String
  },
  photos: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  // Changed to lowercase to match the model registration
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema);