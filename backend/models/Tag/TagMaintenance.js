const mongoose = require('mongoose');

// models/TagMaintenance.js
const TagMaintenanceSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 50 }
});

module.exports = mongoose.model('TagMaintenance', TagMaintenanceSchema);
