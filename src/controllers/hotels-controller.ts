import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';


export const getHotels = async(req: AuthenticatedRequest, res: Response)=>{
    const {userId} = req.body;
    const hotels = await hotelsService.getHotels(userId);
    return hotels
}

export const getRoomsByHotelId = async(req: AuthenticatedRequest, res: Response)=>{
    const hotelId = Number(req.params.hotelId)
    const {userId} = req.body;
    const rooms = await hotelsService.getRoomsByHotelId(hotelId, userId)
    return rooms;
}