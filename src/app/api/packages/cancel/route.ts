import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { purchaseId } = await request.json();

        if (!purchaseId) {
            return NextResponse.json({ error: 'Purchase ID required' }, { status: 400 });
        }

        // Find the purchase
        const purchase = await prisma.packagePurchase.findUnique({
            where: { id: purchaseId },
            include: {
                package: true
            }
        });

        if (!purchase) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        // Verify ownership
        if (purchase.userId !== session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if already cancelled
        if (purchase.status !== 'active') {
            return NextResponse.json({ error: 'Package is not active' }, { status: 400 });
        }

        // Cancel the package
        await prisma.packagePurchase.update({
            where: { id: purchaseId },
            data: { status: 'cancelled' }
        });

        return NextResponse.json({
            message: `${purchase.package.name} has been cancelled successfully. You will no longer receive daily returns from this package.`,
            success: true
        });
    } catch (error) {
        console.error('Cancel package error:', error);
        return NextResponse.json({ error: 'Failed to cancel package' }, { status: 500 });
    }
}
