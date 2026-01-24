'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    isActive: boolean;
    signupBonusPaid: number;
    taskCommissionTotal: number;
    totalEarnings: number;
}

interface TeamData {
    referralCode: string;
    stats: {
        totalReferrals: number;
        activeReferrals: number;
        totalEarnings: number;
        todayEarnings: number;
    };
    teamMembers: TeamMember[];
    dailyCommissions: { [key: string]: number };
}

export default function ReferralPage() {
    const router = useRouter();
    const [data, setData] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'team' | 'earnings'>('team');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/referral/team');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        if (data?.referralCode) {
            navigator.clipboard.writeText(data.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareLink = () => {
        const url = `${window.location.origin}/signup?ref=${data?.referralCode}`;
        if (navigator.share) {
            navigator.share({
                title: 'Join MoneyMint',
                text: 'Sign up and earn $2 bonus!',
                url,
            });
        } else {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    // Get last 7 days for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        last7Days.push({
            date: dateKey,
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            amount: data?.dailyCommissions[dateKey] || 0
        });
    }

    const maxDailyAmount = Math.max(...last7Days.map(d => d.amount), 1);

    return (
        <div className="min-h-screen" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container">
                    <h1 className="text-xl font-bold">👥 Team & Referrals</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Referral Code Card */}
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1))', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                    <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Your Referral Code</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em' }}>
                            {data?.referralCode}
                        </span>
                        <button
                            onClick={copyCode}
                            style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
                        >
                            {copied ? '✅' : '📋'}
                        </button>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.75rem' }}>
                        Share this code and earn $2 when they make their first deposit!
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>👥</div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{data?.stats.totalReferrals || 0}</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Total Team</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>✅</div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ade80' }}>{data?.stats.activeReferrals || 0}</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Active Members</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>💵</div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ade80' }}>${data?.stats.totalEarnings.toFixed(2) || '0.00'}</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Total Earnings</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>📅</div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#facc15' }}>${data?.stats.todayEarnings.toFixed(2) || '0.00'}</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Today&apos;s Earnings</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--card)', padding: '0.25rem', borderRadius: '0.75rem' }}>
                    <button
                        onClick={() => setActiveTab('team')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: activeTab === 'team' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'team' ? '#000' : '#9ca3af'
                        }}
                    >
                        👥 Team Members
                    </button>
                    <button
                        onClick={() => setActiveTab('earnings')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: activeTab === 'earnings' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'earnings' ? '#000' : '#9ca3af'
                        }}
                    >
                        📊 Daily Earnings
                    </button>
                </div>

                {/* Team Members Tab */}
                {activeTab === 'team' && (
                    <div>
                        {data?.teamMembers && data.teamMembers.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {data.teamMembers.map((member, index) => (
                                    <div
                                        key={member.id}
                                        className="card"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '3rem',
                                                    height: '3rem',
                                                    borderRadius: '50%',
                                                    background: member.isActive ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #6b7280, #4b5563)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.25rem',
                                                    fontWeight: 700,
                                                    color: '#fff'
                                                }}>
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600 }}>{member.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{member.email}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        Joined: {new Date(member.joinedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontWeight: 700, color: '#4ade80' }}>+${member.totalEarnings.toFixed(2)}</p>
                                                <span style={{
                                                    fontSize: '0.625rem',
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    background: member.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                                    color: member.isActive ? '#4ade80' : '#9ca3af'
                                                }}>
                                                    {member.isActive ? 'Active' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
                                <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>No team members yet</p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Share your code to invite friends!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Daily Earnings Tab */}
                {activeTab === 'earnings' && (
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📈 Last 7 Days</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', gap: '0.5rem' }}>
                            {last7Days.map((day, index) => (
                                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: '0.25rem' }}>
                                        ${day.amount.toFixed(2)}
                                    </p>
                                    <div style={{
                                        width: '100%',
                                        height: `${Math.max((day.amount / maxDailyAmount) * 100, 5)}px`,
                                        background: day.amount > 0 ? 'linear-gradient(180deg, var(--primary), #0099cc)' : 'var(--border)',
                                        borderRadius: '0.25rem',
                                        minHeight: '5px'
                                    }}></div>
                                    <p style={{ fontSize: '0.625rem', color: '#6b7280', marginTop: '0.25rem' }}>{day.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* How it Works */}
                <div className="card">
                    <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>💡 How It Works</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(0, 212, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>1</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500 }}>Share Your Code</p>
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Share your unique referral code with friends</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(0, 212, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>2</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500 }}>Friend Makes First Deposit</p>
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>They sign up and make their first deposit</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(0, 212, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>3</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500 }}>You Earn $2 + 10% Commission</p>
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Get $2 signup bonus + 10% of their task earnings!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share Button */}
                <button onClick={shareLink} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                    Share Referral Link 🚀
                </button>
            </main>

            {/* Bottom Navigation */}
            <nav className="mobile-nav">
                <Link href="/dashboard" className="mobile-nav-item">
                    <span className="nav-icon">??</span>
                    <span>Home</span>
                </Link>
                <Link href="/tasks" className="mobile-nav-item">
                    <span className="nav-icon">??</span>
                    <span>Tasks</span>
                </Link>
                <Link href="/settings" className="mobile-nav-item">
                    <span className="nav-icon">??</span>
                    <span>Profile</span>
                </Link>
            </nav>
        </div>
    );
}
