const { getDB } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const db = getDB();
        // Insert new user into MySQL
        await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
        res.json({ message: 'User registered' });
    } catch (err) {
        console.error('register error:', err);
        res.status(500).json({ message: 'Registration error' });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDB();
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const row = rows[0];
        if (!row || !(await bcrypt.compare(password, row.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = new User(row.id, row.name, row.email, row.password);
        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret');
        // Return token and user's name
        res.json({ token, name: user.name });
    } catch (err) {
        console.error('login error:', err);
        res.status(500).json({ message: 'Login error' });
    }
};
