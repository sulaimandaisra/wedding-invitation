const express = require('express');
const router = express.Router();
const { sessions, verifySession } = require('../middleware/sessionAuth');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment variables');
}

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const sessionId = Math.random().toString(36).substring(2);
        sessions.set(sessionId, { username, expires: Date.now() + 24 * 60 * 60 * 1000 });
        res.json({ sessionId, username });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Logout
router.post('/logout', verifySession, (req, res) => {
    const sessionId = req.headers['authorization']?.split(' ')[1];
    sessions.delete(sessionId);
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
