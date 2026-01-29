import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        // Find OTP
        const otp = await prisma.oTP.findFirst({
            where: {
                email,
                code,
                type: 'signup',
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otp) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        // Update user as verified
        const user = await prisma.user.update({
            where: { email },
            data: { isVerified: true }
        });

        // Initial logic removed to prevent immediate bonus. Bonus is now handled in deposit approval.

        // Delete used OTP
        await prisma.oTP.deleteMany({
            where: { email, type: 'signup' }
        });

        return NextResponse.json({
            message: 'Email verified successfully',
            verified: true
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
