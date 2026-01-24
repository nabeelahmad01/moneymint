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

        // Create default tasks if not exists
        const tasksExist = await prisma.task.count();
        if (tasksExist === 0) {
            await prisma.task.createMany({
                data: [
                    { title: 'Watch Video Ad', description: 'Watch a 30 second advertisement', reward: 0.50, type: 'video', icon: '🎬' },
                    { title: 'Complete Survey', description: 'Answer a short survey (5 questions)', reward: 1.00, type: 'survey', icon: '📋' },
                    { title: 'Daily Check-in', description: 'Login daily to claim your reward', reward: 0.25, type: 'daily', icon: '📅' },
                    { title: 'Share on Social', description: 'Share our app on social media', reward: 0.75, type: 'social', icon: '📱' },
                    { title: 'Invite a Friend', description: 'Invite someone using your referral code', reward: 2.00, type: 'referral', icon: '👥' },
                    { title: 'App Review', description: 'Rate our app on store', reward: 1.50, type: 'review', icon: '⭐' },
                ]
            });
        }

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
