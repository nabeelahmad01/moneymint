import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount } = await request.json();

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.depositLink) {
            return NextResponse.json({ error: 'Please set your deposit link first' }, { status: 400 });
        }

        if (amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        if (amount > user.balance) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Create withdrawal request
        const withdrawal = await prisma.withdrawal.create({
            data: {
                userId: session.userId,
                amount,
                userDepositLink: user.depositLink,
                status: 'pending'
            }
        });

        return NextResponse.json({
            message: 'Withdrawal request submitted',
            withdrawal
        });
    } catch (error) {
        console.error('Create withdrawal error:', error);
        return NextResponse.json({ error: 'Failed to create withdrawal' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ withdrawals });
    } catch (error) {
        console.error('Get withdrawals error:', error);
        return NextResponse.json({ error: 'Failed to get withdrawals' }, { status: 500 });
    }
}
