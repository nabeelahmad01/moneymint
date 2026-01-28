'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        referralCode: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0a0a0f]" style={{ padding: '2rem 1.5rem', minHeight: '100vh' }}>
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="text-5xl mb-4">💰</div>
                        <h1 className="text-2xl font-bold gradient-text">MoneyMint</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-gray-400">Start earning money today!</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>Full Name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>Email Address</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>
                                Referral Code
                                <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>(Optional - Get $2 bonus!)</span>
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter referral code"
                                value={formData.referralCode}
                                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            style={{ padding: '1rem', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>Create Account <span className="ml-2">🚀</span></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="text-8xl mb-6">💰</div>
                    <h1 className="text-4xl font-bold mb-4 gradient-text">MoneyMint</h1>
                    <p className="text-gray-400 text-lg max-w-md mb-8">
                        Join now and start earning real money from your phone!
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4 text-left max-w-sm mx-auto">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                            <span className="text-2xl">🎁</span>
                            <div>
                                <div className="font-bold">$2 Welcome Bonus</div>
                                <div className="text-sm text-gray-400">Just for signing up</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <div className="font-bold">Instant Withdrawals</div>
                                <div className="text-sm text-gray-400">Via Binance, 24h payout</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <div className="font-bold">100% Secure</div>
                                <div className="text-sm text-gray-400">Your data is protected</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">Loading...</div>}>
            <SignupContent />
        </Suspense>
    );
}
