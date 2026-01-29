import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/src/assets/logo_full.png" alt="Newspaper Committee Logo" className="footer-logo" />
            <div className="footer-text">
              <h2>新聞係</h2>
              <p className="footer-tagline">伝える、繋がる、未来へ。</p>
            </div>
          </div>
          <div className="footer-links">
            <Link to="/privacy">プライバシーポリシー</Link>
            <Link to="/terms">利用規約</Link>
            <Link to="/report">問題報告</Link>
          </div>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} Newspaper Committee. All Rights Reserved.
        </div>
      </div>
      <style>{`
        .footer {
          background-color: var(--color-text);
          color: #fff;
          padding: var(--spacing-lg) 0 var(--spacing-md);
          margin-top: var(--spacing-xl);
        }
        .footer-logo {
          max-height: 50px;
          margin-right: 1.5rem;
        }
        .footer-brand {
          display: flex;
          align-items: center;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .footer-tagline {
          color: #999;
          margin-top: var(--spacing-xs);
          font-family: var(--font-serif);
        }
        .footer-links {
          display: flex;
          gap: var(--spacing-md);
        }
        .footer-links a {
          color: #ccc;
          font-size: 0.9rem;
        }
        .footer-links a:hover {
          color: #fff;
        }
        .copyright {
          text-align: center;
          color: #666;
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </footer>
  );
}
