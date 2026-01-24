'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter complete OTP');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            setSuccess(true);
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!email) {
            router.push('/signup');
        }
    }, [email, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)' }}>
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="text-5xl mb-4">📧</div>
                    <h1 className="text-3xl font-bold gradient-text">Verify Email</h1>
                    <p className="text-gray-400 mt-2">
                        Enter the 6-digit code sent to<br />
                        <span className="text-primary">{email}</span>
                    </p>
                </div>

                {/* OTP Form */}
                <div className="card" style={{ padding: '2rem', marginBottom: '1rem' }}>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>Email Verified!</h2>
                            <p style={{ color: '#9ca3af', marginTop: '0.75rem' }}>Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {error && (
                                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171', fontSize: '0.875rem' }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        style={{
                                            width: '3rem',
                                            height: '3.5rem',
                                            textAlign: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            background: 'var(--card)',
                                            border: '2px solid var(--border)',
                                            borderRadius: '0.75rem',
                                            color: '#fff',
                                            outline: 'none'
                                        }}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? <span className="spinner"></span> : 'Verify OTP'}
                            </button>
                        </form>
                    )}

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link href="/signup" className="text-primary hover:underline">
                            ← Back to Signup
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="spinner"></span></div>}>
            <VerifyOTPContent />
        </Suspense>
    );
}
