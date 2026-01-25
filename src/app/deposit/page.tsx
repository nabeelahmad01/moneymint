'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Deposit {
    id: string;
    amount: number;
    transactionId: string;
    screenshot: string;
    status: string;
    createdAt: string;
}

export default function DepositPage() {
    const router = useRouter();
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        transactionId: '',
    });
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [copied, setCopied] = useState(false);

    const walletAddress = process.env.NEXT_PUBLIC_ADMIN_DEPOSIT_LINK || 'TEggMznQqjGrQbfW5nm1gXukMwNfxHEhMg';

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const res = await fetch('/api/deposits');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setDeposits(data.deposits || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!screenshot) {
            setError('Please upload payment screenshot');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const formDataObj = new FormData();
            formDataObj.append('amount', formData.amount);
            formDataObj.append('transactionId', formData.transactionId);
            formDataObj.append('screenshot', screenshot);

            const res = await fetch('/api/deposits', {
                method: 'POST',
                body: formDataObj,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed');
            }

            setSuccess('Deposit request submitted! Wait for admin approval.');
            setFormData({ amount: '', transactionId: '' });
            setScreenshot(null);
            fetchDeposits();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed');
        } finally {
            setSubmitting(false);
        }
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
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white">←</Link>
                    <h1 className="text-xl font-bold">💳 Deposit</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Wallet Address Card */}
                <div className="card gradient-bg">
                    <div className="text-center mb-4">
                        <span className="text-4xl">💰</span>
                        <h2 className="font-bold text-lg mt-2">Send USDT (TRC20)</h2>
                        <p className="text-sm text-gray-400">Only send USDT on Tron network!</p>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 mb-4">
                        <p className="text-xs text-gray-400 mb-2">Wallet Address:</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm text-primary break-all font-mono">
                                {walletAddress}
                            </code>
                            <button
                                onClick={copyAddress}
                                className="btn btn-secondary py-2 px-3 text-sm"
                            >
                                {copied ? '✅' : '📋'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                        <p className="text-yellow-400 text-sm font-medium">⚠️ Only USDT TRC20</p>
                        <p className="text-xs text-gray-400">Sending other coins will result in loss</p>
                    </div>
                </div>

                {/* How to Deposit */}
                <div className="card">
                    <h2 className="font-bold text-lg mb-3">📌 How to Deposit</h2>
                    <ol className="space-y-2 text-gray-300 text-sm">
                        <li>1. Copy the wallet address above</li>
                        <li>2. Open your Binance/Trust Wallet app</li>
                        <li>3. Send USDT (TRC20) to the address</li>
                        <li>4. Take a screenshot of the payment</li>
                        <li>5. Fill the form below with Transaction ID</li>
                        <li>6. Wait for admin approval (usually 5-30 mins)</li>
                    </ol>
                </div>

                {/* Deposit Form */}
                <div className="card">
                    <h2 className="font-bold text-lg mb-4">Submit Deposit Proof</h2>

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
                                placeholder="Enter deposit amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                min="1"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Transaction ID (TxID)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Paste your transaction ID here"
                                value={formData.transactionId}
                                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Screenshot</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="input"
                                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={submitting}
                        >
                            {submitting ? <span className="spinner"></span> : 'Submit Deposit'}
                        </button>
                    </form>
                </div>

                {/* Deposit History */}
                <div>
                    <h2 className="font-bold text-lg mb-4">📜 Deposit History</h2>
                    {deposits.length === 0 ? (
                        <div className="card text-center text-gray-400">
                            No deposits yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {deposits.map((deposit) => (
                                <div key={deposit.id} className="card flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">${deposit.amount.toFixed(2)}</p>
                                        <p className="text-sm text-gray-400">ID: {deposit.transactionId.slice(0, 12)}...</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(deposit.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`badge badge-${deposit.status}`}>
                                        {deposit.status}
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
                    <span>🏠</span>
                    Home
                </Link>
                <Link href="/deposit" className="mobile-nav-item active">
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
