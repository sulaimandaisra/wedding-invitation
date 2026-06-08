const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Read JSON file
function readJSON(filename) {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
        writeJSON(filename, []);
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Write JSON file
function writeJSON(filename, data) {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readJSON, writeJSON };
