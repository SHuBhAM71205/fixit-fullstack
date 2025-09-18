const mongoose = require('mongoose');

// models/Taskmaster.js
const TaskmasterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'GeneralUser' },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskmasterApplication' },
  isActive: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  maintenance_tag: { type: mongoose.Schema.Types.ObjectId, ref: 'TagMaintenance' }
});
module.exports = mongoose.model('Taskmaster', TaskmasterSchema);
