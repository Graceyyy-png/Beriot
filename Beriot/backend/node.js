// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model defined
const { body, validationResult } = require('express-validator');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Checkout Route
app.post('/api/checkout', async (req, res) => {
  const { items, customerInfo } = req.body;
  
  // Process payment and create order
  try {
    // Integrate payment gateway
    const order = await createOrder(items, customerInfo);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model defined
const { body, validationResult } = require('express-validator');

// Signup Route
router.post('/signup', [
    body('email').isEmail().withMessage('Invalid email format').custom(value => {
        const validDomains = ['com', 'org', 'net', 'edu', 'gov', 'co.uk', 'io', 'tech', 'info'];
        const domain = value.split('.').pop();
        if (!validDomains.includes(domain)) {
            throw new Error('Invalid email domain');
        }
        return true;
    }),
    body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits').isNumeric().withMessage('Phone number must be numeric'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/).withMessage('Password must include uppercase, lowercase, number, and symbol')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array().map(err => err.msg).join(', ') });
    }

    const { email, phone, password } = req.body;

    try {
        // Check if user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser  = new User({
            email,
            phone,
            password: hashedPassword
        });

        await newUser .save();

        // Respond with success
        res.status(201).json({ success: true, message: 'User  created successfully', token: 'fake-jwt-token' }); // Replace with actual token generation
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model defined
const { body, validationResult } = require('express-validator');

// Registration Route
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format'),
body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits').isNumeric().withMessage('Phone number must be numeric'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/).withMessage('Password must include uppercase, lowercase, number, and symbol'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('termsCheckbox').isBoolean().equals(true).withMessage('You must agree to the terms')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array().map(err => err.msg).join(', ') });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        });

        await newUser.save();

        // Respond with success
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;