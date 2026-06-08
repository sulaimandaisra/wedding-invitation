const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../data/database');
const { verifySession } = require('../middleware/sessionAuth');

// Get all guests (protected)
router.get('/guests', verifySession, (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM guests').all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get guest by ID
router.get('/guests/:id', (req, res) => {
    try {
        const row = db.prepare('SELECT * FROM guests WHERE id = ?').get(req.params.id);
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Guest not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new guest
router.post('/guests', (req, res) => {
    const { name, phone } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    try {
        const stmt = db.prepare('INSERT INTO guests (id, name, phone, createdAt) VALUES (?, ?, ?, ?)');
        stmt.run(id, name, phone || '', createdAt);
        res.json({ id, name, phone: phone || '', createdAt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete guest (cascade delete RSVP and wishes)
router.delete('/guests/:id', (req, res) => {
    const guestId = req.params.id;
    
    try {
        // Delete related RSVP
        db.prepare('DELETE FROM rsvp WHERE guestId = ?').run(guestId);
        
        // Delete related wishes
        db.prepare('DELETE FROM wishes WHERE guestId = ?').run(guestId);
        
        // Delete guest
        db.prepare('DELETE FROM guests WHERE id = ?').run(guestId);
        
        res.json({ message: 'Guest and related data deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit RSVP
router.post('/rsvp', (req, res) => {
    const { guestId, attendance, guests: guestCount } = req.body;
    
    if (!guestId || !attendance) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        // Get guest name
        const guest = db.prepare('SELECT name FROM guests WHERE id = ?').get(guestId);
        const guestName = guest ? guest.name : 'Unknown';
        
        const id = uuidv4();
        const submittedAt = new Date().toISOString();
        
        db.prepare('INSERT INTO rsvp (id, guestId, guestName, attendance, guests, submittedAt) VALUES (?, ?, ?, ?, ?, ?)')
            .run(id, guestId, guestName, attendance, guestCount || 1, submittedAt);
        
        res.json({ id, guestId, guestName, attendance, guests: guestCount || 1, submittedAt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all RSVP (protected)
router.get('/rsvp', verifySession, (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM rsvp').all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete RSVP
router.delete('/rsvp/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM rsvp WHERE id = ?').run(req.params.id);
        res.json({ message: 'RSVP deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit wish
router.post('/wishes', (req, res) => {
    const { guestId, message } = req.body;
    
    if (!guestId || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        // Get guest name
        const guest = db.prepare('SELECT name FROM guests WHERE id = ?').get(guestId);
        const guestName = guest ? guest.name : 'Unknown';
        
        const id = uuidv4();
        const submittedAt = new Date().toISOString();
        
        db.prepare('INSERT INTO wishes (id, guestId, guestName, message, submittedAt) VALUES (?, ?, ?, ?, ?)')
            .run(id, guestId, guestName, message, submittedAt);
        
        res.json({ id, guestId, guestName, message, submittedAt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all wishes (protected)
router.get('/wishes', verifySession, (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM wishes').all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete wish
router.delete('/wishes/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM wishes WHERE id = ?').run(req.params.id);
        res.json({ message: 'Wish deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get invitation data
router.get('/invitation/:guestId', (req, res) => {
    try {
        const guest = db.prepare('SELECT * FROM guests WHERE id = ?').get(req.params.guestId);
        
        if (!guest) {
            return res.status(404).json({ error: 'Invitation not found' });
        }
        
        res.json({
            guest,
            eventDate: '2026-06-27T09:00:00',
            akadDate: '2026-01-17T09:00:00',
            resepsiDate: '2026-06-27T10:00:00'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
