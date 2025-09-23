# BIGCART
BigCart E-Commerce Platform
Welcome to the BigCart E-Commerce Platform, a modern, fully-featured online shopping website. This project combines a clean, responsive frontend built with HTML, CSS, and JavaScript with a powerful backend powered by Node.js, Express, and MongoDB.

✨ Features
User Authentication: Secure user registration and login functionality using email/phone and password. Passwords are encrypted using bcrypt.js.

Persistent Sessions: Keeps users logged in using an Express session-based system.

Dynamic User Profiles: Users can view and update their profile information (name, email, addresses). All changes are saved directly to the database.

Product Catalog: A clean, grid-based layout to display products, which can be easily expanded.

Dynamic Shopping Cart: A fully interactive shopping cart that uses localStorage to persist between sessions. Users can:

Add products to the cart from the product page.

Increase or decrease the quantity of items.

Remove items from the cart.

View a real-time updated order summary.

Responsive Design: The entire website is fully responsive and works seamlessly on desktops, tablets, and mobile devices.

🛠️ Technology Stack
Frontend
HTML5

CSS3 (with custom styling for components)

JavaScript (ES6+): For client-side interactivity, form handling, and API communication.

Bootstrap 4: For the responsive grid system and base styling.

jQuery: Used by some of the template's plugins.

Backend
Node.js: JavaScript runtime environment for the server.

Express.js: A fast and minimalist web framework for building the API.

MongoDB: A NoSQL database used to store user and profile data.

Mongoose: An Object Data Modeler (ODM) library for MongoDB and Node.js.

CORS: For enabling cross-origin requests between the frontend and backend.

bcrypt.js: For hashing user passwords securely.

