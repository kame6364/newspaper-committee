import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

export default function Register() {
    usePageTitle('新規登録');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('パスワードが一致しません');
            return;
        }
        const result = await register(username, password);
        if (result.success) {
            alert('アカウントを作成しました');
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container login-container">
            <div className="login-card">
                <h2 className="section-title">アカウント登録</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>ユーザー名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>パスワード</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>パスワード（確認）</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">登録する</button>
                </form>
                <p className="auth-link">
                    既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
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
