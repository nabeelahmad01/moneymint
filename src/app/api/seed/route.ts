import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    try {
        // Create admin user if not exists
        const adminExists = await prisma.user.findUnique({
            where: { email: 'admin@admin.com' }
        });

        if (!adminExists) {
            await prisma.user.create({
                data: {
                    email: 'admin@admin.com',
                    password: await hashPassword('admin123'),
                    name: 'Admin',
                    isAdmin: true,
                    isVerified: true,
                    referralCode: 'ADMIN001',
                    balance: 0,
                }
            });
        }

        // Delete old packages and create new ones
        await prisma.investmentPackage.deleteMany({});

        await prisma.investmentPackage.createMany({
            data: [
                {
                    name: 'Starter Plan',
                    description: 'Perfect for beginners. Low investment, steady returns.',
                    price: 10,
                    dailyReturn: 0.25,
                    totalDays: 30,
                    totalReturn: 7.50,
                    icon: '🌱',
                    color: 'green'
                },
                {
                    name: 'Silver Plan',
                    description: 'Popular choice. Balanced risk and reward.',
                    price: 50,
                    dailyReturn: 1.25,
                    totalDays: 30,
                    totalReturn: 37.50,
                    icon: '🥈',
                    color: 'gray'
                },
                {
                    name: 'Gold Plan',
                    description: 'Higher returns for serious investors.',
                    price: 100,
                    dailyReturn: 2.75,
                    totalDays: 30,
                    totalReturn: 82.50,
                    icon: '🥇',
                    color: 'yellow'
                },
                {
                    name: 'VIP Elite',
                    description: 'Premium package with maximum earning potential.',
                    price: 500,
                    dailyReturn: 12.00,
                    totalDays: 30,
                    totalReturn: 360,
                    icon: '👑',
                    color: 'purple'
                },
                {
                    name: 'Diamond Club',
                    description: 'Ultimate investment tier. Maximum profitability.',
                    price: 1000,
                    dailyReturn: 28.00,
                    totalDays: 30,
                    totalReturn: 840,
                    icon: '💠',
                    color: 'pink'
                }
            ]
        });

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
