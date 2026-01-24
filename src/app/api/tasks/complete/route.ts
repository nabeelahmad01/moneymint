import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Commission rates for each level
const COMMISSION_RATES = {
    level1: 0.10,  // 10% for direct referrer
    level2: 0.05,  // 5% for level 2
    level3: 0.02   // 2% for level 3
};

// Calculate user's daily earning limit based on deposits
async function getDailyEarningLimit(userId: string): Promise<number> {
    const approvedDeposits = await prisma.deposit.aggregate({
        where: { userId, status: 'approved' },
        _sum: { amount: true }
    });
    const totalDeposits = approvedDeposits._sum.amount || 0;
    // Daily limit = total deposits / 30 (30-day ROI)
    return totalDeposits / 30;
}

// Get today's earnings
async function getTodayEarnings(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = await prisma.taskHistory.aggregate({
        where: { userId, completedAt: { gte: today } },
        _sum: { earned: true }
    });
    return todayTasks._sum.earned || 0;
}

// Pay multi-level commissions
async function payMultiLevelCommissions(userId: string, taskReward: number, taskTitle: string) {
    // Get user's referrer chain
    let currentUserId = userId;
    const levels = ['level1', 'level2', 'level3'] as const;

    for (const level of levels) {
        const user = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { referredBy: true }
        });

        if (!user?.referredBy) break;

        const commission = taskReward * COMMISSION_RATES[level];

        // Pay commission to referrer
        await prisma.user.update({
            where: { id: user.referredBy },
            data: { balance: { increment: commission } }
        });

        // Record commission
        await prisma.referralCommission.create({
            data: {
                receiverId: user.referredBy,
                generatorId: userId,
                amount: commission,
                type: 'task_commission',
                description: `${level === 'level1' ? '10%' : level === 'level2' ? '5%' : '2%'} commission from: ${taskTitle}`
            }
        });

        currentUserId = user.referredBy;
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { taskId } = await request.json();

        // Check if task exists
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task || !task.isActive) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Check if already completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const alreadyCompleted = await prisma.taskHistory.findFirst({
            where: {
                userId: session.userId,
                taskId,
                completedAt: { gte: today }
            }
        });

        if (alreadyCompleted) {
            return NextResponse.json({ error: 'Task already completed today' }, { status: 400 });
        }

        // Check daily earning limit
        const dailyLimit = await getDailyEarningLimit(session.userId);
        const todayEarnings = await getTodayEarnings(session.userId);

        if (dailyLimit <= 0) {
            return NextResponse.json({
                error: 'Please make a deposit first to start earning. Minimum deposit: $30'
            }, { status: 400 });
        }

        if (todayEarnings >= dailyLimit) {
            return NextResponse.json({
                error: `Daily earning limit reached ($${dailyLimit.toFixed(2)}). Come back tomorrow!`,
                dailyLimit,
                todayEarnings
            }, { status: 400 });
        }

        // Calculate actual reward (may be capped)
        const remainingLimit = dailyLimit - todayEarnings;
        const actualReward = Math.min(task.reward, remainingLimit);

        // Complete task and add reward
        await prisma.$transaction([
            prisma.taskHistory.create({
                data: {
                    userId: session.userId,
                    taskId,
                    earned: actualReward,
                }
            }),
            prisma.user.update({
                where: { id: session.userId },
                data: { balance: { increment: actualReward } }
            })
        ]);

        // Pay multi-level commissions
        await payMultiLevelCommissions(session.userId, actualReward, task.title);

        return NextResponse.json({
            message: 'Task completed!',
            earned: actualReward,
            dailyLimit,
            todayEarnings: todayEarnings + actualReward,
            remainingToday: dailyLimit - todayEarnings - actualReward
        });
    } catch (error) {
        console.error('Complete task error:', error);
        return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
    }
}

