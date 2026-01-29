import express from 'express';
import { kv } from '@vercel/kv';

const router = express.Router();

// Fallback in-memory store if KV is not configured locally or fails
let MEMORY_STORE = {
    stats: {
        members: '40',
        history: '75',
        issues: '200'
    }
};

router.get('/', async (req, res) => {
    try {
        // Try to fetch from KV
        // Note: For local dev without Vercel Env, this might fail unless .env is set correctly
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            const data = await kv.get('shinbun_config');
            if (data) {
                return res.json(data);
            }
        }
    } catch (e) {
        console.warn('Vercel KV Fetch Failed:', e.message);
    }

    // Return Memory/Default if KV fails or empty
    res.json(MEMORY_STORE);
});

router.post('/', async (req, res) => {
    const newData = req.body;

    try {
        // Update Memory
        MEMORY_STORE = { ...MEMORY_STORE, ...newData };

        // Update KV
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            try {
                await kv.set('shinbun_config', newData);
                console.log('Saved to Vercel KV');
            } catch (kvError) {
                console.error('KV Write Error:', kvError);
                // Don't fail the request if KV fails, just fallback to memory
            }
        } else {
            console.log('Vercel KV not configured, saved to memory only');
        }

        res.json({ success: true, data: newData });
    } catch (e) {
        console.error('Vercel KV Save Failed:', e);
        res.status(500).json({ success: false, error: e.message });
    }
});

export default router;
