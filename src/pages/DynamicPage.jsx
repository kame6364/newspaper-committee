import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePages } from '../context/PageContext';
import { useAuth } from '../context/AuthContext';
import BlockEditor from '../components/BlockEditor';
import usePageTitle from '../hooks/usePageTitle';

export default function DynamicPage() {
    const { slug } = useParams();
    const { pages, updatePage } = usePages();
    const { user } = useAuth();

    const page = pages.find(p => p.slug === slug);
    usePageTitle(page ? page.title : 'ページ');

    const [isEditing, setIsEditing] = useState(false);
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        if (page && page.content) {
            setBlocks(page.content);
        }
    }, [page]);

    const handleSave = () => {
        updatePage(slug, blocks);
        setIsEditing(false);
    };

    if (!page) return <div className="container" style={{ paddingTop: '4rem' }}>ページが見つかりません。</div>;

    return (
        <div className="container page-container">
            <div className="page-header">
                <h1 className="page-title">{page.title}</h1>
            </div>

            {user && user.role === 'admin' && (
                <div className="admin-controls">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="save-btn">保存して終了</button>
                            <button onClick={() => setIsEditing(false)} className="cancel-btn">キャンセル</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="edit-mode-btn">編集モード</button>
                    )}
                </div>
            )}

            <div className="page-body">
                <BlockEditor
                    blocks={blocks}
                    onChange={setBlocks}
                    isEditable={isEditing}
                />
            </div>

            <style>{`
        .page-container { padding-top: var(--spacing-lg); max-width: 800px; margin: 0 auto; min-height: 80vh; }
        .page-header { margin-bottom: var(--spacing-lg); text-align: center; border-bottom: 1px solid #eee; padding-bottom: var(--spacing-md); }
        .page-title { font-size: 2.5rem; }
        .admin-controls { margin-bottom: 2rem; display: flex; gap: 1rem; justify-content: flex-end; position: sticky; top: 100px; z-index: 100; }
        .edit-mode-btn, .save-btn { background: var(--color-accent); color: #fff; border: none; padding: 0.8rem 1.5rem; cursor: pointer; border-radius: 4px; }
        .cancel-btn { background: #eee; border: none; padding: 0.8rem 1.5rem; cursor: pointer; border-radius: 4px; }
        .page-body { margin-bottom: var(--spacing-xl); }
      `}</style>
        </div>
    );
}
