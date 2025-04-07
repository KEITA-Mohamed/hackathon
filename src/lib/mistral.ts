export async function askMistral(messages: string) {
    const apiKey = process.env.MISTRAL_API_KEY;
    const endpoint = 'https://api.mistral.ai/v1/chat/completions';

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'mistral-medium',
            messages,
        }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Pas de réponse.';
}
