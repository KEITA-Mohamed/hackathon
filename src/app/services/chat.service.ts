import { prisma } from "@/lib/prisma/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { Prisma } from "@prisma/client";

interface ChatCreateInput {
    convId: string;
    prompt: string;
    answer: string;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    comment?: string;
    question?: string;
    note?: number;
    userId?: string;
}

export async function createConversation(userId: string) {
    if (!userId) {
        throw new Error("userId requis pour créer une conversation");
    }

    const newConv = await prisma.conv.create({
        data: { userId },
    });

    return newConv.id;
}

export async function saveChatToDb(data: ChatCreateInput) {
    const userId = data.userId ?? (await getCurrentUserId());
    if (!userId) throw new Error("Utilisateur non authentifié");

    return prisma.chat.create({
        data: {
            prompt: data.prompt,
            answer: data.answer,
            model: data.model,
            promptTokens: data.promptTokens,
            completionTokens: data.completionTokens,
            totalTokens: data.totalTokens,
            comment: data.comment,
            question: data.question,
            note: data.note,
            convId: data.convId,
            userId,
        }
    });
}
