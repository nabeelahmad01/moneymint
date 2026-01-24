import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const amount = parseFloat(formData.get('amount') as string);
        const transactionId = formData.get('transactionId') as string;
        const screenshot = formData.get('screenshot') as File;

        if (!amount || !transactionId || !screenshot) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Save screenshot
        const bytes = await screenshot.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${screenshot.name}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

        await writeFile(uploadPath, buffer);

        // Create deposit record
        const deposit = await prisma.deposit.create({
            data: {
                userId: session.userId,
                amount,
                transactionId,
                screenshot: `/uploads/${fileName}`,
                status: 'pending'
            }
        });

        return NextResponse.json({
            message: 'Deposit request submitted',
            deposit
        });
    } catch (error) {
        console.error('Create deposit error:', error);
        return NextResponse.json({ error: 'Failed to create deposit' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const deposits = await prisma.deposit.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ deposits });
    } catch (error) {
        console.error('Get deposits error:', error);
        return NextResponse.json({ error: 'Failed to get deposits' }, { status: 500 });
    }
}
