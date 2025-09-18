const mongoose = require('mongoose');

// models/LogTaskmasterStatus.js
const LogTaskmasterStatusSchema = new mongoose.Schema({
  taskmaster: { type: mongoose.Schema.Types.ObjectId, ref: 'Taskmaster' },
  status: { type: mongoose.Schema.Types.ObjectId, ref: 'TagStatus' },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String, enum: ['ADMIN', 'SELF'] },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TagRole' }
});
module.exports = mongoose.model('LogTaskmasterStatus', LogTaskmasterStatusSchema);
