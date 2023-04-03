const mongoose = require('mongoose');
const { Schema } = mongoose;

const members = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone_number: { type: String, unique: true },
    profile_picture: String,
    signup_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('members', members);