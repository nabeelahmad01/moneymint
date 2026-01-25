import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const deposits = await prisma.deposit.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        balance: true
                    }
                }
            }
        });

        return NextResponse.json({ deposits });
    } catch (error) {
        console.error('Admin get deposits error:', error);
        return NextResponse.json({ error: 'Failed to get deposits' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { depositId, status } = await request.json();

        const deposit = await prisma.deposit.findUnique({
            where: { id: depositId }
        });

        if (!deposit) {
            return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
        }

        // Update deposit status
        const updatedDeposit = await prisma.deposit.update({
            where: { id: depositId },
            data: { status }
        });

        // If approved, add to user balance
        if (status === 'approved' && deposit.status !== 'approved') {
            await prisma.user.update({
                where: { id: deposit.userId },
                data: { balance: { increment: deposit.amount } }
            });

            // Check if this is user's first deposit for referral bonus
            const user = await prisma.user.findUnique({
                where: { id: deposit.userId },
                select: { referredBy: true }
            });

            // Pay $2 referral bonus to referrer on first deposit
            if (user?.referredBy) {
                const previousApprovedDeposits = await prisma.deposit.count({
                    where: {
                        userId: deposit.userId,
                        status: 'approved',
                        id: { not: depositId }
                    }
                });

                // Only pay bonus if this is the first approved deposit
                if (previousApprovedDeposits === 0) {
                    const REFERRAL_BONUS = 2.00;
                    await prisma.user.update({
                        where: { id: user.referredBy },
                        data: { balance: { increment: REFERRAL_BONUS } }
                    });
                }
            }
        }

        return NextResponse.json({ deposit: updatedDeposit });
    } catch (error) {
        console.error('Admin update deposit error:', error);
        return NextResponse.json({ error: 'Failed to update deposit' }, { status: 500 });
    }
}
