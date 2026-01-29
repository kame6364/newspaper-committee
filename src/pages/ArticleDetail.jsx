import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useArticles } from '../context/ArticleContext';
import { useAuth } from '../context/AuthContext';
import BlockEditor from '../components/BlockEditor';
import SavePreviewModal from '../components/SavePreviewModal';
import ArticleSidebar from '../components/ArticleSidebar'; // サイドバーをインポート

import usePageTitle from '../hooks/usePageTitle';

export default function ArticleDetail() {
    const { id } = useParams();
    const { articles, updateArticle, comments, addComment } = useArticles();
    const { user } = useAuth();

    const article = articles.find(a => String(a.id) === id);

    usePageTitle(article ? article.title : '記事詳細');

    const [isEditing, setIsEditing] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (article && article.content) {
            setBlocks(article.content);
        }
    }, [article]);

    const handleSaveClick = () => {
        setShowPreview(true);
    };

    const handleConfirmSave = () => {
        updateArticle(id, { content: blocks });
        setIsEditing(false);
        setShowPreview(false);
    };

    const handleCancelPreview = () => {
        setShowPreview(false);
    };

    const handleTwitterClick = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("X!!!!!");
            utterance.lang = 'ja-JP';
            window.speechSynthesis.speak(utterance);
        } else {
            alert('音声合成は、お使いのブラウザではサポートされていません。');
        }
    };


    if (!article) return <div className="container" style={{ paddingTop: '4rem' }}>記事が見つかりません。</div>;

    const shareUrl = window.location.href;
    const shareText = article ? article.title : '';

    return (
        <div className="container article-container">
            <div className="article-layout">
                <main className="article-main-content">
                                <div className="article-header">
                                    <span className="article-meta">{article.date} | {article.category}</span>
                                    <h1 className="article-title">{article.title}</h1>
                                </div>
                    
                                {article.featuredImage && (
                                    <div className="featured-image-container">
                                        <img src={article.featuredImage} alt={article.title} className="featured-image" />
                                    </div>
                                )}
                    
                                <div className="share-buttons">
                                    <button onClick={handleTwitterClick} className="share-btn twitter-voice-btn">
                                        X (音声)
                                    </button>
                                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="share-btn twitter-share-btn">
                                        𝕏
                                    </a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn facebook-share-btn">
                                        Facebook
                                    </a>
                                </div>
                    {user && user.role === 'admin' && (
                        <div className="admin-controls">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSaveClick} className="save-btn">保存して終了</button>
                                    <button onClick={() => { setIsEditing(false); setBlocks(article.content || []); }} className="cancel-btn">キャンセル</button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="edit-mode-btn">編集モード</button>
                            )}
                        </div>
                    )}

                    <div className="article-body">
                        {!isEditing && blocks.length === 0 && (
                            <p className="excerpt-fallback">{article.excerpt}</p>
                        )}

                        <BlockEditor
                            blocks={blocks}
                            onChange={setBlocks}
                            isEditable={isEditing}
                        />
                    </div>

                    <div className="article-footer">
                        <Link to="/#news" className="back-link">&larr; 記事一覧に戻る</Link>
                    </div>

                    <div className="comments-section">
                        <h3 className="section-title">コメント</h3>
                        <div className="comments-list">
                            {(comments || []).filter(c => String(c.articleId) === id).length === 0 ? (
                                <p className="no-comments">コメントはまだありません。</p>
                            ) : (
                                (comments || []).filter(c => String(c.articleId) === id).map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <span className="comment-author">{comment.username}</span>
                                            <span className="comment-date">{comment.date}</span>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="comment-form">
                            <h4>コメントを投稿</h4>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const content = e.target.content.value;
                                const username = user ? user.username : (e.target.username?.value || '匿名');
                                addComment({ articleId: id, username, content });
                                e.target.reset();
                            }}>
                                {!user && (
                                    <div className="form-group">
                                        <input type="text" name="username" placeholder="お名前 (任意)" className="comment-input" />
                                    </div>
                                )}
                                <div className="form-group">
                                    <textarea name="content" required placeholder="コメントを入力..." rows="3" className="comment-input"></textarea>
                                </div>
                                <button type="submit" className="submit-btn-small">送信</button>
                            </form>
                        </div>
                    </div>
                </main>
                <ArticleSidebar currentArticleId={id} />
            </div>


            {showPreview && (
                <SavePreviewModal
                    currentBlocks={article.content || []}
                    newBlocks={blocks}
                    onConfirm={handleConfirmSave}
                    onCancel={handleCancelPreview}
                />
            )}

            <style>{`
        .article-container { padding-top: var(--spacing-lg); max-width: 1100px; margin: 0 auto; min-height: 80vh; }
        .article-layout { display: flex; gap: 2.5rem; }
        .article-main-content { flex: 1; min-width: 0; }
        
        @media (max-width: 768px) {
            .article-layout { flex-direction: column; }
        }

        .article-header { margin-bottom: var(--spacing-lg); text-align: center; border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-md); }
        .article-meta { color: var(--color-secondary); font-size: 0.9rem; margin-bottom: var(--spacing-xs); display: block; }
        .article-title { font-size: 2.5rem; color: var(--color-text); }
        
        .featured-image-container {
            margin: 2rem 0;
        }
        .featured-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
            margin: 0 auto;
        }

        .share-buttons { display: flex; gap: 1rem; justify-content: center; margin: 1rem 0 2rem; }
        .share-btn { padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; color: #fff; font-weight: bold; border: none; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
        .twitter-voice-btn { background-color: #1DA1F2; }
        .twitter-share-btn { background-color: #000; font-family: "TwitterChirp",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
        .facebook-share-btn { background-color: #1877F2; }

        .admin-controls { margin-bottom: 2rem; display: flex; gap: 1rem; justify-content: flex-end; position: sticky; top: 100px; z-index: 100; }
        .edit-mode-btn, .save-btn { background: var(--color-accent); color: #fff; border: none; padding: 0.8rem 1.5rem; cursor: pointer; border-radius: 4px; }
                .cancel-btn { background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); padding: 0.8rem 1.5rem; cursor: pointer; border-radius: 4px; }
        .excerpt-fallback { font-size: 1.1rem; line-height: 1.8; color: var(--color-text); }
        .back-link { display: inline-block; margin-top: 2rem; color: var(--color-secondary); font-weight: 500; }
        .back-link:hover { color: var(--color-accent); }
        
        .comments-section { margin-top: 4rem; border-top: 1px solid var(--color-border); padding-top: 2rem; }
        .section-title { color: var(--color-text); }
        .comment-item { background: var(--color-surface); padding: 1rem; margin-bottom: 1rem; border-radius: 8px; border: 1px solid var(--color-border); }
        .comment-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--color-secondary); }
        .comment-author { font-weight: bold; color: var(--color-text); }
        .comment-content { color: var(--color-text); }
        
        .comment-form { margin-top: 2rem; background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 8px; }
        .comment-input { width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 4px; margin-bottom: 1rem; background: var(--color-bg); color: var(--color-text); }
        .submit-btn-small { background: var(--color-accent); color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
        .no-comments { color: var(--color-secondary); }
      `}</style>
        </div >
    );
}
