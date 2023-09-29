import { prisma } from "@/config"

const getHotels = async()=>{
    const hotels = await prisma.hotel.findMany({})
    return hotels
}

const getRoomsByHotelId = async(hotelId: number)=>{
    const rooms = await prisma.room.findMany({
        where:{hotelId}
    })
    return rooms;
}

export const hotelsRepository = {
    getHotels,
    getRoomsByHotelId
    
}