import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt) {
        return NextResponse.json({ error: 'Aucun prompt fourni.' }, { status: 400 });
    }

    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'mistral-medium',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    });

    const data = await res.json();

    const content = data?.choices?.[0]?.message?.content || 'Pas de réponse.';

    return NextResponse.json({ response: content });
}
