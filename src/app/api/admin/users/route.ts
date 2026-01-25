import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            where: { isAdmin: false },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                balance: true,
                depositLink: true,
                referralCode: true,
                isVerified: true,
                createdAt: true,
                _count: {
                    select: {
                        deposits: true,
                        withdrawals: true,
                        purchases: true
                    }
                }
            }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Admin get users error:', error);
        return NextResponse.json({ error: 'Failed to get users' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, balance, depositLink, name } = await request.json();

        const updateData: { balance?: number; depositLink?: string; name?: string } = {};
        if (balance !== undefined) updateData.balance = parseFloat(balance);
        if (depositLink !== undefined) updateData.depositLink = depositLink;
        if (name !== undefined) updateData.name = name;

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Admin update user error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
