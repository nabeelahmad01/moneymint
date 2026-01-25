'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Earning {
    id: string;
    amount: number;
    day: number;
    claimedAt: string;
    purchase: {
        package: {
            name: string;
            icon: string;
        };
    };
}

export default function HistoryPage() {
    const router = useRouter();
    const [earnings, setEarnings] = useState<Earning[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/packages/earnings');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setEarnings(data.earnings || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = earnings.reduce((acc, item) => acc + item.amount, 0);

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
                <div className="container py-4">
                    <h1 className="text-xl font-bold">📊 Earnings History</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Summary */}
                <div className="card gradient-bg text-center">
                    <p className="text-gray-400">Total Earnings from Investments</p>
                    <p className="text-4xl font-bold text-green-400">${totalEarnings.toFixed(2)}</p>
                    <p className="text-sm text-gray-400 mt-2">{earnings.length} claims made</p>
                </div>

                {/* History List */}
                <div>
                    {earnings.length === 0 ? (
                        <div className="card text-center text-gray-400">
                            <div className="text-5xl mb-4">📭</div>
                            <p>No earnings yet</p>
                            <Link href="/packages" className="btn btn-primary mt-4">
                                Start Investing
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {earnings.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="card flex items-center justify-between animate-fade-in"
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{item.purchase.package.icon}</div>
                                        <div>
                                            <p className="font-medium">{item.purchase.package.name}</p>
                                            <p className="text-xs text-gray-500">
                                                Day {item.day} • {new Date(item.claimedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-green-400 font-bold">+${item.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
