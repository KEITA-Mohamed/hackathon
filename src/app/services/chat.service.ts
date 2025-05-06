import {prisma} from "@/lib/prisma";

export type ChatCreateInput = {
    prompt: string;
    answer: string;
    model: 'MISTRAL' | 'GEMINI' | 'O1' | 'O4' | 'CLAUDE';
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    convId: string;
};

export async function saveChatToDb(data: ChatCreateInput) {
    return prisma.chat.create({data});
}
