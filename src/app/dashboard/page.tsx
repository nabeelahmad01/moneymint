'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    name: string;
    balance: number;
    referralCode: string;
}

interface Purchase {
    id: string;
    amountPaid: number;
    dailyReturn: number;
    totalDays: number;
    daysCompleted: number;
    totalEarned: number;
    status: string;
    purchasedAt: string;
    package: {
        name: string;
        icon: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [claimLoading, setClaimLoading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, purchasesRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/packages/my-purchases')
            ]);

            if (!userRes.ok) {
                router.push('/login');
                return;
            }

            const userData = await userRes.json();
            const purchasesData = await purchasesRes.json();

            setUser(userData.user);
            setPurchases(purchasesData.purchases || []);
        } catch (error) {
            console.error('Fetch error:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const claimEarning = async (purchaseId: string) => {
        setClaimLoading(purchaseId);
        try {
            const res = await fetch('/api/packages/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchaseId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed');
            }

            setToast({ message: data.message, type: 'success' });
            fetchData();
        } catch (err: unknown) {
            setToast({ message: err instanceof Error ? err.message : 'Failed', type: 'error' });
        } finally {
            setClaimLoading(null);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const [modal, setModal] = useState<{ isOpen: boolean; purchaseId: string; packageName: string } | null>(null);

    const openCancelModal = (purchaseId: string, packageName: string) => {
        setModal({ isOpen: true, purchaseId, packageName });
    };

    const confirmCancel = async () => {
        if (!modal) return;

        const { purchaseId } = modal;
        setClaimLoading(purchaseId);
        setModal(null);

        try {
            const res = await fetch('/api/packages/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchaseId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed');
            }

            setToast({ message: data.message, type: 'success' });
            fetchData();
        } catch (err: unknown) {
            setToast({ message: err instanceof Error ? err.message : 'Failed', type: 'error' });
        } finally {
            setClaimLoading(null);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    const activePurchases = purchases.filter(p => p.status === 'active');
    const totalInvested = purchases.reduce((a, b) => a + b.amountPaid, 0);
    const totalEarned = purchases.reduce((a, b) => a + b.totalEarned, 0);

    return (
        <div className="min-h-screen bg-[#0a0a0f]" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="container py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💰</span>
                        <span className="font-bold text-lg gradient-text hide-mobile">EarnTask</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hide-mobile">
                            <p className="text-xs text-gray-400">Welcome</p>
                            <p className="font-medium">{user?.name}</p>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white p-2">
                            🚪
                        </button>
                    </div>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Balance Card */}
                <div className="card overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-gray-400 mb-1">Available Balance</p>
                            <p className="text-4xl md:text-5xl font-bold text-white">${user?.balance.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/deposit" className="btn btn-secondary flex-1 md:flex-none">
                                💳 Deposit
                            </Link>
                            <Link href="/withdraw" className="btn btn-primary flex-1 md:flex-none">
                                💸 Withdraw
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-primary">{activePurchases.length}</p>
                        <p className="text-xs text-gray-400">Active Packages</p>
                    </div>
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-yellow-400">${totalInvested.toFixed(0)}</p>
                        <p className="text-xs text-gray-400">Total Invested</p>
                    </div>
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-green-400">${totalEarned.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">Total Earned</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                    <Link href="/packages" className="card card-hover text-center py-4">
                        <span className="text-2xl">💎</span>
                        <p className="text-xs text-gray-400 mt-1">Invest</p>
                    </Link>
                    <Link href="/referral" className="card card-hover text-center py-4">
                        <span className="text-2xl">👥</span>
                        <p className="text-xs text-gray-400 mt-1">Referral</p>
                    </Link>
                    <Link href="/history" className="card card-hover text-center py-4">
                        <span className="text-2xl">📊</span>
                        <p className="text-xs text-gray-400 mt-1">History</p>
                    </Link>
                    <Link href="/settings" className="card card-hover text-center py-4">
                        <span className="text-2xl">⚙️</span>
                        <p className="text-xs text-gray-400 mt-1">Settings</p>
                    </Link>
                </div>

                {/* Active Investments */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">🔥 Active Investments</h2>
                        <Link href="/packages" className="text-primary text-sm">Buy More →</Link>
                    </div>

                    {activePurchases.length === 0 ? (
                        <div className="card text-center py-8">
                            <span className="text-5xl mb-4 block">💎</span>
                            <p className="text-gray-400 mb-2">No active investments yet</p>
                            <Link href="/packages" className="btn btn-primary">
                                Browse Packages
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {activePurchases.map((purchase, index) => (
                                <div
                                    key={purchase.id}
                                    className="card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{purchase.package.icon}</span>
                                            <div>
                                                <h3 className="font-bold">{purchase.package.name}</h3>
                                                <p className="text-sm text-gray-400">
                                                    Day {purchase.daysCompleted}/{purchase.totalDays}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-400 font-bold">${purchase.dailyReturn.toFixed(2)}/day</p>
                                            <p className="text-xs text-gray-500">Earned: ${purchase.totalEarned.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all"
                                                style={{ width: `${(purchase.daysCompleted / purchase.totalDays) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => claimEarning(purchase.id)}
                                            className="btn btn-primary flex-1"
                                            disabled={claimLoading === purchase.id}
                                        >
                                            {claimLoading === purchase.id ? '...' : `Claim $${purchase.dailyReturn.toFixed(2)}`}
                                        </button>
                                        <button
                                            onClick={() => openCancelModal(purchase.id, purchase.package.name)}
                                            className="btn btn-secondary"
                                            disabled={claimLoading === purchase.id}
                                            title="Cancel Package"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Referral Banner */}
                <Link href="/referral" className="card block overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="text-4xl">🎁</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">Invite Friends & Earn $2</h3>
                            <p className="text-sm text-gray-400">Your code: <span className="font-mono text-primary">{user?.referralCode}</span></p>
                        </div>
                        <span className="text-gray-400 group-hover:text-white">→</span>
                    </div>
                </Link>
            </main>

            {/* Mobile Navigation */}
            <nav className="mobile-nav">
                <Link href="/dashboard" className="mobile-nav-item active">
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

            {/* Custom Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}></div>
                    <div className="card w-full max-w-sm relative z-10 animate-fade-in border-red-500/30">
                        <div className="text-center">
                            <div className="text-5xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold mb-2">Cancel Package?</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to cancel <span className="text-white font-bold">{modal.packageName}</span>?
                                <br />
                                <span className="text-red-400 text-sm block mt-2">
                                    You will stop receiving daily returns.
                                </span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setModal(null)}
                                    className="btn btn-secondary flex-1"
                                >
                                    No, Keep it
                                </button>
                                <button
                                    onClick={confirmCancel}
                                    className="btn btn-danger flex-1"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
