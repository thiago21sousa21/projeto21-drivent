import { prisma } from "@/config"
import faker from "@faker-js/faker"

export const createRoom = async(
    hotelId:number,
    capacity?:number,
    name?:string,    

) =>{
    const room = await prisma.room.create({
        data:{
            name: name || faker.animal.fish(),
            capacity:capacity || Number(faker.random.numeric(1)),
            hotelId,        

        }
    })
    return room;
}