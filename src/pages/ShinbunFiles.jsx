import React, { useEffect, useState } from 'react';
import ConnectLogo from '../components/ConnectLogo';
import usePageTitle from '../hooks/usePageTitle';

const ShinbunFiles = () => {
    usePageTitle('Shinbun Files | 公開資料カタログ');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In production, this URL should be an env var
        const fetchFiles = async () => {
            try {
                const response = await fetch('/api/files/list');
                if (response.ok) {
                    const data = await response.json();
                    setFiles(data);
                } else {
                    console.error('Failed to fetch files');
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <ConnectLogo variant="normal" style={{ height: '60px', marginBottom: '1rem' }} />
                <h1>Shinbun Files Catalog</h1>
                <p className="text-muted">新聞係の公開資料・資産一覧</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center' }}>Loading catalog...</div>
            ) : (
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {files.length === 0 ? (
                        <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>公開ファイルはありません。</p>
                    ) : (
                        files.map((file) => (
                            <div key={file.id} className="card" style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <span className="badge" style={{
                                    background: file.category === 'PDF' ? '#dc3545' : '#007bff',
                                    color: 'white',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                }}>
                                    {file.category}
                                </span>
                                <h3 style={{ margin: '1rem 0 0.5rem' }}>{file.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{file.description}</p>
                                <a
                                    href={file.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        padding: '0.5rem 1rem',
                                        background: '#f8f9fa',
                                        color: '#333',
                                        textDecoration: 'none',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Download / View &rarr;
                                </a>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ShinbunFiles;
