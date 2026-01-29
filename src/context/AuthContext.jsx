import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });



    const login = async (username, password) => {
        try {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                const userData = { ...data.user, token: data.token };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true, role: data.user.role };
            }
            return { success: false, message: data.message };
        } catch (e) {
            return { success: false, message: 'Login failed (Network Error)' };
        }
    };

    const register = async (username, password, role = 'user') => {
        try {
            const checkRes = await fetch(`http://localhost:3000/users?username=${username}`);
            const existing = await checkRes.json();
            if (existing.length > 0) {
                return { success: false, message: 'Username already taken' };
            }

            const newUser = { username, password, role };
            await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            return { success: true };
        } catch (e) {
            return { success: false, message: 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
