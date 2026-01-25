import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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

        // Minimum deposit check
        if (amount < 30) {
            return NextResponse.json({ error: 'Minimum deposit is $30' }, { status: 400 });
        }

        // Convert screenshot to base64 for serverless storage
        const bytes = await screenshot.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Screenshot = `data:${screenshot.type};base64,${buffer.toString('base64')}`;

        // Create deposit record
        const deposit = await prisma.deposit.create({
            data: {
                userId: session.userId,
                amount,
                transactionId,
                screenshot: base64Screenshot,
                status: 'pending'
            }
        });

        return NextResponse.json({
            message: 'Deposit request submitted',
            deposit: { id: deposit.id, amount: deposit.amount, status: deposit.status }
        });
    } catch (error) {
        console.error('Create deposit error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Failed to create deposit', details: errorMessage }, { status: 500 });
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
