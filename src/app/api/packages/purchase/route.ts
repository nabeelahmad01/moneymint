import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { packageId } = await request.json();

        // Get package details
        const pkg = await prisma.investmentPackage.findUnique({
            where: { id: packageId }
        });

        if (!pkg || !pkg.isActive) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        // Check user balance
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.balance < pkg.price) {
            return NextResponse.json({ error: 'Insufficient balance. Please deposit first.' }, { status: 400 });
        }

        // Count how many active packages of this type user already has
        const activePackagesOfSameType = await prisma.packagePurchase.count({
            where: {
                userId: session.userId,
                packageId: pkg.id,
                status: 'active'
            }
        });

        // Calculate total amount spent on active packages of this type
        const totalSpentOnThisPackage = activePackagesOfSameType * pkg.price;

        // Check if user can afford another one based on their balance
        // Formula: User can only have packages worth <= their total balance
        const totalActivePackagesCost = await prisma.packagePurchase.aggregate({
            where: {
                userId: session.userId,
                status: 'active'
            },
            _sum: {
                amountPaid: true
            }
        });

        const currentTotalInvested = totalActivePackagesCost._sum.amountPaid || 0;

        // Check if adding this package would exceed balance
        if (currentTotalInvested + pkg.price > user.balance) {
            const canBuyCount = Math.floor((user.balance - currentTotalInvested) / pkg.price);
            if (canBuyCount <= 0) {
                return NextResponse.json({
                    error: `You cannot buy more packages. Your balance ($${user.balance.toFixed(2)}) is fully invested ($${currentTotalInvested.toFixed(2)}).`
                }, { status: 400 });
            }
            return NextResponse.json({
                error: `Insufficient balance. You can only buy ${canBuyCount} more package(s) of this type.`
            }, { status: 400 });
        }

        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + pkg.totalDays);

        // Create purchase - DON'T deduct balance, just track investment
        const purchase = await prisma.packagePurchase.create({
            data: {
                userId: session.userId,
                packageId: pkg.id,
                amountPaid: pkg.price,
                dailyReturn: pkg.dailyReturn,
                totalDays: pkg.totalDays,
                expiresAt,
            }
        });

        return NextResponse.json({
            message: 'Package activated successfully! Claim your daily profit.',
            purchase
        });
    } catch (error) {
        console.error('Purchase package error:', error);
        return NextResponse.json({ error: 'Failed to purchase package' }, { status: 500 });
    }
}
