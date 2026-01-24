'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
    totalUsers: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    totalDeposits: number;
    totalWithdrawals: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setStats(data.stats);
        } catch (error) {
            console.error('Fetch error:', error);
            router.push('/login');
        } finally {
            setLoading(false);
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

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">👑</span>
                        <span className="font-bold text-lg gradient-text">Admin Dashboard</span>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm">
                        Logout
                    </button>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card text-center">
                        <div className="text-3xl mb-2">👥</div>
                        <p className="text-2xl font-bold text-primary">{stats?.totalUsers || 0}</p>
                        <p className="text-gray-400 text-sm">Total Users</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl mb-2">⏳</div>
                        <p className="text-2xl font-bold text-yellow-400">{stats?.pendingDeposits || 0}</p>
                        <p className="text-gray-400 text-sm">Pending Deposits</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl mb-2">💸</div>
                        <p className="text-2xl font-bold text-orange-400">{stats?.pendingWithdrawals || 0}</p>
                        <p className="text-gray-400 text-sm">Pending Withdrawals</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl mb-2">💰</div>
                        <p className="text-2xl font-bold text-green-400">${stats?.totalDeposits.toFixed(2) || '0.00'}</p>
                        <p className="text-gray-400 text-sm">Total Deposits</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-bold">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/users" className="card card-hover text-center">
                        <div className="text-4xl mb-3">👥</div>
                        <h3 className="font-bold text-lg">Manage Users</h3>
                        <p className="text-gray-400 text-sm">View and update user details</p>
                    </Link>
                    <Link href="/admin/deposits" className="card card-hover text-center">
                        <div className="text-4xl mb-3">💳</div>
                        <h3 className="font-bold text-lg">Deposits</h3>
                        <p className="text-gray-400 text-sm">Approve or reject deposits</p>
                        {stats?.pendingDeposits ? (
                            <span className="badge badge-pending mt-2">{stats.pendingDeposits} pending</span>
                        ) : null}
                    </Link>
                    <Link href="/admin/withdrawals" className="card card-hover text-center">
                        <div className="text-4xl mb-3">💸</div>
                        <h3 className="font-bold text-lg">Withdrawals</h3>
                        <p className="text-gray-400 text-sm">Process withdrawal requests</p>
                        {stats?.pendingWithdrawals ? (
                            <span className="badge badge-pending mt-2">{stats.pendingWithdrawals} pending</span>
                        ) : null}
                    </Link>
                </div>

                {/* Summary */}
                <div className="card gradient-bg">
                    <h3 className="font-bold text-lg mb-4">💼 Financial Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400">Total Deposits (Approved)</p>
                            <p className="text-2xl font-bold text-green-400">
                                ${stats?.totalDeposits.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Total Withdrawals (Approved)</p>
                            <p className="text-2xl font-bold text-red-400">
                                ${stats?.totalWithdrawals.toFixed(2) || '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
