const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'GeneralUser', required: true }, // who raised the request
  description: { type: String, required: true },
  tag: { type: mongoose.Schema.Types.ObjectId, ref: 'TagMaintenance', required: true },
  status: { type: mongoose.Schema.Types.ObjectId, ref: 'TagStatus', required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'TagArea', required: true },

  taskmaster: { type: mongoose.Schema.Types.ObjectId, ref: 'Taskmaster', default: null }, // TaskMaster user

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Request', RequestSchema);
