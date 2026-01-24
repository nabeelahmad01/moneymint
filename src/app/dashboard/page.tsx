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
    depositLink: string | null;
}

interface Task {
    id: string;
    title: string;
    description: string;
    reward: number;
    type: string;
    icon: string;
    completed: boolean;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskLoading, setTaskLoading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, tasksRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/tasks')
            ]);

            if (!userRes.ok) {
                router.push('/login');
                return;
            }

            const userData = await userRes.json();
            const tasksData = await tasksRes.json();

            setUser(userData.user);
            setTasks(tasksData.tasks || []);
        } catch (error) {
            console.error('Fetch error:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const completeTask = async (taskId: string) => {
        setTaskLoading(taskId);
        try {
            const res = await fetch('/api/tasks/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed');
            }

            setToast({ message: `🎉 Earned $${data.earned.toFixed(2)}!`, type: 'success' });
            fetchData();
        } catch (err: unknown) {
            setToast({ message: err instanceof Error ? err.message : 'Failed', type: 'error' });
        } finally {
            setTaskLoading(null);
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
                <div className="text-center">
                    <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
                    <p className="text-gray-400 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    const completedTasks = tasks.filter(t => t.completed).length;
    const availableTasks = tasks.filter(t => !t.completed);

    return (
        <div className="min-h-screen bg-[#0a0a0f]" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="container py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💰</span>
                        <span className="font-bold text-lg gradient-text hide-mobile">MoneyMint</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hide-mobile">
                            <p className="text-xs text-gray-400">Welcome</p>
                            <p className="font-medium">{user?.name}</p>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white p-2">
                            <span className="text-xl">🚪</span>
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
                                <span className="mr-2">💳</span> Deposit
                            </Link>
                            <Link href="/withdraw" className="btn btn-primary flex-1 md:flex-none">
                                <span className="mr-2">💸</span> Withdraw
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-primary">{completedTasks}</p>
                        <p className="text-xs text-gray-400">Done Today</p>
                    </div>
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-yellow-400">{availableTasks.length}</p>
                        <p className="text-xs text-gray-400">Available</p>
                    </div>
                    <div className="card text-center py-4">
                        <p className="text-2xl font-bold text-green-400">${tasks.filter(t => t.completed).reduce((a, b) => a + b.reward, 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">Earned Today</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                    <Link href="/tasks" className="card card-hover text-center py-4">
                        <span className="text-2xl">📋</span>
                        <p className="text-xs text-gray-400 mt-1">Tasks</p>
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
                        <p className="text-xs text-gray-400 mt-1">Profile</p>
                    </Link>
                </div>

                {/* Available Tasks */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Available Tasks</h2>
                        <Link href="/tasks" className="text-primary text-sm hover:underline">View All →</Link>
                    </div>

                    {availableTasks.length === 0 ? (
                        <div className="card text-center py-8">
                            <span className="text-5xl mb-4 block">🎉</span>
                            <p className="text-gray-400">All tasks completed for today!</p>
                            <p className="text-sm text-gray-500">Come back tomorrow for more</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {availableTasks.slice(0, 4).map((task, index) => (
                                <div
                                    key={task.id}
                                    className="card flex items-center gap-4 animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                                        {task.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold truncate">{task.title}</h3>
                                        <p className="text-sm text-gray-400 truncate">{task.description}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-primary font-bold">${task.reward.toFixed(2)}</p>
                                        <button
                                            onClick={() => completeTask(task.id)}
                                            className="btn btn-primary py-1 px-4 text-sm mt-1"
                                            disabled={taskLoading === task.id}
                                        >
                                            {taskLoading === task.id ? '...' : 'Claim'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Referral Banner */}
                <Link href="/referral" className="card block overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="text-4xl">🎁</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">Invite Friends & Earn $2</h3>
                            <p className="text-sm text-gray-400">Your code: <span className="font-mono text-primary">{user?.referralCode}</span></p>
                        </div>
                        <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                    </div>
                </Link>
            </main>

            {/* Bottom Navigation */}
            <nav className="mobile-nav">
                <Link href="/dashboard" className="mobile-nav-item active">
                    <span className="nav-icon">🏠</span>
                    <span>Home</span>
                </Link>
                <Link href="/tasks" className="mobile-nav-item">
                    <span className="nav-icon">💼</span>
                    <span>Tasks</span>
                </Link>
                <Link href="/settings" className="mobile-nav-item">
                    <span className="nav-icon">👤</span>
                    <span>Profile</span>
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
