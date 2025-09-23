const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');

// --- Import the database models ---
const User = require('./models/User'); 
const Profile = require('./models/Profile');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Session configuration
app.use(session({
    secret: 'coloShopSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you are using HTTPS
}));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/colo_shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Connection Error:", err));


// --- AUTHENTICATION ROUTES ---

// Register Route
app.post('/register', async (req, res) => {
    try {
        const { name, dob, phone, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).send("User with this email or phone number already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, dob, phone, email, password: hashedPassword });
        const savedUser = await newUser.save();

        const newProfile = new Profile({
            phone: savedUser.phone,
            addresses: []
        });
        await newProfile.save();
        
        res.status(201).send("Registration Successful");

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server error during registration");
    }
});

// Login Route (UPDATED)
app.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        // --- !! KEY CHANGE STARTS HERE !! ---
        // After successful login, fetch the complete profile data to ensure it's up-to-date.
        const profile = await Profile.findOne({ phone: user.phone });
        if (!profile) {
            // This is a failsafe in case a profile wasn't created.
            return res.status(500).send("Server error: Profile data not found for this user.");
        }
        
        // Combine the fresh data from both collections
        const fullProfileData = {
            id: user._id,
            name: user.name, // This name is the most up-to-date
            email: user.email, // This email is the most up-to-date
            phone: user.phone,
            dob: user.dob,
            profileImageUrl: profile.profileImageUrl,
            addresses: profile.addresses
        };

        // Store user ID in the server session
        req.session.userId = user._id;

        // Return the complete, fresh profile data to the frontend
        res.status(200).json({ 
            message: "Login Successful",
            user: fullProfileData // Send the combined object
        });
        // --- !! KEY CHANGE ENDS HERE !! ---

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server error during login");
    }
});


// --- PROFILE MANAGEMENT ROUTES ---

// Get User Profile Data
app.get('/profile/:phone', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("Unauthorized: Please log in.");
    }
    
    try {
        const phone = req.params.phone;
        const profile = await Profile.findOne({ phone: phone });
        const user = await User.findOne({ phone: phone }).select('-password');

        if (!profile || !user) {
            return res.status(404).send("Profile or User not found.");
        }

        const profileData = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            dob: user.dob,
            profileImageUrl: profile.profileImageUrl,
            addresses: profile.addresses
        };
        res.status(200).json(profileData);

    } catch (error) {
        res.status(500).send("Server error while fetching profile data.");
    }
});

// Update User Profile Data
app.post('/profile/update/:phone', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("Unauthorized: Please log in.");
    }

    try {
        const phone = req.params.phone;
        const { name, email, addresses, profileImageUrl } = req.body;

        // Update the User collection with potentially edited name and email
        await User.updateOne({ phone: phone }, { $set: { name, email } });

        // Update the Profile collection with addresses and image URL
        const profileUpdateData = { addresses };
        if (profileImageUrl) {
            profileUpdateData.profileImageUrl = profileImageUrl;
        }
        await Profile.updateOne({ phone: phone }, { $set: profileUpdateData });

        res.status(200).send("Profile updated successfully!");

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Server error while updating profile.");
    }
});


// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));