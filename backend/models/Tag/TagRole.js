const mongoose = require('mongoose');

// models/TagRole.js
const TagRoleSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 10 }
});
module.exports = mongoose.model('TagRole', TagRoleSchema);
