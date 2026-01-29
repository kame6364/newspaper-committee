import { useSettings } from '../context/SettingsContext';

export default function About() {
  const { settings } = useSettings();
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-subtitle">ABOUT US</span>
            <h2 className="section-title">新聞係について</h2>
            <p className="about-text">
              私たちは学校生活の「今」を記録し、生徒の皆さんに新しい発見と感動を届けることを使命としています。
              日々のニュースから深掘り取材まで、真実を追求し、分かりやすく伝えることに情熱を注いでいます。
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{settings.stats.members}</span>
                <span className="stat-label">Members</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{settings.stats.history}+</span>
                <span className="stat-label">Years History</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{settings.stats.issues}</span>
                <span className="stat-label">Issues/Year</span>
              </div>
            </div>
          </div>
          <div className="about-visual">
            <div className="visual-block block-1"></div>
            <div className="visual-block block-2"></div>
          </div>
        </div>
      </div>
      <style>{`
        .about-section {
          background-color: var(--color-surface);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xl);
          align-items: center;
        }
        .about-text {
          font-size: 1.1rem;
          margin-bottom: var(--spacing-lg);
          color: var(--color-secondary);
        }
        .stats-grid {
          display: flex;
          gap: var(--spacing-lg);
        }
        .stat-item {
          text-align: center;
        }
        .stat-number {
          display: block;
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: var(--spacing-xs);
        }
        .stat-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-secondary);
        }
        .about-visual {
          position: relative;
          height: 400px;
        }
        .visual-block {
          position: absolute;
          background-color: #fff;
          border: 1px solid var(--color-action);
        }
        .block-1 {
          width: 80%;
          height: 80%;
          top: 0;
          right: 0;
          background-color: #ddd; /* Placeholder for image */
          background-image: linear-gradient(135deg, #ddd 25%, transparent 25%), linear-gradient(225deg, #ddd 25%, transparent 25%), linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(315deg, #ddd 25%, transparent 25%);
          background-position:  10px 0, 10px 0, 0 0, 0 0;
          background-size: 20px 20px;
          background-repeat: repeat;
        }
        .block-2 {
          width: 60%;
          height: 60%;
          bottom: 0;
          left: 0;
          background-color: var(--color-text);
          opacity: 0.1;
          z-index: -1;
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
          .about-visual {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
