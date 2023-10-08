import { prisma } from "@/config"

export const createBooking = async(userId: number, roomId:number)=>{
    const newBooking = await prisma.booking.create({
        data:{
            userId, roomId
        }
    });
    return newBooking;
}