import { Router } from 'express';
import { getHotels, getRoomsByHotelId } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { ticketSchema } from '@/schemas/tickets-schemas';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/:hotelId',getRoomsByHotelId)

export { hotelsRouter };