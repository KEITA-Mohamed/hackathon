
import "server-only";
import prisma from "@/lib/prisma/prisma";


export async function findUserPerId(id){

    try{
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        return user;

    }catch(e){
        console.error("Error finding user: ", e);
        throw new Error("Failed to find user by ID");
    }


}
