'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    balance: number;
    depositLink: string | null;
}

interface Withdrawal {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
}

export default function WithdrawPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, withdrawRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/withdrawals')
            ]);

            if (!userRes.ok) {
                router.push('/login');
                return;
            }

            const userData = await userRes.json();
            const withdrawData = await withdrawRes.json();

            setUser(userData.user);
            setWithdrawals(withdrawData.withdrawals || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/withdrawals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed');
            }

            setSuccess('Withdrawal request submitted!');
            setAmount('');
            fetchData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white">←</Link>
                    <h1 className="text-xl font-bold">💸 Withdraw</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Balance Card */}
                <div className="card gradient-bg text-center">
                    <p className="text-gray-400">Available Balance</p>
                    <p className="text-4xl font-bold text-primary">${user?.balance.toFixed(2)}</p>
                </div>

                {/* Deposit Link Warning */}
                {!user?.depositLink && (
                    <div className="card bg-yellow-500/10 border-yellow-500/50">
                        <p className="text-yellow-400 text-sm">
                            ⚠️ Please set your deposit link in <Link href="/settings" className="underline">Profile</Link> before requesting withdrawal.
                        </p>
                    </div>
                )}

                {/* Withdraw Form */}
                <div className="card">
                    <h2 className="font-bold text-lg mb-4">Request Withdrawal</h2>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="Enter withdrawal amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="1"
                                max={user?.balance || 0}
                                step="0.01"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Min: $1.00 | Max: ${user?.balance.toFixed(2)}
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={submitting || !user?.depositLink}
                        >
                            {submitting ? <span className="spinner"></span> : 'Request Withdrawal'}
                        </button>
                    </form>
                </div>

                {/* Withdrawal History */}
                <div>
                    <h2 className="font-bold text-lg mb-4">📜 Withdrawal History</h2>
                    {withdrawals.length === 0 ? (
                        <div className="card text-center text-gray-400">
                            No withdrawals yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {withdrawals.map((withdrawal) => (
                                <div key={withdrawal.id} className="card flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">${withdrawal.amount.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`badge badge-${withdrawal.status}`}>
                                        {withdrawal.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
