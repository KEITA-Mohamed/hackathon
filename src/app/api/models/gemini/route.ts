import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveChatToDb, createConversation } from "@/app/services/chat.service";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {

        const userId = await getCurrentUserId();
        if (!userId) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const { prompt } = await req.json();
        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Prompt requis." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY manquante.");
            return NextResponse.json({ error: "Configuration serveur invalide." }, { status: 500 });
        }

        const convId = await createConversation(userId);

        const genAI = new GoogleGenerativeAI(apiKey);
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await geminiModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const response = result?.response;
        const answer = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Pas de réponse.";

        const promptTokens = Number(response.usageMetadata?.promptTokenCount || 0);
        const completionTokens = Number(response.usageMetadata?.candidatesTokenCount || 0);
        const totalTokens = Number(response.usageMetadata?.totalTokenCount || 0);

        // 💾 Sauvegarde dans la base de données
        await saveChatToDb({
            convId,
            userId,
            prompt,
            answer,
            model: "GEMINI",
            promptTokens,
            completionTokens,
            totalTokens,
        });

        return NextResponse.json({ response: answer, convId }, { status: 200 });

    } catch (err) {
        console.error("Erreur Gemini :", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
