import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const history = await prisma.taskHistory.findMany({
            where: { userId: session.userId },
            include: { task: true },
            orderBy: { completedAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ history });
    } catch (error) {
        console.error('Get history error:', error);
        return NextResponse.json({ error: 'Failed to get history' }, { status: 500 });
    }
}
