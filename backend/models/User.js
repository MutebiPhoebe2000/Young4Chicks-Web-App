const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  farmerFName: {
    type: String,
    trim: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },

  farmerFAddress: {
    type: String
  },

  farmerFNumber: {
    type: String,
    trim: true
  },

  farmerFType: {
    type: String
  },

  farmerFNIN: {
    type: String,
    trim: true
  },

  farmerFRecommenderName: {
    type: String,
  },
  farmerFRecommenderNIN: {
    type: String,
    trim: true
  },

  farmerFEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  userFRole: {
    type: String,
    required: true,
    enum: ['Farmer', 'SalesRep', 'BrooderManager', 'Admin']
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active'
  }
}, { timestamps: true });
userSchema.plugin(passportLocalMongoose, {
  usernameField: "farmerFEmail",
});
module.exports = mongoose.model("User", userSchema);
