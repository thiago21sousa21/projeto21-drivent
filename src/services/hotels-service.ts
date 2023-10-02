import { notFoundError } from "@/errors";
import { paymentRequired } from "@/errors/payment-error";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { hotelsRepository } from "@/repositories/hotels-repository"

const getHotels = async(userId: number)=>{
    //fazer busca na tabela de inscrições se existe esse id lá, se não ... votar um erro
    const enrollment = await enrollmentRepository.getEnrollmentByUserId(userId);
    if(!enrollment)throw notFoundError()
    const enrollmentId = enrollment.id;
    //agora verificar se tem um ticket pago na tabela tickets usando o enrollmentId
    const ticket =await  ticketsRepository.findTicketByEnrollmentId(enrollmentId)
    if(!ticket)throw notFoundError();

    if(ticket.status !== "PAID")throw paymentRequired();

    const hotels = await hotelsRepository.getHotels();
    return hotels
}

const getRoomsByHotelId = async(hotelId: number, userId:number)=>{
    const enrollment = await enrollmentRepository.getEnrollmentByUserId(userId);
    if(!enrollment)throw notFoundError()
    const enrollmentId = enrollment.id;
    const ticket =await  ticketsRepository.findTicketByEnrollmentId(enrollmentId)
    if(!ticket)throw notFoundError();
    if(ticket.status !== "PAID")throw paymentRequired();


    const rooms = await hotelsRepository.getRoomsByHotelId(hotelId)
    return rooms;
}

export const hotelsService = {
    getHotels,
    getRoomsByHotelId
}