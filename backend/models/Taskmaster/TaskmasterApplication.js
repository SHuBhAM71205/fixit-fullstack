const mongoose = require('mongoose');

// models/TaskmasterApplication.js
const TaskmasterApplicationSchema = new mongoose.Schema({
  Adhaar_no: { type: String, required: true, unique: true, match: /^[0-9]{12}$/ },
  applied_at: { type: Date, default: Date.now },
  reviewed_at: { type: Date },
  status: { type: mongoose.Schema.Types.ObjectId, ref: 'TagStatus' ,default:"683ffa4d2cba5619ab8e0829"},
  maintenance_tag: { type: mongoose.Schema.Types.ObjectId, ref: 'TagMaintenance' },
  
  document_pdf: Buffer
});
module.exports = mongoose.model('TaskmasterApplication', TaskmasterApplicationSchema);
