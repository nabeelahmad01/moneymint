import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tasks = await prisma.task.findMany({
            where: { isActive: true },
            orderBy: { reward: 'desc' }
        });

        // Get user's completed tasks for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedToday = await prisma.taskHistory.findMany({
            where: {
                userId: session.userId,
                completedAt: { gte: today }
            },
            select: { taskId: true }
        });

        const completedTaskIds = completedToday.map(t => t.taskId);

        const tasksWithStatus = tasks.map(task => ({
            ...task,
            completed: completedTaskIds.includes(task.id)
        }));

        return NextResponse.json({ tasks: tasksWithStatus });
    } catch (error) {
        console.error('Get tasks error:', error);
        return NextResponse.json({ error: 'Failed to get tasks' }, { status: 500 });
    }
}
