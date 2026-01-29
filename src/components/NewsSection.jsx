import { useArticles } from '../context/ArticleContext';
import { Link } from 'react-router-dom';

export default function NewsSection() {
  const { articles } = useArticles();

  return (
    <section id="news" className="section news-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">LATEST NEWS</span>
          <h2 className="section-title">最新記事</h2>
        </div>
        <div className="news-grid">
          {articles.map(article => (
            <article key={article.id} className="news-card">
              {article.featuredImage ? (
                <img src={article.featuredImage} alt={article.title} className="news-image" />
              ) : (
                <div className="news-image-placeholder"></div>
              )}
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-date">{article.date}</span>
                  <span className="news-category">{article.category}</span>
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-excerpt">{article.excerpt}</p>
                <Link to={`/article/${article.id}`} className="read-more">
                  記事を読む &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .section {
          padding: var(--spacing-xl) 0;
        }
        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }
        .section-subtitle {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          color: var(--color-accent);
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 600;
        }
        .section-title {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
        }
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-md);
        }
        .news-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
          display: flex;
          flex-direction: column;
        }
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .news-image {
          height: 200px;
          width: 100%;
          object-fit: cover;
        }
        .news-image-placeholder {
          height: 200px;
          background-color: var(--color-bg);
          position: relative;
          overflow: hidden;
        }
        .news-image-placeholder::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(45deg, var(--color-surface) 25%, var(--color-bg) 25%, var(--color-bg) 50%, var(--color-surface) 50%, var(--color-surface) 75%, var(--color-bg) 75%, var(--color-bg) 100%);
            background-size: 20px 20px;
            opacity: 0.5;
        }
        .news-content {
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .news-meta {
          display: flex;
          gap: var(--spacing-sm);
          font-size: 0.8rem;
          color: var(--color-secondary);
          margin-bottom: var(--spacing-sm);
        }
        .news-category {
          color: var(--color-text);
          font-weight: 600;
        }
        .news-title {
          font-size: 1.25rem;
          margin-bottom: var(--spacing-sm);
          line-height: 1.4;
          flex-grow: 1;
        }
        .news-excerpt {
          font-size: 0.95rem;
          color: var(--color-secondary);
          margin-bottom: var(--spacing-md);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .read-more {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-accent);
          margin-top: auto;
        }
      `}</style>
    </section>
  );
}