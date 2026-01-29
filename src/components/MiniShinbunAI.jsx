import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MiniShinbunAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'こんにちは。新聞係AIです。何かお手伝いしましょうか？' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [adminModel, setAdminModel] = useState('gemini-1.5-pro');

    // Connection Status State
    const [hasConnectionError, setHasConnectionError] = useState(false);

    // Model Control State (Local Only for Mini)
    const [count, setCount] = useState(() => {
        return parseInt(localStorage.getItem('shinbun_count') || '0');
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Check Status on Mount
    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(data => {
            if (data?.shinbunConfig?.connectionStatus === 'error' || !data?.shinbunConfig?.apiKey) {
                console.warn('[MiniAI] Connection Diagnostic: API Key Issue or Offline.');
                setHasConnectionError(true);
            } else {
                console.log('[MiniAI] Connection Diagnostic: Online.');
            }
        }).catch((e) => {
            console.error('[MiniAI] Diagnostic Fetch Failed:', e);
            setHasConnectionError(true);
        });
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);
        setHasConnectionError(false); // Optimistically clear

        const newCount = count + 1;
        setCount(newCount);
        localStorage.setItem('shinbun_count', newCount.toString());

        console.log(`[MiniAI Debug] Sending request to /api/shinbun/chat...`);
        console.log(`[MiniAI Debug] Payload:`, { message: userMsg, count: newCount, isAdmin, adminModel });

        try {
            const res = await fetch('/api/shinbun/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    count: newCount,
                    isExam: false,
                    isAdmin: isAdmin,
                    ...(isAdmin && { adminModelOverride: adminModel })
                })
            });
            const data = await res.json();

            console.log(`[MiniAI Debug] Response:`, data);

            // Check for specific setup error
            if (data.error === 'NO_API_KEY') {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '⚠️ Setup Required: Agent is offline. Please configure credentials in Admin Settings.'
                }]);
                setHasConnectionError(true);
            } else if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.reply || 'System Error'}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (e) {
            console.error('[MiniAI Debug] Fetch Error:', e);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection Error.' }]);
            setHasConnectionError(true);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999, fontFamily: 'var(--font-sf-pro)' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="glass-panel"
                        style={{
                            width: '320px',
                            height: '480px',
                            borderRadius: '24px',
                            marginBottom: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                            background: 'rgba(255,255,255,0.75)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            background: 'rgba(255,255,255,0.5)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span style={{ fontWeight: 600, fontSize: '15px' }}>Shinbun AI {isAdmin && 'Pro'}</span>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                    <X size={18} color="#666" />
                                </button>
                            </div>

                            {/* Admin Model Picker */}
                            {isAdmin && (
                                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', padding: 2, borderRadius: 8 }}>
                                    {['gemini-1.5-flash', 'gemini-1.5-pro'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setAdminModel(m)}
                                            style={{
                                                flex: 1, border: 'none', background: adminModel === m ? '#fff' : 'transparent',
                                                borderRadius: 6, padding: '4px 0', fontSize: '11px', fontWeight: 600,
                                                color: adminModel === m ? '#000' : '#888', boxShadow: adminModel === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {m.replace('gemini-', '').replace('-', ' ').toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    padding: '10px 14px',
                                    borderRadius: '16px',
                                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                                    background: msg.role === 'user' ? '#007AFF' : 'rgba(255,255,255,0.6)',
                                    color: msg.role === 'user' ? '#fff' : '#000',
                                    fontSize: '14px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}>
                                    {msg.content}
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', color: '#666' }}>
                                    Thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', display: 'flex', gap: '8px' }}>
                            <input
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '10px 16px',
                                    background: 'rgba(255,255,255,0.8)',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                                placeholder="Message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: '#007AFF',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Send size={16} color="#fff" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-panel"
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.4)',
                    background: hasConnectionError ? '#FF3B30' : 'rgba(255,255,255,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    float: 'right',
                    boxShadow: hasConnectionError ? '0 0 20px rgba(255, 59, 48, 0.5)' : 'none'
                }}
            >
                {isOpen ?
                    <X size={24} color={hasConnectionError ? '#fff' : '#000'} /> :
                    <MessageCircle size={24} color={hasConnectionError ? '#fff' : '#007AFF'} />
                }
                {hasConnectionError && !isOpen && (
                    <div style={{
                        position: 'absolute', top: 0, right: 0,
                        width: 16, height: 16, background: '#fff', borderRadius: '50%',
                        fontSize: 12, fontWeight: 'bold', color: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>!</div>
                )}
            </motion.button>
        </div>
    );
};

export default MiniShinbunAI;
