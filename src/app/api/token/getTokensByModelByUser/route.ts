import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';

export async function GET() {
    try {
        const userId = await getCurrentUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const getTokensByModelByUser  = await prisma.chat.groupBy({
            by: ['model'],
            where: { userId },
            _sum: { totalTokens: true },
        });

        const result: Record<string, number> = {};

        for (const entry of getTokensByModelByUser) {
            result[entry.model.toLowerCase()] = entry._sum.totalTokens ?? 0;
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Erreur get:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
