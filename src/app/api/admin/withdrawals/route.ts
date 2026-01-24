import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const withdrawals = await prisma.withdrawal.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        balance: true,
                        depositLink: true
                    }
                }
            }
        });

        return NextResponse.json({ withdrawals });
    } catch (error) {
        console.error('Admin get withdrawals error:', error);
        return NextResponse.json({ error: 'Failed to get withdrawals' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { withdrawalId, status } = await request.json();

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: withdrawalId }
        });

        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        // Update withdrawal status
        const updatedWithdrawal = await prisma.withdrawal.update({
            where: { id: withdrawalId },
            data: { status }
        });

        // If approved, deduct from user balance
        if (status === 'approved' && withdrawal.status !== 'approved') {
            await prisma.user.update({
                where: { id: withdrawal.userId },
                data: { balance: { decrement: withdrawal.amount } }
            });
        }

        return NextResponse.json({ withdrawal: updatedWithdrawal });
    } catch (error) {
        console.error('Admin update withdrawal error:', error);
        return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
    }
}
