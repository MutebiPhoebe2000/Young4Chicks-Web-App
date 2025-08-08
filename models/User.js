const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },

  nin: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  location: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  }
});
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});
module.exports = mongoose.model("User", userSchema);