const mongoose = require('mongoose');
const { Schema } = mongoose;

const member = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    profile_picture: String,
    signup_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('member', member);