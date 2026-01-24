import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [
            totalUsers,
            pendingDeposits,
            pendingWithdrawals,
            totalDeposits,
            totalWithdrawals
        ] = await Promise.all([
            prisma.user.count({ where: { isAdmin: false } }),
            prisma.deposit.count({ where: { status: 'pending' } }),
            prisma.withdrawal.count({ where: { status: 'pending' } }),
            prisma.deposit.aggregate({
                where: { status: 'approved' },
                _sum: { amount: true }
            }),
            prisma.withdrawal.aggregate({
                where: { status: 'approved' },
                _sum: { amount: true }
            })
        ]);

        return NextResponse.json({
            stats: {
                totalUsers,
                pendingDeposits,
                pendingWithdrawals,
                totalDeposits: totalDeposits._sum.amount || 0,
                totalWithdrawals: totalWithdrawals._sum.amount || 0
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
    }
}
