import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, verifyPassword } from '@/lib/auth';

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

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, password } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        if (!password) {
            return NextResponse.json({ error: 'Password is required to confirm withdrawal' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 400 });
        }

        if (!user.depositLink) {
            return NextResponse.json({ error: 'Please set your USDT wallet address in Settings first' }, { status: 400 });
        }

        if (user.balance < amount) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Calculate balance after withdrawal
        const balanceAfterWithdrawal = user.balance - amount;

        // Get active packages that require more than remaining balance
        const packagesToCancelOrDowngrade = await prisma.packagePurchase.findMany({
            where: {
                userId: session.userId,
                status: 'active',
                amountPaid: { gt: balanceAfterWithdrawal }
            }
        });

        // Cancel packages that exceed new balance
        if (packagesToCancelOrDowngrade.length > 0) {
            await prisma.packagePurchase.updateMany({
                where: {
                    id: { in: packagesToCancelOrDowngrade.map(p => p.id) }
                },
                data: { status: 'cancelled_insufficient_balance' }
            });
        }

        // Create withdrawal and deduct balance
        const [withdrawal] = await prisma.$transaction([
            prisma.withdrawal.create({
                data: {
                    userId: session.userId,
                    amount,
                    userDepositLink: user.depositLink,
                }
            }),
            prisma.user.update({
                where: { id: session.userId },
                data: { balance: { decrement: amount } }
            })
        ]);

        const cancelledCount = packagesToCancelOrDowngrade.length;
        let message = 'Withdrawal request submitted! Admin will process it soon.';
        if (cancelledCount > 0) {
            message += ` Note: ${cancelledCount} package(s) were cancelled due to insufficient balance.`;
        }

        return NextResponse.json({
            message,
            withdrawal,
            cancelledPackages: cancelledCount
        });
    } catch (error) {
        console.error('Create withdrawal error:', error);
        return NextResponse.json({ error: 'Failed to create withdrawal' }, { status: 500 });
    }
}
