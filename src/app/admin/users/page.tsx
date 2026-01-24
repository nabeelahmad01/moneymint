'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    name: string;
    balance: number;
    depositLink: string | null;
    referralCode: string;
    isVerified: boolean;
    createdAt: string;
    _count: {
        deposits: number;
        withdrawals: number;
        taskHistory: number;
    };
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editData, setEditData] = useState({ balance: '', depositLink: '', name: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setEditData({
            balance: user.balance.toString(),
            depositLink: user.depositLink || '',
            name: user.name || '',
        });
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;
        setSaving(true);

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    ...editData,
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setSaving(false);
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
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-white">←</Link>
                    <h1 className="text-xl font-bold">👥 Manage Users</h1>
                </div>
            </header>

            <main className="container py-6">
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Balance</th>
                                    <th>Tasks</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div>
                                                <p className="font-medium">{user.name || 'No name'}</p>
                                                <p className="text-sm text-gray-400">{user.email}</p>
                                                <p className="text-xs text-gray-500">Ref: {user.referralCode}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-primary font-bold">${user.balance.toFixed(2)}</span>
                                        </td>
                                        <td>
                                            <span className="text-gray-400">{user._count.taskHistory}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.isVerified ? 'badge-approved' : 'badge-pending'}`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="btn btn-secondary py-1 px-3 text-sm"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="card w-full max-w-md animate-fade-in">
                        <h2 className="font-bold text-lg mb-4">Edit User</h2>
                        <p className="text-gray-400 mb-4">{selectedUser.email}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Balance ($)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={editData.balance}
                                    onChange={(e) => setEditData({ ...editData, balance: e.target.value })}
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Deposit Link</label>
                                <input
                                    type="url"
                                    className="input"
                                    value={editData.depositLink}
                                    onChange={(e) => setEditData({ ...editData, depositLink: e.target.value })}
                                    placeholder="User's Binance deposit link"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="btn btn-primary flex-1"
                                    disabled={saving}
                                >
                                    {saving ? '...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
