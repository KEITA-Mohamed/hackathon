import {prisma} from "@/lib/prisma";

export type ChatCreateInput = {
    prompt: string;
    answer: string;
    model: 'MISTRAL' | 'GEMINI' | 'O1' | 'O4' | 'CLAUDE';
    convId: string;
};

export async function saveChatToDb(data : ChatCreateInput) {
    return prisma.chat.create({data});
}
