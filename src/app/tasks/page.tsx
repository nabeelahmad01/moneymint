'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    description: string;
    reward: number;
    type: string;
    icon: string;
    completed: boolean;
}

export default function TasksPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskLoading, setTaskLoading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setTasks(data.tasks || []);
        } catch (error) {
            console.error('Fetch error:', error);
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

            setToast({ message: `Earned $${data.earned.toFixed(2)}!`, type: 'success' });
            fetchTasks();
        } catch (err: unknown) {
            setToast({ message: err instanceof Error ? err.message : 'Failed', type: 'error' });
        } finally {
            setTaskLoading(null);
            setTimeout(() => setToast(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const totalReward = tasks.reduce((acc, t) => acc + (t.completed ? t.reward : 0), 0);

    return (
        <div className="min-h-screen" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header className="glass sticky top-0 z-50 px-4 py-4">
                <div className="container">
                    <h1 className="text-xl font-bold">📋 All Tasks</h1>
                </div>
            </header>

            <main className="container py-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="card text-center">
                        <p className="text-gray-400 text-sm">Completed Today</p>
                        <p className="text-2xl font-bold text-primary">{completedCount}/{tasks.length}</p>
                    </div>
                    <div className="card text-center">
                        <p className="text-gray-400 text-sm">Earned Today</p>
                        <p className="text-2xl font-bold text-green-400">${totalReward.toFixed(2)}</p>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                    {tasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="card card-hover animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{task.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg">{task.title}</h3>
                                        <p className="text-sm text-gray-400">{task.description}</p>
                                        <p className="text-primary font-bold mt-1">${task.reward.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div>
                                    {task.completed ? (
                                        <div className="text-center">
                                            <span className="text-3xl">✅</span>
                                            <p className="text-xs text-gray-400 mt-1">Completed</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => completeTask(task.id)}
                                            className="btn btn-primary"
                                            disabled={taskLoading === task.id}
                                        >
                                            {taskLoading === task.id ? '...' : 'Complete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
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

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
