import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { referralCode: true, referredBy: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Count referrals
        const referralCount = await prisma.user.count({
            where: { referredBy: session.userId }
        });

        // Get referral earnings (assuming $2 per referral)
        const referralEarnings = referralCount * 2;

        return NextResponse.json({
            referralCode: user.referralCode,
            referralCount,
            referralEarnings
        });
    } catch (error) {
        console.error('Get referral stats error:', error);
        return NextResponse.json({ error: 'Failed to get referral stats' }, { status: 500 });
    }
}
