import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { purchaseId } = await request.json();

        // Get purchase details
        const purchase = await prisma.packagePurchase.findUnique({
            where: { id: purchaseId },
            include: { package: true }
        });

        if (!purchase) {
            return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
        }

        if (purchase.userId !== session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (purchase.status !== 'active') {
            return NextResponse.json({ error: 'This package is no longer active' }, { status: 400 });
        }

        // Get UTC start of today
        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

        // Start checking from beginning of today in UTC
        const todayEarning = await prisma.dailyEarning.findFirst({
            where: {
                purchaseId,
                claimedAt: { gte: startOfDay }
            }
        });

        if (todayEarning) {
            // Calculate time until next claim (midnight UTC)
            const tomorrow = new Date(startOfDay);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const timeLeft = tomorrow.getTime() - now.getTime();
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

            return NextResponse.json({
                error: `Already claimed today. Come back in ${hoursLeft} hours.`
            }, { status: 400 });
        }

        // Check if all days completed
        if (purchase.daysCompleted >= purchase.totalDays) {
            await prisma.packagePurchase.update({
                where: { id: purchaseId },
                data: { status: 'completed' }
            });
            return NextResponse.json({ error: 'All earnings have been claimed for this package' }, { status: 400 });
        }

        const nextDay = purchase.daysCompleted + 1;
        const earnAmount = purchase.dailyReturn;

        // Create earning and update balance
        await prisma.$transaction([
            prisma.dailyEarning.create({
                data: {
                    userId: session.userId,
                    purchaseId,
                    amount: earnAmount,
                    day: nextDay,
                }
            }),
            prisma.packagePurchase.update({
                where: { id: purchaseId },
                data: {
                    daysCompleted: { increment: 1 },
                    totalEarned: { increment: earnAmount },
                    status: nextDay >= purchase.totalDays ? 'completed' : 'active'
                }
            }),
            prisma.user.update({
                where: { id: session.userId },
                data: { balance: { increment: earnAmount } }
            })
        ]);

        return NextResponse.json({
            message: `Claimed $${earnAmount.toFixed(2)} for Day ${nextDay}!`,
            earned: earnAmount,
            day: nextDay,
            remainingDays: purchase.totalDays - nextDay
        });
    } catch (error) {
        console.error('Claim earning error:', error);
        return NextResponse.json({ error: 'Failed to claim earning' }, { status: 500 });
    }
}
