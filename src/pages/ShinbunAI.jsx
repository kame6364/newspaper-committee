import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const ShinbunAI = () => {
    const { user } = useAuth();
    const { settings } = useSettings(); // Use KV-backed settings
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [count, setCount] = useState(0); // This could also be persisted if needed
    const [isExam, setIsExam] = useState(false);

    // EXAM Trigger
    const [logoClicks, setLogoClicks] = useState(0);

    const handleLogoClick = () => {
        const newClicks = logoClicks + 1;
        setLogoClicks(newClicks);
        if (newClicks >= 5 && !isExam) {
            setIsExam(true);
            alert("⚠️ EXAM SYSTEM ACTIVATED ⚠️");
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        try {
            // Determine config from settings context if available, or fallback
            // In a real scenario, the backend handles the model logic based on 'count'
            // We just send the context.

            const res = await fetch('/api/shinbun/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    count: count + 1,
                    isExam: isExam,
                    isAdmin: user?.role === 'admin'
                })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            setCount(prev => prev + 1);

        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection Error.' }]);
        }
    };

    return (
        <div className={`shinbun-page ${isExam ? 'exam-mode' : ''}`} style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: isExam ? '#000' : 'var(--color-system-gray-6)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header / Navbar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                zIndex: 10,
                backdropFilter: 'blur(20px)',
                backgroundColor: isExam ? 'rgba(50,0,0,0.8)' : 'rgba(255,255,255,0.6)'
            }}>
                <h1
                    onClick={handleLogoClick}
                    style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: isExam ? '#ff003c' : '#000',
                        userSelect: 'none'
                    }}
                >
                    Shinbun AI
                </h1>

                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#666' }}>
                    <span style={{ color: isExam ? 'red' : 'inherit' }}>
                        Queries: {count}
                    </span>
                    {count > 5 && <span style={{ color: '#007AFF', fontWeight: 600 }}>PRO MODEL</span>}
                </div>
            </div>

            {/* Main Content Area - Vertical Flow? Or Standard Chat? 
                User requested "Vertical writing mode" previously but now "floating capsule".
                We will keep standard layout for "Apple" feel unless vertical was re-requested.
                The previous "Vertical" requirement was part of the "News OS". 
                "Apple HIG" usually implies clean standard text. 
                I will stick to standard chat flow for modern usability unless vertical is strictly enforced by the "Modernize" goal.
                Actually, let's keep it simple and clean.
            */}
            <div className="messages-container" style={{
                flex: 1,
                padding: '80px 20px 100px 20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                    }}>
                        <div
                            className="glass-panel"
                            style={{
                                padding: '12px 18px',
                                borderRadius: '18px',
                                background: msg.role === 'user' ? '#007AFF' : 'rgba(255,255,255,0.8)',
                                color: msg.role === 'user' ? '#fff' : '#000',
                                borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                                boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                transition: 'transform 0.2s',
                                cursor: 'default'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Capsule Input */}
            <div className="capsule-input-container">
                <div className="capsule-input">
                    <input
                        className="capsule-field"
                        placeholder="Ask Shinbun AI..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="capsule-btn" onClick={sendMessage}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 5 5 12"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Exam Noise Overlay */}
            {isExam && <div className="exam-noise"></div>}
        </div>
    );
};

export default ShinbunAI;
