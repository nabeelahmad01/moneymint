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
            where: { id: depositId },
            include: {
                user: {
                    select: {
                        id: true,
                        referredBy: true,
                        referralBonusPaid: true
                    }
                }
            }
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

            // Pay referral bonus on first deposit approval
            if (!deposit.user.referralBonusPaid && deposit.user.referredBy) {
                const REFERRAL_BONUS = 2.00; // $2 bonus for direct referral

                // Mark bonus as paid
                await prisma.user.update({
                    where: { id: deposit.userId },
                    data: { referralBonusPaid: true }
                });

                // Give bonus to referrer
                await prisma.user.update({
                    where: { id: deposit.user.referredBy },
                    data: { balance: { increment: REFERRAL_BONUS } }
                });

                // Record the commission
                await prisma.referralCommission.create({
                    data: {
                        receiverId: deposit.user.referredBy,
                        generatorId: deposit.userId,
                        amount: REFERRAL_BONUS,
                        type: 'signup_bonus',
                        description: 'Referral signup bonus - first deposit'
                    }
                });
            }
        }

        return NextResponse.json({ deposit: updatedDeposit });
    } catch (error) {
        console.error('Admin update deposit error:', error);
        return NextResponse.json({ error: 'Failed to update deposit' }, { status: 500 });
    }
}
