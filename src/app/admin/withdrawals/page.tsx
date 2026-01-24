'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Withdrawal {
    id: string;
    amount: number;
    userDepositLink: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        name: string;
        balance: number;
        depositLink: string | null;
    };
}

export default function AdminWithdrawalsPage() {
    const router = useRouter();
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            const res = await fetch('/api/admin/withdrawals');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setWithdrawals(data.withdrawals || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (withdrawalId: string, status: string) => {
        setActionLoading(withdrawalId);
        try {
            const res = await fetch('/api/admin/withdrawals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ withdrawalId, status }),
            });

            if (!res.ok) throw new Error('Failed');
            fetchWithdrawals();
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    const pending = withdrawals.filter(w => w.status === 'pending');
    const processed = withdrawals.filter(w => w.status !== 'pending');

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-white">←</Link>
                    <h1 className="text-xl font-bold">💸 Manage Withdrawals</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Pending Withdrawals */}
                <div>
                    <h2 className="text-lg font-bold mb-4">⏳ Pending Withdrawals ({pending.length})</h2>
                    {pending.length === 0 ? (
                        <div className="card text-center text-gray-400">No pending withdrawals</div>
                    ) : (
                        <div className="space-y-4">
                            {pending.map((withdrawal) => (
                                <div key={withdrawal.id} className="card">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-primary">
                                                    ${withdrawal.amount.toFixed(2)}
                                                </span>
                                                <span className="badge badge-pending ml-3">{withdrawal.status}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">User</p>
                                                <p className="font-medium">{withdrawal.user.email}</p>
                                                <p className="text-gray-500">{withdrawal.user.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Current Balance</p>
                                                <p className="font-medium">${withdrawal.user.balance.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                                            <p className="text-xs text-gray-400 mb-1">Send payment to:</p>
                                            <a
                                                href={withdrawal.userDepositLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline break-all"
                                            >
                                                {withdrawal.userDepositLink}
                                            </a>
                                        </div>

                                        <div className="flex gap-3">
                                            <a
                                                href={withdrawal.userDepositLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary flex-1"
                                            >
                                                Open Link 🔗
                                            </a>
                                            <button
                                                onClick={() => updateStatus(withdrawal.id, 'approved')}
                                                className="btn btn-success flex-1"
                                                disabled={actionLoading === withdrawal.id}
                                            >
                                                {actionLoading === withdrawal.id ? '...' : 'Mark Paid ✓'}
                                            </button>
                                            <button
                                                onClick={() => updateStatus(withdrawal.id, 'rejected')}
                                                className="btn btn-danger flex-1"
                                                disabled={actionLoading === withdrawal.id}
                                            >
                                                Reject
                                            </button>
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            Requested: {new Date(withdrawal.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Processed Withdrawals */}
                <div>
                    <h2 className="text-lg font-bold mb-4">✅ Processed Withdrawals</h2>
                    <div className="card">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processed.map((withdrawal) => (
                                        <tr key={withdrawal.id}>
                                            <td>{withdrawal.user.email}</td>
                                            <td className="font-bold">${withdrawal.amount.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge badge-${withdrawal.status}`}>
                                                    {withdrawal.status}
                                                </span>
                                            </td>
                                            <td className="text-sm text-gray-400">
                                                {new Date(withdrawal.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
