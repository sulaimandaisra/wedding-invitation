require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Initialize database
const db = require('./data/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));
app.use('/asset', express.static(path.join(__dirname, '../asset')));

// API routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Serve invitation page
app.get('/invitation/:guestId', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/invitation.html'));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin/`);
});
