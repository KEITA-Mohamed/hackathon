import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { saveChatToDb } from '@/app/services/chat.service';

export async function POST(req: NextRequest) {
    try {
        const { prompt, model, userId, fullConvId } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Le prompt est requis.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('La clé API GEMINI_API_KEY est manquante.');
        }

        const genAI = new GoogleGenerativeAI(apiKey);


        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await geminiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });


        const response = await result.response.text();


        await saveChatToDb({
            prompt,
            answer: response,
            model,
            userId,
            fullConvId,
            taskType: 'LINKEDIN',
            finishedConv: false,
        });

        return NextResponse.json({ response, result  }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la génération de contenu :', error);
        return NextResponse.json({ error: 'Échec de la génération de contenu' }, { status: 500 });
    }
}
