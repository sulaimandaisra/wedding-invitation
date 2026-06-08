const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/wedding.db');
const db = new Database(dbPath);

console.log('Connected to SQLite database using better-sqlite3');

// Initialize database tables
function initializeDatabase() {
    // Create guests table
    db.prepare(`CREATE TABLE IF NOT EXISTS guests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        createdAt TEXT
    )`).run();
    
    // Create rsvp table
    db.prepare(`CREATE TABLE IF NOT EXISTS rsvp (
        id TEXT PRIMARY KEY,
        guestId TEXT,
        guestName TEXT,
        attendance TEXT,
        guests INTEGER,
        submittedAt TEXT,
        FOREIGN KEY (guestId) REFERENCES guests(id)
    )`).run();
    
    // Create wishes table
    db.prepare(`CREATE TABLE IF NOT EXISTS wishes (
        id TEXT PRIMARY KEY,
        guestId TEXT,
        guestName TEXT,
        message TEXT,
        submittedAt TEXT,
        FOREIGN KEY (guestId) REFERENCES guests(id)
    )`).run();
}

initializeDatabase();

module.exports = db;
