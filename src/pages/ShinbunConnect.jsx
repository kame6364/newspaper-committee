import React from 'react';
import usePageTitle from '../hooks/usePageTitle';
import ConnectLogo from '../components/ConnectLogo';
import { useTranslation } from 'react-i18next';

const ShinbunConnect = () => {
    const { t } = useTranslation();
    usePageTitle(`${t('connect.title')} | 5-3 Connect`);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <ConnectLogo variant="normal" style={{ height: '60px', marginBottom: '1rem' }} />
                <h1>{t('connect.title')}</h1>
                <p>{t('connect.subtitle')}</p>
                <div style={styles.statusBadge}>Status: {t('connect.online')}</div>
            </header>

            <div style={styles.content}>
                <div className="card" style={styles.card}>
                    <h3>{t('connect.openChat.title')}</h3>
                    <p>{t('connect.openChat.desc')}</p>
                    {/* translate="no" on button can be optional, but usually UI text should be translated */}
                    <button className="btn-primary" style={styles.button} onClick={() => alert('チャットルームに入室します...')}>
                        {t('connect.openChat.button')}
                    </button>
                </div>

                <div className="card" style={styles.card}>
                    <h3>{t('connect.memberArea.title')}</h3>
                    <p>{t('connect.memberArea.desc')}</p>
                    <button className="btn-secondary" style={styles.button}>
                        {t('connect.memberArea.button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
        textAlign: 'center',
    },
    header: {
        marginBottom: '3rem',
    },
    statusBadge: {
        display: 'inline-block',
        background: '#2ecc71',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        marginTop: '0.5rem',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
    },
    card: {
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    button: {
        marginTop: '1rem',
        width: '100%',
        padding: '0.75rem',
        cursor: 'pointer',
    }
};

export default ShinbunConnect;
