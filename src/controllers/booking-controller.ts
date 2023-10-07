import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services";
import { Response } from "express";

export const getBooking = async(req: AuthenticatedRequest, res: Response)=>{
    const userId = req.userId;

    const booking = await bookingService.getBooking(userId)
    return booking;
}

export const newBooking = async(req: AuthenticatedRequest, res: Response)=>{    
    const userId = req.userId;
    const {roomId} = req.body

    const booking = await bookingService.newBooking(roomId, userId)
    return booking
}

export const changeRoom = async(req: AuthenticatedRequest, res: Response)=>{
    const bookingId = Number(req.params.bookingId)
    const {roomId} = req.body;
    return await bookingService.changeRoom(roomId, bookingId)
     
}

export const bookingController = {
    getBooking,
    newBooking,
    changeRoom
}