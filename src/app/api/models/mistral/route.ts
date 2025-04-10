import { NextRequest, NextResponse } from 'next/server';
import { saveChatToDb } from "@/app/services/chat.service";



export async function POST(req: NextRequest) {
    try {
        const { prompt, model, userId, fullConvId } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Aucun prompt fourni.' }, { status: 400 });
        }

        if (!process.env.MISTRAL_API_KEY) {
            return NextResponse.json({ error: 'Clé API Mistral manquante.' }, { status: 500 });
        }

        const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral-medium',
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        const mistralData = await mistralRes.json();
        const response = mistralData?.choices?.[0]?.message?.content || 'Pas de réponse.';

        await saveChatToDb({
            prompt,
            answer: response,
            model,
            userId,
            fullConvId,
            taskType: 'LINKEDIN',
            finishedConv: false,
        });

        return NextResponse.json({ response, mistralData }, { status: 200 });

    } catch (error) {
        console.error('Erreur API Mistral :', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
