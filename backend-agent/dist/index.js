"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// In-memory mock data (will be replaced by DB)
const MOCK_NEWS = [
    { id: '1', title: '新聞係公式サイト v2.0 始動', content: '新機能が追加されました。', publishedAt: new Date().toISOString() }
];
const MOCK_FILES = [
    { id: 'f1', title: '活動報告書 2025', description: 'PDF版です', category: 'PDF', externalUrl: 'https://example.com/file1.pdf', isPublic: true }
];
// --- Routes ---
// Health Check
app.get('/', (req, res) => {
    res.send('Antigravity Agent API v2.0 is running');
});
// v2: News
app.get('/api/v2/news', (req, res) => {
    res.json(MOCK_NEWS);
});
// v2: Shinbun Files (Public Catalog)
app.get('/api/v2/files', (req, res) => {
    // Filter public files
    const publicFiles = MOCK_FILES.filter(f => f.isPublic);
    res.json(publicFiles);
});
// v2: Admin Distribution (Stub)
app.post('/api/v2/admin/distribution/generate', (req, res) => {
    // Check Auth Header here
    const uuid = 'uuid-' + Math.random().toString(36).substring(7);
    res.json({ uuid, password: 'temp-password', expiresAt: '2026-01-14T00:00:00Z' });
});
// Task Runner (Puppeteer Stub)
app.post('/run-task', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskDescription } = req.body;
    console.log(`Received task: ${taskDescription}`);
    // Async execution logic would go here
    res.json({ status: 'queued', taskId: 'task-' + Date.now() });
}));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
