import { prisma } from "@/config"


const getBooking = async(userId: number)=>{
    const booking = await prisma.booking.findUnique({
        where:{userId},
        select:{
            id:true,
            Room:true
        }
        
    })
    return  booking;
}

const newBooking = async(roomId: number, userId: number)=>{
    const booking = await prisma.booking.create({
        data:{
            roomId: roomId,
            userId: userId
        }
    })
    return booking;
}

const getBusys = async(roomId: number)=>{
    const count = await prisma.booking.count(
        {
            where:{roomId}
        }
    )
    return count;
}

const getCapacity = async(roomId: number)=>{
    const capacity = await prisma.room.findUnique({
        where:{id:roomId},
        select:{capacity: true}
    })
    return capacity?.capacity || 0 ;
}

const changeRoom = async(roomId: number, bookingId: number)=>{
    const changeRoom  = await prisma.booking.update({
        where:{id:bookingId},
        data:{roomId:roomId}
    })
    return changeRoom;
}


export const bookingRepository = {
    getBooking,
    newBooking,
    getCapacity,
    getBusys,
    changeRoom
}