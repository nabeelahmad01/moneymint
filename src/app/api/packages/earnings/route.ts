import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const earnings = await prisma.dailyEarning.findMany({
            where: { userId: session.userId },
            include: {
                purchase: {
                    include: { package: true }
                }
            },
            orderBy: { claimedAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ earnings });
    } catch (error) {
        console.error('Get earnings history error:', error);
        return NextResponse.json({ error: 'Failed to get history' }, { status: 500 });
    }
}
