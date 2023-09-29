import { hotelsRepository } from "@/repositories/hotels-repository"

const getHotels = async()=>{
    const hotels = await hotelsRepository.getHotels();
    return hotels
}

const getRoomsByHotelId = async(hotelId: number)=>{
    const rooms = await hotelsRepository.getRoomsByHotelId(hotelId)
    return rooms;
}

export const hotelsService = {
    getHotels,
    getRoomsByHotelId
}