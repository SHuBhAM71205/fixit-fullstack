const mongoose = require('mongoose');

// models/TagStatus.js
const TagStatusSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 20 }
});
module.exports = mongoose.model('TagStatus', TagStatusSchema);
