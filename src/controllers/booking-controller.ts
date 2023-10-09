import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export const getBooking = async(req: AuthenticatedRequest, res: Response)=>{
    const userId = req.userId;

    const booking = await bookingService.getBooking(userId)
    return res.status(httpStatus.OK).send(booking);
}

export const newBooking = async(req: AuthenticatedRequest, res: Response)=>{    
    const userId = req.userId;
    const {roomId} = req.body

    const booking = await bookingService.newBooking(roomId, userId)
    return res.status(httpStatus.OK).send(booking);
}

export const changeRoom = async(req: AuthenticatedRequest, res: Response)=>{
    const bookingId = Number(req.params.bookingId)
    const {roomId} = req.body;
    const changed = await bookingService.changeRoom(roomId, bookingId)
    return res.status(httpStatus.OK).send({bookingId:changed.id})
    
}

export const bookingController = {
    getBooking,
    newBooking,
    changeRoom
}