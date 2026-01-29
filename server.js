import pkg from 'json-server';
const { create, router: jsonRouter, defaults, bodyParser } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import shinbunRouter from './api/shinbun-ai.js';
import settingsRouter from './api/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = create();
const router = jsonRouter(path.join(__dirname, 'db.json'));
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

// MOUNT SHINBUN AI API
server.use('/api/shinbun', shinbunRouter);
// MOUNT SETTINGS API (Vercel KV)
server.use('/api/settings', settingsRouter);


// In-memory token store (simplistic for demo)
// In production, use a database or signed JWTs
const SESSIONS = {};

// Login Endpoint
server.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'));
    const user = db.users.find(u =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (user) {
        const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
        SESSIONS[token] = user;
        // Clean up old sessions occasionally or SetTimeout here
        res.json({
            success: true,
            token,
            user: { username: user.username, role: user.role }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Middleware for Protection
server.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        // Allow login/register without token
        // Also allow Shinbun AI chat (public?) - User request says "General User", so likely public
        if (req.path === '/auth/login' || req.path === '/users' || req.path.startsWith('/api/shinbun/chat')) {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Missing or invalid token' });
        }

        const token = authHeader.split(' ')[1];
        if (!SESSIONS[token]) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Attach user to request if needed
        req.user = SESSIONS[token];
    }
    next();
});

server.use(router);

// Vite handles port 5173 usually, this backend likely runs on 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`JSON Server with Auth is running on port ${PORT}`);
});