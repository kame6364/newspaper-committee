import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Settings, Users, Cpu, Palette, FileText, Activity, Zap, Layers,
    LayoutDashboard, Newspaper, MessageSquare, Folder, Scroll, Type, Wifi, CheckCircle, Lock
} from 'lucide-react';

// Icon Helper
const IconBox = ({ color, children }) => (
    <div className="ipad-icon-box" style={{ backgroundColor: color }}>
        {children}
    </div>
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [toast, setToast] = useState(null); // { message, type }

    // Data State
    const [articles, setArticles] = useState([]);
    const [pages, setPages] = useState([]);

    // Config State (Synced to KV)
    const [config, setConfig] = useState({
        stats: { history: '75', members: '40', issues: '200', slogan: 'Hyper-Modern News OS' },
        shinbunConfig: { generalModel: 'gemini-1.5-flash', proModel: 'gemini-1.5-pro', systemInstructionGeneral: '', systemInstructionAdmin: '' },
        theme: 'theme-apple-hig'
    });

    // Fetch All Settings on Mount
    useEffect(() => {
        // KV Settings
        fetch('/api/settings').then(res => res.json()).then(data => {
            if (data) {
                setConfig(prev => ({
                    ...prev,
                    ...data,
                    stats: { ...prev.stats, ...(data.stats || {}) },
                    shinbunConfig: { ...prev.shinbunConfig, ...(data.shinbunConfig || {}) }
                }));
            }
        }).catch(err => console.warn("Settings fetch failed, utilizing defaults"));

        // Restore Legacy Data (News, Pages)
        fetch('http://localhost:3000/articles').then(r => r.json()).then(setArticles).catch(() => { });
        fetch('http://localhost:3000/pages').then(r => r.json()).then(setPages).catch(() => { });
    }, []);

    // Save Logic (Universal)
    const saveSettings = async (newConfigPartial) => {
        const updatedConfig = { ...config, ...newConfigPartial };
        setConfig(updatedConfig);

        // Immediate Theme Application
        if (newConfigPartial.theme) {
            document.body.className = newConfigPartial.theme;
            localStorage.setItem('theme', newConfigPartial.theme); // Backup
        }

        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedConfig)
            });
            showToast('Settings Synced');
        } catch (e) {
            showToast('Sync Failed (Local Mode)', 'error');
        }
    };

    const handleThemeSwitch = (t) => {
        saveSettings({ theme: t });
        showToast(`Theme changed to ${t.replace('theme-', '')}`);
    };

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Sub-Change Handlers
    const updateStat = (key, value) => {
        const newStats = { ...config.stats, [key]: value };
        // Optimistic
        setConfig(prev => ({ ...prev, stats: newStats }));
    };

    // Manual Save for General
    const syncGeneral = () => saveSettings({ stats: config.stats });
    const syncAI = () => saveSettings({ shinbunConfig: config.shinbunConfig });

    // --- Render Content ---
    const renderContent = () => {
        const Header = ({ title, onSave }) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 className="content-header" style={{ margin: 0 }}>{title}</h2>
                {onSave && (
                    <button
                        onClick={onSave}
                        style={{
                            background: 'var(--color-apple-blue)', color: 'white', border: 'none',
                            borderRadius: '20px', padding: '8px 20px', fontWeight: 600, fontSize: '15px', cursor: 'pointer'
                        }}
                    >
                        Save
                    </button>
                )}
            </div>
        );

        switch (activeTab) {
            // MANAGEMENT
            case 'overview':
                return (
                    <div className="animate-fade-in">
                        <Header title="Overview" />
                        <div className="section-label">System Status</div>
                        <div className="inset-group">
                            <div className="inset-item">
                                <span className="inset-label">Active Articles</span>
                                <span style={{ color: '#8E8E93' }}>{articles.length}</span>
                            </div>
                            <div className="inset-item">
                                <span className="inset-label">Total Pages</span>
                                <span style={{ color: '#8E8E93' }}>{pages.length}</span>
                            </div>
                            <div className="inset-item">
                                <span className="inset-label">Members (Global)</span>
                                <span style={{ color: '#8E8E93' }}>{config.stats.members}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'news':
                return (
                    <div className="animate-fade-in">
                        <Header title="News Articles" />
                        <div className="inset-group">
                            {articles.map(a => (
                                <div key={a.id} className="inset-item">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500 }}>{a.title}</span>
                                        <span style={{ fontSize: 13, color: '#8E8E93' }}>{a.date} · {a.category}</span>
                                    </div>
                                    <span style={{ color: '#007AFF', fontSize: 14 }}>Edit</span>
                                </div>
                            ))}
                            {articles.length === 0 && <div className="inset-item" style={{ color: '#999' }}>No articles found</div>}
                        </div>
                    </div>
                );
            case 'pages':
                return (
                    <div className="animate-fade-in">
                        <Header title="Pages" />
                        <div className="inset-group">
                            {pages.map(p => (
                                <div key={p.id} className="inset-item">
                                    <span style={{ fontWeight: 500 }}>{p.title}</span>
                                    <span style={{ color: '#007AFF', fontSize: 14 }}>Edit</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'files':
                return (
                    <div className="animate-fade-in">
                        <Header title="Shinbun Files" />
                        <div className="inset-group">
                            <div className="inset-item" style={{ justifyContent: 'center', color: '#999' }}>
                                File System is ready. No files indexed.
                            </div>
                        </div>
                    </div>
                );

            // SHINBUN OS
            case 'ai':
                return (
                    <div className="animate-fade-in">
                        <Header title="Neural Core" onSave={syncAI} />
                        <div className="section-label">Model Configuration</div>
                        <div className="inset-group">
                            <div className="inset-item">
                                <span className="inset-label">General</span>
                                <select
                                    className="inset-value"
                                    value={config.shinbunConfig.generalModel}
                                    onChange={e => setConfig(prev => ({ ...prev, shinbunConfig: { ...prev.shinbunConfig, generalModel: e.target.value } }))}
                                >
                                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                </select>
                            </div>
                            <div className="inset-item">
                                <span className="inset-label">Pro</span>
                                <select
                                    className="inset-value"
                                    value={config.shinbunConfig.proModel}
                                    onChange={e => setConfig(prev => ({ ...prev, shinbunConfig: { ...prev.shinbunConfig, proModel: e.target.value } }))}
                                >
                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                    <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro Exp</option>
                                </select>
                            </div>
                        </div>
                        <div className="section-label">Instructions</div>
                        <div className="inset-group">
                            <div className="inset-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                                <span className="inset-label" style={{ fontWeight: 500 }}>Public Persona</span>
                                <textarea
                                    style={{ width: '100%', border: 'none', resize: 'none', fontSize: '15px', minHeight: 80, outline: 'none', fontFamily: 'inherit' }}
                                    value={config.shinbunConfig.systemInstructionGeneral}
                                    onChange={e => setConfig(prev => ({ ...prev, shinbunConfig: { ...prev.shinbunConfig, systemInstructionGeneral: e.target.value } }))}
                                />
                            </div>
                            <div className="inset-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                                <span className="inset-label" style={{ fontWeight: 500 }}>Admin Persona</span>
                                <textarea
                                    style={{ width: '100%', border: 'none', resize: 'none', fontSize: '15px', minHeight: 80, outline: 'none', fontFamily: 'inherit' }}
                                    value={config.shinbunConfig.systemInstructionAdmin}
                                    onChange={e => setConfig(prev => ({ ...prev, shinbunConfig: { ...prev.shinbunConfig, systemInstructionAdmin: e.target.value } }))}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'theme':
                return (
                    <div className="animate-fade-in">
                        <Header title="Theme Engine" />
                        <div className="section-label">Select Appearance</div>
                        <div className="inset-group">
                            {['theme-apple-hig', 'theme-liquid-glass', 'theme-material-you', 'theme-flat-ui', 'theme-fluent-2', 'theme-skeuo'].map(t => (
                                <div key={t} className="inset-item" onClick={() => handleThemeSwitch(t)} style={{ cursor: 'pointer' }}>
                                    <span className="inset-label" style={{ textTransform: 'capitalize' }}>{t.replace('theme-', '').replace('-', ' ')}</span>
                                    {config.theme === t && <span style={{ color: '#007AFF' }}><CheckCircle size={18} /></span>}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'connect':
                return (
                    <div className="animate-fade-in">
                        <Header title="Shinbun Connect" onSave={syncAI} />

                        <div className="section-label">API Configuration</div>
                        <div className="inset-group">
                            <div className="inset-item">
                                <span className="inset-label">Status</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: config.shinbunConfig.connectionStatus === 'active' ? '#34C759' : '#FF3B30' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: config.shinbunConfig.connectionStatus === 'active' ? '#34C759' : '#FF3B30' }} />
                                    {config.shinbunConfig.connectionStatus === 'active' ? 'Operational' : 'Attention Needed'}
                                </div>
                            </div>
                            <div className="inset-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span className="inset-label" style={{ marginBottom: 8 }}>Gemini API Key</span>
                                <div style={{ width: '100%', position: 'relative', display: 'flex', gap: 10 }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <input
                                            type="password"
                                            className="inset-value"
                                            style={{ textAlign: 'left', width: '100%', paddingRight: 30 }}
                                            placeholder="Enter AI credentials..."
                                            value={config.shinbunConfig.apiKey || ''}
                                            onChange={e => setConfig(prev => ({ ...prev, shinbunConfig: { ...prev.shinbunConfig, apiKey: e.target.value } }))}
                                        />
                                        <Lock size={14} style={{ position: 'absolute', right: 0, top: 4, color: '#ccc' }} />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const key = config.shinbunConfig.apiKey;
                                            if (!key) return showToast('Enter Key first', 'error');

                                            const btn = document.getElementById('test-btn');
                                            if (btn) btn.innerText = 'Testing...';

                                            try {
                                                const res = await fetch('/api/shinbun/test', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ apiKey: key })
                                                });

                                                if (!res.ok) throw new Error(`Server Error: ${res.status}`);
                                                const ct = res.headers.get('content-type');
                                                if (!ct || !ct.includes('application/json')) throw new Error('Invalid Response');

                                                const d = await res.json();

                                                if (d.success) {
                                                    showToast('Connection Successful');
                                                    saveSettings({
                                                        shinbunConfig: {
                                                            ...config.shinbunConfig,
                                                            apiKey: key,
                                                            connectionStatus: 'active'
                                                        }
                                                    });
                                                } else {
                                                    throw new Error(d.error);
                                                }
                                            } catch (e) {
                                                showToast('Test Failed: ' + e.message, 'error');
                                                setConfig(prev => ({
                                                    ...prev,
                                                    shinbunConfig: { ...prev.shinbunConfig, connectionStatus: 'error' }
                                                }));
                                            } finally {
                                                if (btn) btn.innerText = 'Test Connection';
                                            }
                                        }}
                                        id="test-btn"
                                        style={{
                                            whiteSpace: 'nowrap', background: '#007AFF', color: 'white', border: 'none',
                                            borderRadius: 8, padding: '0 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer'
                                        }}
                                    >
                                        Test Connection
                                    </button>
                                </div>
                                <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                                    Your key is encrypted and stored in Shinbun Vault (Vercel KV).
                                </p>
                            </div>
                        </div>
                    </div>
                );

            // SYSTEM
            case 'general':
                return (
                    <div className="animate-fade-in">
                        <Header title="General Settings" onSave={syncGeneral} />
                        <div className="section-label">Identity</div>
                        <div className="inset-group">
                            <div className="inset-item">
                                <span className="inset-label">History (Yrs)</span>
                                <input className="inset-value" value={config.stats.history} onChange={e => updateStat('history', e.target.value)} />
                            </div>
                            <div className="inset-item">
                                <span className="inset-label">Members</span>
                                <input className="inset-value" value={config.stats.members} onChange={e => updateStat('members', e.target.value)} />
                            </div>
                            <div className="inset-item">
                                <span className="inset-label">Slogan</span>
                                <input className="inset-value" value={config.stats.slogan} onChange={e => updateStat('slogan', e.target.value)} />
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="animate-fade-in">
                        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
                        <div className="inset-group">
                            <div className="inset-item" style={{ color: '#999', justifyContent: 'center' }}>
                                Ready.
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="ipad-layout">
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 20, right: 20,
                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                    padding: '12px 24px', borderRadius: '50px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, color: '#333',
                    border: '1px solid rgba(0,0,0,0.1)'
                }}>
                    <CheckCircle size={18} color="#34C759" />
                    {toast.message}
                </div>
            )}

            {/* Sidebar */}
            <aside className="ipad-sidebar">
                <div style={{ padding: '0 12px 20px' }}><h1 style={{ fontSize: '22px', fontWeight: 700 }}>Control Room</h1></div>

                <div className="ipad-sidebar-group-title">Management</div>
                <NavBtn id="overview" label="Overview" icon={<LayoutDashboard size={18} />} active={activeTab} set={setActiveTab} color="#007AFF" />
                <NavBtn id="news" label="News Articles" icon={<Newspaper size={18} />} active={activeTab} set={setActiveTab} color="#FF9500" />
                <NavBtn id="pages" label="Pages" icon={<FileText size={18} />} active={activeTab} set={setActiveTab} color="#34C759" />
                <NavBtn id="inquiries" label="Inquiries" icon={<MessageSquare size={18} />} active={activeTab} set={setActiveTab} color="#5856D6" />
                <NavBtn id="files" label="Shinbun Files" icon={<Folder size={18} />} active={activeTab} set={setActiveTab} color="#AF52DE" />

                <div className="ipad-sidebar-group-title">Shinbun OS</div>
                <NavBtn id="ai" label="AI Neural Core" icon={<Cpu size={18} />} active={activeTab} set={setActiveTab} color="#FF2D55" />
                <NavBtn id="theme" label="Theme Engine" icon={<Palette size={18} />} active={activeTab} set={setActiveTab} color="#00C7BE" />
                <NavBtn id="logs" label="System Logs" icon={<Scroll size={18} />} active={activeTab} set={setActiveTab} color="#8E8E93" />
                <NavBtn id="fonts" label="Fonts" icon={<Type size={18} />} active={activeTab} set={setActiveTab} color="#32ADE6" />

                <div className="ipad-sidebar-group-title">System</div>
                <NavBtn id="connect" label="Connect" icon={<Wifi size={18} />} active={activeTab} set={setActiveTab} color="#007AFF" />
                <NavBtn id="general" label="General Settings" icon={<Settings size={18} />} active={activeTab} set={setActiveTab} color="#8E8E93" />
            </aside>

            {/* Content Area */}
            <main className="ipad-content">
                {renderContent()}
            </main>
        </div>
    );
};

const NavBtn = ({ id, label, icon, active, set, color }) => (
    <button className={`ipad-nav-item ${active === id ? 'active' : ''}`} onClick={() => set(id)}>
        <IconBox color={color}>{icon}</IconBox>
        {label}
    </button>
);

export default AdminDashboard;
