import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

const PublicProfile = () => {
    const { username } = useParams();
    usePageTitle(`Profile: ${username}`);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/profile/${username}`);
                if (!res.ok) throw new Error('User not found');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profile...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1rem' }}>
            <div className="card" style={{
                padding: '2rem',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: '#3498db',
                    borderRadius: '50%',
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                }}>
                    {profile.nickname ? profile.nickname[0] : username[0].toUpperCase()}
                </div>

                <h1 style={{ margin: '0 0 0.5rem' }}>{profile.nickname || username}</h1>
                <span style={{
                    background: profile.role === 'admin' ? '#e74c3c' : '#bdc3c7',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem'
                }}>
                    {profile.role.toUpperCase()}
                </span>

                <p style={{ margin: '1.5rem 0', color: '#666', lineHeight: '1.6' }}>
                    {profile.bio || '自己紹介はまだ設定されていません。'}
                </p>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
                    Member since {new Date(profile.joined_at || Date.now()).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
