const sessions = new Map();

function verifySession(req, res, next) {
    const sessionId = req.headers['authorization']?.split(' ')[1];
    
    if (!sessionId) {
        return res.status(401).json({ error: 'No session provided' });
    }
    
    const session = sessions.get(sessionId);
    if (!session || session.expires < Date.now()) {
        return res.status(403).json({ error: 'Invalid or expired session' });
    }
    
    req.user = session;
    next();
}

module.exports = { verifySession, sessions };
