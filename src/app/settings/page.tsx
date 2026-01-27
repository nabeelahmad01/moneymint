'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    name: string;
    balance: number;
    depositLink: string | null;
    referralCode: string;
    createdAt: string;
}

interface Stats {
    totalDeposits: number;
    totalWithdrawals: number;
    totalEarnings: number;
    dailyLimit: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<Stats>({ totalDeposits: 0, totalWithdrawals: 0, totalEarnings: 0, dailyLimit: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', depositLink: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setUser(data.user);
            setFormData({
                name: data.user.name || '',
                depositLink: data.user.depositLink || '',
            });

            // Calculate stats
            const dailyLimit = (data.user.totalDeposits || 0) / 30;
            setStats({
                totalDeposits: data.user.totalDeposits || 0,
                totalWithdrawals: data.user.totalWithdrawals || 0,
                totalEarnings: data.user.totalEarnings || 0,
                dailyLimit
            });
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setShowEditForm(false);
            fetchUserData();
        } catch (err: unknown) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';

    return (
        <div className="min-h-screen" style={{ paddingBottom: '100px', background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)' }}>
            {/* Header with Gradient */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 212, 255, 0.1) 100%)',
                padding: '2rem 1.5rem 4rem',
                borderRadius: '0 0 2rem 2rem'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>👤 My Profile</h1>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Manage your account</p>
                </div>
            </div>

            <main className="container" style={{ marginTop: '-2rem', padding: '0 1.5rem' }}>
                {/* Profile Card */}
                <div className="card" style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '5rem',
                            height: '5rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981, #00d4ff)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: '#fff',
                            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                        }}>
                            {user?.name?.[0]?.toUpperCase() || '👤'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{user?.name || 'User'}</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Member since {memberSince}</p>
                        </div>
                        <button
                            onClick={() => setShowEditForm(!showEditForm)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid rgba(16, 185, 129, 0.5)',
                                color: '#10b981',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            ✏️ Edit
                        </button>
                    </div>

                    {/* Edit Form */}
                    {showEditForm && (
                        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Display Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                                    Your USDT Wallet Address (TRC20)
                                    {user?.depositLink && <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>(Locked)</span>}
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. TEggMzn...HEhMg"
                                    value={formData.depositLink}
                                    onChange={(e) => setFormData({ ...formData, depositLink: e.target.value })}
                                    disabled={!!user?.depositLink}
                                    style={{ opacity: user?.depositLink ? 0.6 : 1, fontFamily: 'monospace' }}
                                />
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                    Admin will send your withdrawals to this address
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                                    {saving ? <span className="spinner"></span> : '✓ Save Changes'}
                                </button>
                                <button type="button" onClick={() => setShowEditForm(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {message.text && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                            color: message.type === 'success' ? '#10b981' : '#ef4444',
                            fontSize: '0.875rem'
                        }}>
                            {message.text}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>💰</div>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>${user?.balance?.toFixed(2) || '0.00'}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Balance</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📈</div>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00d4ff' }}>${stats.dailyLimit.toFixed(2)}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Daily Limit</p>
                    </div>
                </div>

                {/* Referral Code */}
                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Your Referral Code</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.15em', color: '#a855f7' }}>{user?.referralCode}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Earn 10% commission on Level 1 referrals!</p>
                </div>

                {/* Quick Actions */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>⚡ Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                        <Link href="/deposit" style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            padding: '1rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)', textDecoration: 'none', color: '#fff'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>💳</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Deposit</span>
                        </Link>
                        <Link href="/withdraw" style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            padding: '1rem', borderRadius: '0.75rem', background: 'rgba(0, 212, 255, 0.1)',
                            border: '1px solid rgba(0, 212, 255, 0.3)', textDecoration: 'none', color: '#fff'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>💸</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Withdraw</span>
                        </Link>
                        <Link href="/referral" style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            padding: '1rem', borderRadius: '0.75rem', background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)', textDecoration: 'none', color: '#fff'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>👥</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>My Team</span>
                        </Link>
                        <Link href="/history" style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            padding: '1rem', borderRadius: '0.75rem', background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)', textDecoration: 'none', color: '#fff'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>📊</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>History</span>
                        </Link>
                    </div>
                </div>

                {/* Account Section */}
                <div className="card" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>⚙️ Account</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link href="/tasks" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.875rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)',
                            textDecoration: 'none', color: '#fff'
                        }}>
                            <span>📋 Available Tasks</span>
                            <span style={{ color: '#6b7280' }}>→</span>
                        </Link>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.875rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)'
                        }}>
                            <span>🔒 Change Password</span>
                            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Coming Soon</span>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.875rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)'
                        }}>
                            <span>🌐 Language</span>
                            <span style={{ color: '#6b7280' }}>English</span>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    🚪 Logout
                </button>
            </main>

            {/* Bottom Navigation */}
            <nav className="mobile-nav">
                <Link href="/dashboard" className="mobile-nav-item">
                    <span>🏠</span>
                    Home
                </Link>
                <Link href="/deposit" className="mobile-nav-item">
                    <span>💳</span>
                    Deposit
                </Link>
                <Link href="/withdraw" className="mobile-nav-item">
                    <span>💸</span>
                    Withdraw
                </Link>
                <Link href="/settings" className="mobile-nav-item active">
                    <span>⚙️</span>
                    Settings
                </Link>
            </nav>
        </div>
    );
}
