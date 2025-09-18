const mongoose = require('mongoose');

// models/UserFeedback.js
const UserFeedbackSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRequest', unique: true },
  star:{type:Number,enum: [1,2,3,4,5], required: true},
  content:{type:String,required:true}
});
module.exports = mongoose.model('UserFeedback', UserFeedbackSchema);
