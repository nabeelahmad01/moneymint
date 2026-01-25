import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const purchases = await prisma.packagePurchase.findMany({
            where: { userId: session.userId },
            include: { package: true },
            orderBy: { purchasedAt: 'desc' }
        });

        return NextResponse.json({ purchases });
    } catch (error) {
        console.error('Get purchases error:', error);
        return NextResponse.json({ error: 'Failed to get purchases' }, { status: 500 });
    }
}
