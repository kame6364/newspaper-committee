import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                onClick={() => changeLanguage('ja')}
                style={{
                    fontWeight: i18n.language === 'ja' ? 'bold' : 'normal',
                    opacity: i18n.language === 'ja' ? 1 : 0.6,
                    border: 'none', background: 'transparent', cursor: 'pointer'
                }}
            >
                JA
            </button>
            <span>/</span>
            <button
                onClick={() => changeLanguage('en')}
                style={{
                    fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                    opacity: i18n.language === 'en' ? 1 : 0.6,
                    border: 'none', background: 'transparent', cursor: 'pointer'
                }}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
