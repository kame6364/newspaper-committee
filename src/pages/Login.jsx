import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

export default function Login() {
    usePageTitle('ログイン');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            // Use the returned role for navigation
            navigate(result.role === 'admin' ? '/admin' : '/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container login-container">
            <div className="login-card">
                <h2 className="section-title">関係者ログイン</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>ユーザー名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>パスワード</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-btn">ログイン</button>
                </form>
                <p className="auth-link">
                    アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
                </p>
            </div>
            <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }
        .login-card {
          background: var(--color-surface);
          padding: var(--spacing-lg);
          border-radius: 8px;
          border: 1px solid var(--color-border);
          width: 100%;
          max-width: 400px;
        }
        .error-msg {
          color: red;
          margin-bottom: var(--spacing-sm);
          font-size: 0.9rem;
        }
        .auth-link {
          margin-top: var(--spacing-md);
          text-align: center;
          font-size: 0.9rem;
        }
        .auth-link a {
          color: var(--color-accent);
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
}
