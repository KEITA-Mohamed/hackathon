import {prisma} from "@/lib/prisma";

export type ChatCreateInput = {
    prompt?: string;
    answer?: string;
    model?: 'MISTRAL' | 'O1' | 'O4' | 'CLAUDE';
    userId?: string;
    fullConvId?: string;
    taskType?: 'LINKEDIN' | 'GRAPHIC' | 'COMMUNICATION';
    finishedConv?: boolean;
};

export async function saveChatToDb(data: ChatCreateInput) {
    return prisma.chat.create({data});
}
