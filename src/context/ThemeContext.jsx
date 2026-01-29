import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = [
    { id: 'system', label: 'システムに合わせる' },
    { id: 'light', label: 'ホワイト(ノーマル)' },
    { id: 'fluent2', label: 'Fluent 2' },
    { id: 'fluent2-dark', label: 'Fluent 2 Black' },
    { id: 'material3', label: 'Material Design 3' },
    { id: 'material3-dark', label: 'Material Design 3 Black' },
    { id: 'skeuomorphism', label: 'Skeuomorphism UI' },
    { id: 'skeuomorphism-dark', label: 'Skeuomorphism UI Black' },
    { id: 'flat', label: 'Flat UI (WinJS)' },
    { id: 'flat-dark', label: 'Flat UI Black (WinJS)' },
    { id: 'reflective', label: 'Reflective UI' },
    { id: 'reflective-dark', label: 'Reflective UI Black' },
];

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);

        // Remove all theme classes
        document.documentElement.classList.forEach(cls => {
            if (cls.startsWith('theme-')) {
                document.documentElement.classList.remove(cls);
            }
        });

        // Determine actual theme to apply
        let actualTheme = theme;
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            actualTheme = prefersDark ? 'fluent2-dark' : 'light';
        }

        // Apply theme class
        if (actualTheme !== 'light') {
            document.documentElement.classList.add(`theme-${actualTheme}`);
        }
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
            document.documentElement.classList.forEach(cls => {
                if (cls.startsWith('theme-')) {
                    document.documentElement.classList.remove(cls);
                }
            });
            if (e.matches) {
                document.documentElement.classList.add('theme-fluent2-dark');
            }
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
