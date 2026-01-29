import { useEffect, useState } from 'react';

import { useSettings } from '../context/SettingsContext';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSettings();
  const { stats } = settings;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero">
      {/* Container: Golden Ratio Max Width */}
      <div className="container" style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '100%', position: 'relative', zIndex: 10 }}>

        {/* Content Side (approx 61.8%) */}
        <div style={{ flex: '1.618', paddingRight: '5%' }} className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <span style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '20px',
            background: 'rgba(0,122,255,0.1)', color: '#007AFF', fontWeight: 600, fontSize: '13px', marginBottom: '16px'
          }}>
            {stats.slogan || 'Global News Network'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-sf-pro)', fontSize: '5rem', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: '24px' }}>
            言葉で<br />
            <span style={{ color: '#007AFF' }}>世界</span>を拓く。
          </h1>
          <p style={{ fontSize: '1.5rem', lineHeight: 1.4, color: '#86868b', fontWeight: 500, marginBottom: '40px', maxWidth: '500px' }}>
            新聞係は、日々の出来事を記録し、新しい発見を届けます。<br />
            歴史: {stats.history}年 · 部員: {stats.members}名 · 総発行: {stats.articles || stats.issues}号
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#news" style={{
              borderRadius: '999px', padding: '12px 28px', background: '#007AFF', color: 'white',
              textDecoration: 'none', fontWeight: 600, fontSize: '17px',
              boxShadow: '0 4px 12px rgba(0,122,255,0.3)'
            }}>
              最新号を読む
            </a>
            <a href="#about" style={{
              borderRadius: '999px', padding: '12px 28px', background: 'rgba(0,0,0,0.05)', color: '#1d1d1f',
              textDecoration: 'none', fontWeight: 500, fontSize: '17px'
            }}>
              活動について
            </a>
          </div>
        </div>

        {/* Visual Side (approx 38.2%) */}
        <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }} className={`hero-visual ${isVisible ? 'visible' : ''}`}>
          <div className="liquid-orb"></div>
        </div>

      </div>

      <style>{`
        .hero {
          min-height: 85vh; /* Taller for modern feel */
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: #F5F5F7;
        }
        
        .hero-content {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); /* Apple Ease */
        }
        .hero-content.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .hero-visual {
           opacity: 0;
           transform: scale(0.8) rotate(-10deg);
           transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
        }
        .hero-visual.visible {
           opacity: 1;
           transform: scale(1) rotate(0deg);
        }

        /* Apple Liquid Glass Object */
        .liquid-orb {
            width: 320px;
            height: 320px;
            background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(200,230,255,0.4) 50%, rgba(0,122,255,0.1) 100%);
            border-radius: 50%;
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(255,255,255,0.6);
            box-shadow: 
                inset 0 0 40px rgba(255,255,255,0.8),
                inset 20px 0 60px rgba(0,122,255,0.2),
                0 20px 60px rgba(0,0,0,0.1),
                0 0 0 10px rgba(255,255,255,0.3);
            animation: orbFloat 8s ease-in-out infinite;
            position: relative;
        }
        
        .liquid-orb::after {
            content: '';
            position: absolute;
            top: 10%;
            left: 15%;
            width: 120px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255,255,255,0.9);
            filter: blur(20px);
            transform: rotate(-45deg);
        }

        @keyframes orbFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.02); }
        }

        @media (max-width: 900px) {
            .container { flex-direction: column; text-align: center; padding: 40px 20px; }
            .hero-content { padding-right: 0 !important; margin-bottom: 60px; }
            h1 { font-size: 3.5rem !important; }
            .hero-visual { width: 100%; }
        }
      `}</style>
    </section>
  );
}
