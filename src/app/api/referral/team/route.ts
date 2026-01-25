import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's referral code
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { referralCode: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get direct referrals (team members)
        const teamMembers = await prisma.user.findMany({
            where: { referredBy: session.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                isVerified: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate earnings (simple: $2 per verified referral)
        const verifiedReferrals = teamMembers.filter(m => m.isVerified);
        const totalEarnings = verifiedReferrals.length * 2;

        // Member stats
        const memberStats = teamMembers.map(member => ({
            id: member.id,
            name: member.name || 'Anonymous',
            email: member.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
            joinedAt: member.createdAt,
            isActive: member.isVerified,
            totalEarnings: member.isVerified ? 2 : 0
        }));

        return NextResponse.json({
            referralCode: user.referralCode,
            stats: {
                totalReferrals: teamMembers.length,
                activeReferrals: verifiedReferrals.length,
                totalEarnings,
                todayEarnings: 0
            },
            teamMembers: memberStats,
            dailyCommissions: {}
        });
    } catch (error) {
        console.error('Team API error:', error);
        return NextResponse.json({ error: 'Failed to get team data' }, { status: 500 });
    }
}
