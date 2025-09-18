const mongoose = require('mongoose');

// models/TagArea.js
const TagAreaSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 20 }
});
module.exports = mongoose.model('TagArea', TagAreaSchema);
