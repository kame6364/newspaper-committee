import React from 'react';
import usePageTitle from '../hooks/usePageTitle';

const RailwayPage = () => {
    usePageTitle('鉄道研究部');

    return (
        <div className="railway-page" style={{
            padding: '2rem',
            textAlign: 'center',
            background: '#f0f0f0',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', borderBottom: '4px double #333', paddingBottom: '1rem', textTransform: 'uppercase' }}>
                Railway Research Club
            </h1>
            <p style={{ marginTop: '1rem', fontSize: '1.2rem', letterSpacing: '0.1em' }}>
                次の停車駅は、未来です。
            </p>
            <div style={{ marginTop: '3rem', fontSize: '5rem' }}>
                🚂🚃🚃🚃
            </div>

            <button onClick={() => window.history.back()} style={{ marginTop: '3rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                戻る
            </button>
        </div>
    );
};

export default RailwayPage;
