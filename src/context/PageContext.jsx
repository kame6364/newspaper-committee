import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PageContext = createContext();

export function PageProvider({ children }) {
    const [pages, setPages] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetch('http://localhost:3000/pages')
            .then(res => res.json())
            .then(data => setPages(data))
            .catch(err => console.error(err));
    }, []);

    const addPage = async (title, slug, showInNav = false) => {
        if (pages.find(p => p.slug === slug)) return { success: false, message: 'Slug already exists' };

        const newPage = {
            id: Date.now().toString(),
            title,
            slug,
            showInNav,
            content: []
        };

        const res = await fetch('http://localhost:3000/pages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify(newPage)
        });
        const saved = await res.json();

        setPages([...pages, saved]);
        return { success: true };
    };

    const updatePage = async (slug, content) => {
        // Must find ID first because json-server uses ID for update
        const page = pages.find(p => p.slug === slug);
        if (!page) return;

        await fetch(`http://localhost:3000/pages/${page.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify({ content })
        });

        setPages(pages.map(p => p.slug === slug ? { ...p, content } : p));
    };

    const deletePage = async (slug) => {
        const page = pages.find(p => p.slug === slug);
        if (!page) return;

        await fetch(`http://localhost:3000/pages/${page.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        setPages(pages.filter(p => p.slug !== slug));
    };

    return (
        <PageContext.Provider value={{ pages, addPage, updatePage, deletePage }}>
            {children}
        </PageContext.Provider>
    );
}

export const usePages = () => useContext(PageContext);
