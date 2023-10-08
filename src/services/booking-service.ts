import { forbidenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories"


const getBooking = async(userId: number)=>{

    const booking = await bookingRepository.getBooking(userId);
    if(!booking)throw notFoundError();
    return booking;
}

const newBooking = async(roomId: number, userId: number)=>{
    await isTheRoomFull(roomId);

    const booking = await bookingRepository.newBooking(roomId, userId)
    const bookingId = booking.id
    return {bookingId}
}

const isTheRoomFull =async (roomId:number) => {
    const capacity = await bookingRepository.getCapacity(roomId);
    if(!capacity)throw notFoundError();
    const busy = await bookingRepository.getBusys(roomId);
    if(busy>=capacity)throw forbidenError();
}

const changeRoom = async(roomId: number, bookingId: number)=>{
    if(isNaN(bookingId) || isNaN(roomId))throw notFoundError()


    await isTheRoomFull(roomId);

    const changeRoom = await bookingRepository.changeRoom(roomId, bookingId)
    
    return changeRoom
}

export const bookingService = {
    getBooking,
    newBooking,
    changeRoom
}