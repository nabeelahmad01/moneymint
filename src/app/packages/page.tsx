'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    dailyReturn: number;
    totalDays: number;
    totalReturn: number;
    icon: string;
    color: string;
}

interface User {
    balance: number;
}

export default function PackagesPage() {
    const router = useRouter();
    const [packages, setPackages] = useState<Package[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, packagesRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/packages')
            ]);

            if (!userRes.ok) {
                router.push('/login');
                return;
            }

            const userData = await userRes.json();
            const packagesData = await packagesRes.json();

            setUser(userData.user);
            setPackages(packagesData.packages || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const purchasePackage = async (packageId: string, price: number) => {
        if (!user) return;

        if (user.balance < price) {
            setToast({ message: 'Insufficient balance. Please deposit first.', type: 'error' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setPurchasing(packageId);
        try {
            const res = await fetch('/api/packages/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed');
            }

            setToast({ message: '🎉 Package purchased successfully!', type: 'success' });
            fetchData();
        } catch (err: unknown) {
            setToast({ message: err instanceof Error ? err.message : 'Failed', type: 'error' });
        } finally {
            setPurchasing(null);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            green: 'from-green-500/20 to-green-500/5 border-green-500/30',
            gray: 'from-gray-400/20 to-gray-400/5 border-gray-400/30',
            yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
            primary: 'from-primary/20 to-primary/5 border-primary/30',
            purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
            pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
        };
        return colors[color] || colors.primary;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="container py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white mr-2">←</Link>
                        <img src="/logo.png" alt="MoneyMint" className="w-8 h-8 rounded-full" />
                        <h1 className="text-xl font-bold">Investment Packages</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Balance</p>
                        <p className="font-bold text-primary">${user?.balance.toFixed(2)}</p>
                    </div>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Info Banner */}
                <div className="card gradient-bg">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">📈</div>
                        <div>
                            <h2 className="font-bold text-lg">Earn Daily Returns</h2>
                            <p className="text-sm text-gray-400">Purchase a package and claim daily profits for 30 days!</p>
                        </div>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="grid gap-4">
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg.id}
                            className={`card bg-gradient-to-br ${getColorClass(pkg.color)} animate-fade-in`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl">{pkg.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-xl">{pkg.name}</h3>
                                        <p className="text-sm text-gray-400">{pkg.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4 p-3 rounded-xl bg-black/20">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">${pkg.price}</p>
                                    <p className="text-xs text-gray-400">Investment</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-400">${pkg.dailyReturn.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">Daily Return</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">${pkg.totalReturn}</p>
                                    <p className="text-xs text-gray-400">Total ({pkg.totalDays} days)</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <span className="text-gray-400">ROI: </span>
                                    <span className="text-green-400 font-bold">
                                        {((pkg.totalReturn / pkg.price) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <button
                                    onClick={() => purchasePackage(pkg.id, pkg.price)}
                                    className="btn btn-primary"
                                    disabled={purchasing === pkg.id || (user && user.balance < pkg.price)}
                                >
                                    {purchasing === pkg.id ? '...' : user && user.balance < pkg.price ? 'Need Deposit' : 'Buy Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Deposit CTA */}
                <Link href="/deposit" className="card block text-center py-6 gradient-bg">
                    <p className="text-xl mb-2">💳 Need more balance?</p>
                    <p className="text-primary font-bold">Deposit Now →</p>
                </Link>
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

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
