var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: { type: String },
    fb_id: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', userSchema);;