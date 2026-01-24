'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.user.isAdmin) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="text-8xl mb-6">💰</div>
                    <h1 className="text-4xl font-bold mb-4 gradient-text">MoneyMint</h1>
                    <p className="text-gray-400 text-lg max-w-md">
                        Complete simple tasks and earn real money. Join thousands of users already earning!
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-8">
                        <div>
                            <div className="text-3xl font-bold text-primary">10K+</div>
                            <div className="text-gray-500 text-sm">Users</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400">$50K+</div>
                            <div className="text-gray-500 text-sm">Paid</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400">24h</div>
                            <div className="text-gray-500 text-sm">Payout</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0a0a0f]" style={{ padding: '2rem 1.5rem', minHeight: '100vh' }}>
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="text-5xl mb-4">💰</div>
                        <h1 className="text-2xl font-bold gradient-text">MoneyMint</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                        <p className="text-gray-400">Login to continue earning rewards</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>Email Address</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            style={{ padding: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>Login <span className="ml-2">→</span></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-primary font-bold hover:underline">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                            <span>🔒 Secure Login</span>
                            <span>•</span>
                            <span>💰 Earn Rewards</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
