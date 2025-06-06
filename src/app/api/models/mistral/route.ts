import { NextRequest, NextResponse } from "next/server";
import { saveChatToDb, createConversation } from "@/app/services/chat.service";
import { getCurrentUser, getCurrentUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const userId = await getCurrentUserId();
        const user = await getCurrentUser();

        if (!userId) {
            return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
        }

        const { prompt, convId: existingConvId } = await req.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Le champ 'prompt' est requis et doit être une chaîne." }, { status: 400 });
        }

        const mistralKey = process.env.MISTRAL_API_KEY;
        if (!mistralKey) {
            console.error("❌ MISTRAL_API_KEY manquante dans .env");
            return NextResponse.json({ error: "Clé API manquante." }, { status: 500 });
        }

        // 👉 Si le front ne fournit pas de convId, on en crée une
        const convId = existingConvId ?? await createConversation(userId);

        const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${mistralKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistral-medium-latest",
                messages: [{ role: "user", content: prompt }],
            }),
        });

        if (!mistralRes.ok) {
            const errText = await mistralRes.text();
            console.error("Erreur API Mistral:", errText);
            return NextResponse.json({ error: "Erreur depuis l'API Mistral." }, { status: 502 });
        }

        const json = await mistralRes.json();

        const answer = json?.choices?.[0]?.message?.content ?? "Pas de réponse.";

        await saveChatToDb({
            convId,
            userId,
            prompt,
            answer,
            model: "MISTRAL",
            promptTokens: json.usage?.prompt_tokens ?? 0,
            completionTokens: json.usage?.completion_tokens ?? 0,
            totalTokens: json.usage?.total_tokens ?? 0,
        });

        return NextResponse.json({ response: answer, convId }, { status: 200 });

    } catch (err) {
        console.error("Erreur serveur /mistral :", err);
        return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
    }
}
