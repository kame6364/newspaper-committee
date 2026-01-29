import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';

export default function UserDashboard() {
    usePageTitle('マイページ');
    const { user } = useAuth();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) { // ユーザーが存在する場合のみお知らせを取得
            fetch('http://localhost:3000/announcements')
                .then(res => res.json())
                .then(data => setAnnouncements(data))
                .catch(console.error);
        }
    }, [user]); // userを依存配列に追加

    if (!user) {
        // ユーザー情報がまだ読み込まれていない、または存在しない場合
        return <div>Loading...</div>;
    }

    return (
        <div className="container dashboard-container">
            <h2 className="section-title">マイページ</h2>

            <div className="card announcements-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-accent)' }}>
                <h3>お知らせ</h3>
                {announcements.length > 0 ? (
                    <ul className="announcement-list">
                        {announcements.map(ann => (
                            <li key={ann.id} className="announcement-item">
                                <span className="ann-date">{ann.date}</span>
                                <h4 className="ann-title">{ann.title}</h4>
                                <p className="ann-content">{ann.content}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>現在、新しいお知らせはありません。</p>
                )}
            </div>

            <div className="card">
                <h3>アカウント情報</h3>
                <p><strong>ユーザー名:</strong> {user.username}</p>
                <p><strong>権限:</strong> 一般ユーザー</p>
            </div>
            <style>{`
        .dashboard-container { padding-top: var(--spacing-lg); min-height: 60vh; }
        .card { max-width: 600px; margin: 0 auto; background: var(--color-surface); border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: 8px; }
        .announcements-card { border-left: 4px solid var(--color-accent); }
        .announcement-list { padding: 0; margin: 0; list-style: none; }
        .announcement-item { border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1rem; }
        .announcement-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .ann-date { font-size: 0.8rem; color: var(--color-secondary); }
        .ann-title { font-size: 1.1rem; margin: 0.2rem 0; color: var(--color-text); }
        .ann-content { color: var(--color-text-secondary, #444); font-size: 0.95rem; white-space: pre-wrap; }
      `}</style>
        </div>
    );
}
