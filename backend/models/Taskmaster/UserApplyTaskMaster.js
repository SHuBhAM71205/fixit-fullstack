const mongoose = require('mongoose');

// models/UserApplyTaskmaster.js
const UserApplyTaskmasterSchema = new mongoose.Schema({
  taskmaster: { type: mongoose.Schema.Types.ObjectId, ref: 'Taskmaster' },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskmasterApplication' },
  verified:{type:Boolean,default:false}
});
module.exports = mongoose.model('UserApplyTaskmaster', UserApplyTaskmasterSchema);
