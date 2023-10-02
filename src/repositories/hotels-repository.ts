import { prisma } from "@/config"

export const getHotels = async()=>{
    const hotels = await prisma.hotel.findMany({})
    return hotels
}

export const getRoomsByHotelId = async(hotelId: number)=>{
    const rooms = await prisma.room.findMany({
        where:{hotelId}
    })
    return rooms;
}



export const hotelsRepository = {
    getHotels,
    getRoomsByHotelId
    
}