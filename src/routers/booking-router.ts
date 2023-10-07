import { changeRoom, getBooking, newBooking } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router()

bookingRouter
    .all('/*', authenticateToken)
    .get('/',getBooking)
    .post('/', newBooking)
    .put('/:bookingId', changeRoom)

export {bookingRouter};