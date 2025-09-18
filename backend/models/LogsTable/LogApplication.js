const mongoose = require('mongoose');

// models/LogApplication.js
const LogApplicationSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskmasterApplication' },
  remark: String,
  action: { type: mongoose.Schema.Types.ObjectId, ref: 'TagStatus' },
  created_at: { type: Date, default: Date.now },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TagRole' }
});
module.exports = mongoose.model('LogApplication', LogApplicationSchema);

