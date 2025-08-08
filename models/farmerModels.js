const mongoose = require('mongoose');
const farmerSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  farmerNIN: {
    type: String,
    required: true,
    unique: true,
  },
  farmerAddress: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true,
  },
  recommenderName: {
    type: String,
    required: true,
    default: null,
  },
  recommenderNIN: {
    type: String,
    required: true,
    unique: true,
    default: null
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    unique: true,
  }
});
module.exports = mongoose.model('Farmer', farmerSchema);