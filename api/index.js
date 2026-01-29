import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- In-Memory Data Store (Reset on restart) ---
const DATA = {
    inquiries: [],
    files: [],
    fonts: [],
    connect: {
        chatStatus: 'active',
        tokens: []
    }
};

// --- Mock Data Initialization ---
DATA.files.push({
    id: 'f1',
    title: '新聞係活動報告書 2025 (Sample)',
    description: '2024年度の活動まとめPDFです。',
    category: 'PDF',
    url: 'https://gofile.io/d/sample', // Mock Gofile URL
    public: true,
    created_at: new Date().toISOString()
});

DATA.fonts.push({
    id: 'font1',
    name: 'Noto Sans JP',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap'
});

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '2.0.0' });
});

// 1. Files Endpoints
app.post('/api/files/create', (req, res) => {
    const { title, description, category, url, isPublic } = req.body;
    if (!title || !url) return res.status(400).json({ error: 'Missing fields' });

    const newFile = {
        id: crypto.randomUUID(),
        title,
        description,
        category: category || 'General',
        url,
        public: isPublic !== false,
        created_at: new Date().toISOString()
    };
    DATA.files.push(newFile);
    res.json({ success: true, file: newFile });
});

app.get('/api/files/list', (req, res) => {
    // Only return public files effectively, or distinct admin list if needed
    // For now, return all (assuming Admin uses this or filtered client-side)
    res.json(DATA.files);
});

// Access/Redirect mechanism
app.get('/api/files/access/:id', (req, res) => {
    const file = DATA.files.find(f => f.id === req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // In real app, check password/permissions here
    res.json({ redirectUrl: file.url });
});


// 2. Inquiries (Contact) Endpoints
app.post('/api/contact/send', (req, res) => {
    const { name, email, message, type } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const inquiry = {
        id: crypto.randomUUID(),
        name: name || 'Anonymous',
        email,
        message,
        type: type || 'General',
        status: 'unread',
        received_at: new Date().toISOString(),
        replies: []
    };
    DATA.inquiries.push(inquiry);
    res.json({ success: true, message: 'Inquiry received' });
});

app.get('/api/contact/list', (req, res) => {
    res.json(DATA.inquiries);
});

app.post('/api/contact/reply', (req, res) => {
    const { id, replyMessage } = req.body;
    const inquiry = DATA.inquiries.find(i => i.id === id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    inquiry.replies.push({
        message: replyMessage,
        sent_at: new Date().toISOString()
    });
    inquiry.status = 'replied';
    res.json({ success: true });
});


// 3. Connect Endpoints (Stub)
app.get('/api/connect/status', (req, res) => {
    res.json(DATA.connect);
});

// 4. Fonts Endpoints
app.post('/api/fonts/add', (req, res) => {
    const { name, url } = req.body;
    if (!name || !url) return res.status(400).json({ error: 'Missing fields' });

    const newFont = { id: crypto.randomUUID(), name, url };
    DATA.fonts.push(newFont);
    res.json({ success: true, font: newFont });
});

app.get('/api/fonts/list', (req, res) => {
    res.json(DATA.fonts);
});

// 5. Profile Endpoint
app.get('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    // Mock Profile Data
    // In real app, fetch from DB
    const profile = {
        username: username,
        nickname: username.charAt(0).toUpperCase() + username.slice(1),
        role: username.includes('admin') ? 'admin' : 'user',
        bio: '新聞係のメンバーです。',
        joined_at: new Date('2025-04-01').toISOString()
    };

    res.json(profile);
});

// Start Server (If running locally)
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

// Export for Vercel/Tests
export default app;
