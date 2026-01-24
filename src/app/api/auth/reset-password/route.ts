import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, code, newPassword } = await request.json();

        // Find OTP
        const otp = await prisma.oTP.findFirst({
            where: {
                email,
                code,
                type: 'reset',
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

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user password
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        // Delete used OTP
        await prisma.oTP.deleteMany({
            where: { email, type: 'reset' }
        });

        return NextResponse.json({
            message: 'Password reset successful',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Password reset failed' },
            { status: 500 }
        );
    }
}
