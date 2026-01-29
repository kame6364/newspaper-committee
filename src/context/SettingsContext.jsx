import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export function useSettings() {
    return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        stats: {
            members: '40',
            history: '75',
            issues: '200',
            slogan: 'Hyper-Modern News OS'
        },
        customFonts: [] // Array of { name, url }
    });

    // Fetch settings on mount
    useEffect(() => {
        fetch('/api/settings')
            .then(res => {
                if (!res.ok) throw new Error(`Server Error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data && data.stats) setSettings(data);
                else if (data) setSettings(prev => ({ ...prev, ...data }));

                // Apply Global Theme
                if (data.theme) {
                    document.body.className = data.theme;
                }
            })
            .catch(err => {
                console.warn('[SettingsContext] Fetch Warning:', err);
                // Keep defaults if fetch fails
            });
    }, []);

    // Inject Custom Fonts
    useEffect(() => {
        if (settings.customFonts && settings.customFonts.length > 0) {
            settings.customFonts.forEach(font => {
                const id = `custom-font-${font.name.replace(/\s+/g, '-')}`;
                if (!document.getElementById(id)) {
                    const link = document.createElement('link');
                    link.id = id;
                    link.rel = 'stylesheet';
                    link.href = font.url;
                    document.head.appendChild(link);
                }
            });
        }
    }, [settings.customFonts]);

    const updateSettings = async (newSettings) => {
        // Optimistic update
        setSettings(newSettings);

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(newSettings)
            });

            if (!res.ok) throw new Error(`Save failed: ${res.status}`);

            // Optional: read response to confirm
            // const data = await res.json();
        } catch (error) {
            console.error('[SettingsContext] Save Failed:', error);
            // Optionally revert settings here if strictly needed
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
