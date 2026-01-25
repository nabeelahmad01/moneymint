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
    totalEarnings: number;
}

interface TeamData {
    referralCode: string;
    stats: {
        totalReferrals: number;
        activeReferrals: number;
        totalEarnings: number;
    };
    teamMembers: TeamMember[];
}

export default function ReferralPage() {
    const router = useRouter();
    const [data, setData] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/referral/team');
            const result = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error(result.error);
            }

            setData(result);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load referral data');
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
                title: 'Join EarnTask',
                text: 'Sign up and earn rewards!',
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
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] gap-4">
                <p className="text-red-400">{error}</p>
                <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] pb-24">
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="container py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white">←</Link>
                    <h1 className="text-xl font-bold">👥 Team & Referrals</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Referral Code Card */}
                <div className="card gradient-bg text-center">
                    <div className="text-5xl mb-4">🎁</div>
                    <p className="text-gray-400 mb-2">Your Referral Code</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl font-bold text-primary tracking-wider">
                            {data?.referralCode}
                        </span>
                        <button
                            onClick={copyCode}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                        >
                            {copied ? '✅' : '📋'}
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        Share this code and earn $2 for each verified friend!
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-primary">{data?.stats.totalReferrals || 0}</p>
                        <p className="text-xs text-gray-400">Total Team</p>
                    </div>
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-green-400">{data?.stats.activeReferrals || 0}</p>
                        <p className="text-xs text-gray-400">Active</p>
                    </div>
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-yellow-400">${data?.stats.totalEarnings || 0}</p>
                        <p className="text-xs text-gray-400">Earned</p>
                    </div>
                </div>

                {/* Team Members */}
                <div>
                    <h2 className="font-bold text-lg mb-4">Team Members</h2>
                    {data?.teamMembers && data.teamMembers.length > 0 ? (
                        <div className="space-y-3">
                            {data.teamMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="card flex items-center justify-between animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{member.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(member.joinedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-400 font-bold">+${member.totalEarnings}</p>
                                        <span className={`text-xs ${member.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                                            {member.isActive ? 'Active' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8">
                            <div className="text-5xl mb-4">👥</div>
                            <p className="text-gray-400">No team members yet</p>
                            <p className="text-sm text-gray-500">Share your code to invite friends!</p>
                        </div>
                    )}
                </div>

                {/* Share Button */}
                <button onClick={shareLink} className="btn btn-primary w-full py-4">
                    Share Referral Link 🚀
                </button>
            </main>

            {/* Mobile Navigation */}
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
                <Link href="/settings" className="mobile-nav-item">
                    <span>⚙️</span>
                    Settings
                </Link>
            </nav>
        </div>
    );
}
