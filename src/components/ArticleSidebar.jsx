import { Link } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';

export default function ArticleSidebar({ currentArticleId }) {
    const { articles } = useArticles();

    // 現在の記事を除外し、最新の記事を5件取得
    const otherArticles = articles
        .filter(a => String(a.id) !== String(currentArticleId))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <aside className="article-sidebar">
            <div className="sidebar-widget">
                <h4 className="widget-title">他の記事</h4>
                {otherArticles.length > 0 ? (
                    <ul className="recent-posts-list">
                        {otherArticles.map(article => (
                            <li key={article.id}>
                                <Link to={`/article/${article.id}`}>
                                    <span className="post-title">{article.title}</span>
                                    <span className="post-date">{article.date}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>他に記事はありません。</p>
                )}
            </div>
            <style>{`
                .article-sidebar {
                    width: 300px;
                    flex-shrink: 0;
                }
                .sidebar-widget {
                    background: var(--color-surface);
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid var(--color-border);
                }
                .widget-title {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid var(--color-accent);
                    padding-bottom: 0.5rem;
                    color: var(--color-text);
                }
                .recent-posts-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .recent-posts-list li a {
                    display: block;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid var(--color-border);
                    text-decoration: none;
                    color: var(--color-text);
                }
                .recent-posts-list li:last-child a {
                    border-bottom: none;
                }
                .recent-posts-list li a:hover .post-title {
                    color: var(--color-accent);
                }
                .post-title {
                    display: block;
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }
                .post-date {
                    font-size: 0.85rem;
                    color: var(--color-secondary);
                }

                @media (max-width: 768px) {
                    .article-sidebar {
                        width: 100%;
                        margin-top: 3rem;
                    }
                }
            `}</style>
        </aside>
    );
}
