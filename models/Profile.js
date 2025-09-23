// File: backend/models/Profile.js

const mongoose = require('mongoose');

// This small schema defines the structure for an address
const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
});

const ProfileSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true, // Links to the User's unique phone number
    },
    profileImageUrl: {
        type: String,
        default: '/images/default-avatar.png' 
    },
    addresses: [AddressSchema] // Embeds the AddressSchema as an array
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;