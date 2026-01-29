import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // Not imported, using fetch for dynamic URL control
// import fetch from 'node-fetch'; // Using global fetch (Node 18+)
import { kv } from '@vercel/kv';

const router = express.Router();

// Configuration Store (Fallback)
let CONFIG = {
    generalModel: 'gemini-1.5-flash',
    proModel: 'gemini-1.5-pro',
    examModel: 'gemini-1.5-pro',
    systemInstructionGeneral: `You are the "Shinbun AI", a hyper-modern news aggregator. Tone: Sharp, Concise, Futuristic.`,
    systemInstructionAdmin: `You are the "Shinbun Controller". Tone: Authoritative, Absolute, Analytical.`,
    adminSelectedModel: 'gemini-1.5-pro'
};

// 1. CONFIG ENDPOINTS (Admin Only) - Keep existing logic for local state specific updates if needed, but primary is KV
router.get('/config', (req, res) => {
    res.json(CONFIG);
});

router.post('/config', (req, res) => {
    // Legacy endpoint, mostly handled by api/settings.js now
    res.json({ success: true, config: CONFIG });
});

router.post('/test', async (req, res) => {
    try {
        const { apiKey } = req.body;
        if (!apiKey) return res.status(400).json({ success: false, error: 'No API Key provided' });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "ping" }] }] })
        });

        if (!response.ok) throw new Error(await response.text());
        res.json({ success: true });
    } catch (error) {
        console.error("Connection Test Failed:", error);
        res.status(500).json({ success: false, error: error.message || 'Connection Failed' });
    }
});

// 2. CHAT / GENERATION ENDPOINT
router.post('/chat', async (req, res) => {
    const { message, count, isExam, isAdmin, adminModelOverride } = req.body;

    // --- 1. Fetch Dynamic Config from KV ---
    let activeConfig = { ...CONFIG };
    let apiKey = process.env.GEMINI_API_KEY;

    try {
        if (process.env.KV_REST_API_URL) {
            const kvConfig = await kv.get('shinbun_config');
            if (kvConfig && kvConfig.shinbunConfig) {
                // Merge KV settings
                const sc = kvConfig.shinbunConfig;
                if (sc.apiKey) apiKey = sc.apiKey;
                if (sc.systemInstructionPublic) activeConfig.systemInstructionGeneral = sc.systemInstructionPublic;
                if (sc.systemInstructionAdmin) activeConfig.systemInstructionAdmin = sc.systemInstructionAdmin;
                // Note: Models could also be configurable here later
            }
        }
    } catch (e) {
        console.warn("KV Config Fetch Warning:", e.message);
    }

    if (!apiKey) {
        return res.status(500).json({
            reply: "Setup Required: Agent is offline.",
            error: "NO_API_KEY"
        });
    }

    // --- 2. Model Selection Logic ---
    let selectedModel = activeConfig.generalModel;
    let systemInstruction = activeConfig.systemInstructionGeneral;

    if (isAdmin) {
        selectedModel = adminModelOverride || activeConfig.adminSelectedModel;
        systemInstruction = activeConfig.systemInstructionAdmin;
    } else if (isExam) {
        selectedModel = activeConfig.examModel;
        systemInstruction = activeConfig.systemInstructionAdmin;
    } else {
        if (count > 5) selectedModel = activeConfig.proModel;
    }

    // --- 3. API Call ---
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: message }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: isExam ? 0.9 : 0.7,
                maxOutputTokens: 1000,
            }
        };

        console.log(`[Shinbun AI] Sending to ${selectedModel}... (Admin: ${isAdmin})`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Gemini API Error Detail:", err);
            let reply = "Communications Severed.";
            if (err.includes('API_KEY_INVALID')) reply = "Security Protocol Failure: Invalid Key.";
            return res.status(response.status).json({ error: "AI Transmission Failed", details: err, reply });
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];

        if (candidate?.finishReason === 'SAFETY') {
            return res.json({ reply: "Content Redacted by Safety Protocols.", modelUsed: selectedModel });
        }

        const text = candidate?.content?.parts?.[0]?.text || "No actionable data received.";

        res.json({
            reply: text,
            modelUsed: selectedModel,
            isExamActive: !!isExam
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal System Failure", reply: "System Critical Error." });
    }
});

router.post('/exam/reset', (req, res) => {
    res.json({ success: true, message: "EXAM Systems Reset" });
});

export default router;
