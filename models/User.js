// File: backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true, // Crucial for linking
        index: true   // Speeds up searches by phone number
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;