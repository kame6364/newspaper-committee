import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePages } from '../context/PageContext';
import { useRailway } from '../context/RailwayContext';
import { useTheme } from '../context/ThemeContext';
import lightLogo from '../assets/logo_full.png';
import darkLogo from '../assets/logo_full_black.png';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pages } = usePages();
  const { theme, setTheme, THEMES } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { triggerRailwayTransition } = useRailway();

  const [logoToDisplay, setLogoToDisplay] = useState(lightLogo);

  useEffect(() => {
    const checkTheme = () => {
      const isDark = theme.includes('dark') || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setLogoToDisplay(isDark ? darkLogo : lightLogo);
    };

    checkTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => checkTheme();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navPages = pages.filter(p => p.showInNav);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-link">
          <img src={logoToDisplay} alt="新聞係" className="logo-img" />
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
          <a href="/#news" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('nav.news')}</a>
          <a href="/#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</a>

          <Link to="/files" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('nav.files')}</Link>

          {/* Dynamic Page Links */}
          {navPages.map(page => (
            <Link key={page.id} to={`/page/${page.slug}`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {page.title}
            </Link>
          ))}

          <a href="/#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</a>

          {/* Railway Link - Special Behavior */}
          <button
            className="nav-link"
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
            onClick={() => { setIsMenuOpen(false); triggerRailwayTransition(); }}
          >
            鉄研
          </button>

          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link nav-btn" onClick={() => setIsMenuOpen(false)}>
                マイページ
              </Link>
              <button onClick={handleLogout} className="nav-link nav-btn-outline">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link nav-btn" onClick={() => setIsMenuOpen(false)}>ログイン</Link>
              <Link to="/register" className="nav-link nav-btn-outline" onClick={() => setIsMenuOpen(false)}>新規登録</Link>
            </>
          )}

          <LanguageSwitcher />

          {/* Theme Selector */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="theme-select"
            title="テーマを選択"
          >
            {THEMES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </nav>
      </div>
      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: var(--color-surface, rgba(255, 255, 255, 0.9));
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-border);
          z-index: 1000;
          padding: 0.8rem 0;
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          /* Ensure logo doesn't shrink or break layout */
          flex-shrink: 0;
          margin-right: 1.5rem;
          position: static; /* Explicitly static per fix request */
        }
        .logo-img {
          height: 48px;
          object-fit: contain;
          position: static; /* Explicitly static */
        }
        .nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          /* Ensure nav works with flex parent */
          flex: 1;
          justify-content: flex-end;
        }
        .nav-link {
          text-decoration: none;
          color: var(--color-text);
          font-weight: 500;
          transition: color 0.2s;
          font-size: 0.95rem;
          cursor: pointer;
          
          /* Nav Collapse Fix */
          white-space: nowrap;
          word-break: keep-all;
          flex-shrink: 0;
        }
        .nav-link:hover {
          color: var(--color-accent);
        }
        .nav-btn {
          background: var(--color-accent);
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 4px;
        }
        .nav-btn:hover {
          background: opacity(0.9);
          color: #fff;
        }
        .nav-btn-outline {
            background: transparent;
            border: 1px solid var(--color-accent);
            color: var(--color-accent);
            padding: 0.4rem 0.9rem;
            border-radius: 4px;
        }
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text);
        }
        .menu-toggle > svg {
            stroke: var(--color-text);
        }
        @media (max-width: 1024px) {
          .menu-toggle { display: block; }
          .nav {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            flex-direction: column;
            background: var(--color-surface);
            padding: 1rem;
            border-bottom: 1px solid var(--color-border);
            display: none;
          }
          .nav-open { display: flex; }
        }
        .theme-select {
          padding: 0.4rem 0.6rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: var(--color-surface);
          color: var(--color-text);
          font-size: 0.85rem;
          cursor: pointer;
          outline: none;
        }
        .theme-select:hover {
          border-color: var(--color-accent);
        }
      `}</style>
    </header>
  );
}
