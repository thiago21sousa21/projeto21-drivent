import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';


export const getHotels = async()=>{
    const hotels = await hotelsService.getHotels();
    return hotels
}

export const getRoomsByHotelId = async(req: AuthenticatedRequest, res: Response)=>{
    const hotelId = Number(req.params.hotelId)
    const rooms = await hotelsService.getRoomsByHotelId(hotelId)
    return rooms;
}