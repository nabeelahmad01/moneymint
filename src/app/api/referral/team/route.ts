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
                referralBonusPaid: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        // Get commissions received from each member
        const commissions = await prisma.referralCommission.findMany({
            where: { receiverId: session.userId },
            select: {
                generatorId: true,
                amount: true,
                type: true,
                createdAt: true
            }
        });

        // Calculate earnings per member
        const memberStats = teamMembers.map(member => {
            const memberCommissions = commissions.filter(c => c.generatorId === member.id);
            const totalEarnings = memberCommissions.reduce((sum, c) => sum + c.amount, 0);
            const signupBonus = memberCommissions.find(c => c.type === 'signup_bonus');
            const taskCommissions = memberCommissions.filter(c => c.type === 'task_commission');

            return {
                id: member.id,
                name: member.name || 'Anonymous',
                email: member.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
                joinedAt: member.createdAt,
                isActive: member.referralBonusPaid, // Active = has made deposit
                signupBonusPaid: signupBonus ? signupBonus.amount : 0,
                taskCommissionTotal: taskCommissions.reduce((sum, c) => sum + c.amount, 0),
                totalEarnings
            };
        });

        // Calculate daily commissions (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentCommissions = await prisma.referralCommission.findMany({
            where: {
                receiverId: session.userId,
                createdAt: { gte: sevenDaysAgo }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Group by date
        const dailyCommissions: { [key: string]: number } = {};
        recentCommissions.forEach(c => {
            const dateKey = c.createdAt.toISOString().split('T')[0];
            dailyCommissions[dateKey] = (dailyCommissions[dateKey] || 0) + c.amount;
        });

        // Today's earnings
        const today = new Date().toISOString().split('T')[0];
        const todayEarnings = dailyCommissions[today] || 0;

        // Total stats
        const totalReferrals = teamMembers.length;
        const activeReferrals = memberStats.filter(m => m.isActive).length;
        const totalEarnings = commissions.reduce((sum, c) => sum + c.amount, 0);

        return NextResponse.json({
            referralCode: user.referralCode,
            stats: {
                totalReferrals,
                activeReferrals,
                totalEarnings,
                todayEarnings
            },
            teamMembers: memberStats,
            dailyCommissions
        });
    } catch (error) {
        console.error('Team API error:', error);
        return NextResponse.json({ error: 'Failed to get team data' }, { status: 500 });
    }
}
