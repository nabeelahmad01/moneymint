import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateOTP, generateReferralCode } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, referralCode } = await request.json();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Generate unique referral code
        let newReferralCode = generateReferralCode();
        while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } })) {
            newReferralCode = generateReferralCode();
        }

        // Check referral code if provided
        let referredById: string | null = null;
        if (referralCode) {
            const referrer = await prisma.user.findUnique({
                where: { referralCode: referralCode.toUpperCase() }
            });
            if (referrer) {
                referredById = referrer.id;
            }
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                referralCode: newReferralCode,
                referredBy: referredById,
                isVerified: false,
            }
        });

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.oTP.create({
            data: {
                email,
                code: otp,
                type: 'signup',
                expiresAt,
            }
        });

        // Send OTP email
        await sendOTPEmail(email, otp, 'signup');

        return NextResponse.json({
            message: 'OTP sent to your email',
            userId: user.id,
        });
    } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Signup failed', details: errorMessage },
            { status: 500 }
        );
    }
}
