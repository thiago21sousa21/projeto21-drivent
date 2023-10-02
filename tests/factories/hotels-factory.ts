import { prisma } from "@/config"

export const createHotel = async(
    name = "nameHotel",
    image="http://imageHotel.com"
)=>{
    const hotel = await prisma.hotel.create({ data:{name,image} })
    return hotel;
}