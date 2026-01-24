'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Deposit {
    id: string;
    amount: number;
    transactionId: string;
    screenshot: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        name: string;
        balance: number;
    };
}

export default function AdminDepositsPage() {
    const router = useRouter();
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [viewImage, setViewImage] = useState<string | null>(null);

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const res = await fetch('/api/admin/deposits');
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

    const updateStatus = async (depositId: string, status: string) => {
        setActionLoading(depositId);
        try {
            const res = await fetch('/api/admin/deposits', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ depositId, status }),
            });

            if (!res.ok) throw new Error('Failed');
            fetchDeposits();
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

    const pending = deposits.filter(d => d.status === 'pending');
    const processed = deposits.filter(d => d.status !== 'pending');

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-white">←</Link>
                    <h1 className="text-xl font-bold">💳 Manage Deposits</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Pending Deposits */}
                <div>
                    <h2 className="text-lg font-bold mb-4">⏳ Pending Deposits ({pending.length})</h2>
                    {pending.length === 0 ? (
                        <div className="card text-center text-gray-400">No pending deposits</div>
                    ) : (
                        <div className="space-y-4">
                            {pending.map((deposit) => (
                                <div key={deposit.id} className="card">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl font-bold text-primary">
                                                    ${deposit.amount.toFixed(2)}
                                                </span>
                                                <span className="badge badge-pending">{deposit.status}</span>
                                            </div>
                                            <p className="text-sm"><strong>User:</strong> {deposit.user.email}</p>
                                            <p className="text-sm"><strong>TX ID:</strong> {deposit.transactionId}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(deposit.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => setViewImage(deposit.screenshot)}
                                                className="btn btn-secondary py-1 text-sm"
                                            >
                                                View Screenshot
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(deposit.id, 'approved')}
                                                    className="btn btn-success py-1 text-sm flex-1"
                                                    disabled={actionLoading === deposit.id}
                                                >
                                                    {actionLoading === deposit.id ? '...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(deposit.id, 'rejected')}
                                                    className="btn btn-danger py-1 text-sm flex-1"
                                                    disabled={actionLoading === deposit.id}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Processed Deposits */}
                <div>
                    <h2 className="text-lg font-bold mb-4">✅ Processed Deposits</h2>
                    <div className="card">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Amount</th>
                                        <th>TX ID</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processed.map((deposit) => (
                                        <tr key={deposit.id}>
                                            <td>{deposit.user.email}</td>
                                            <td className="font-bold">${deposit.amount.toFixed(2)}</td>
                                            <td className="text-sm text-gray-400">{deposit.transactionId}</td>
                                            <td>
                                                <span className={`badge badge-${deposit.status}`}>
                                                    {deposit.status}
                                                </span>
                                            </td>
                                            <td className="text-sm text-gray-400">
                                                {new Date(deposit.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Image Modal */}
            {viewImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
                    onClick={() => setViewImage(null)}
                >
                    <div className="max-w-3xl max-h-[90vh] overflow-auto">
                        <Image src={viewImage} alt="Screenshot" className="max-w-full h-auto" width={800} height={600} />
                    </div>
                </div>
            )}
        </div>
    );
}
