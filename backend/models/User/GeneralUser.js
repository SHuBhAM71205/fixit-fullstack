
const mongoose = require('mongoose');

// models/GeneralUser.js
const GeneralUserSchema = new mongoose.Schema({
  fname: { type: String, required: true, maxlength: 50 },
  lname: { type: String, required: true, maxlength: 50 },
  gender: { type: String, enum: ['Male', 'male','f','m'], required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'TagArea' },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'TagRole' },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  password: { type: String, required: true },
  contact: { type: String, match: /^[0-9]{10}$/ },
  created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('GeneralUser', GeneralUserSchema);
