import { forbidenError } from "@/errors";
import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { bookingService } from "@/services";
import faker from "@faker-js/faker";


//_____________________________________________//
beforeEach(()=>{
    jest.clearAllMocks();
})

//_____________________________________________//

describe('change room', ()=>{
    it('não deve funcionar porque não tem booking desse usuarion', ()=>{
        jest.spyOn(bookingRepository, "getBooking").mockResolvedValueOnce(null)
        const response = bookingService .changeRoom(999, 999, 999)
        expect(response).rejects.toEqual(forbidenError())
    })
})

describe(' fazer reserva', ()=>{
    it('Retorna status 403 se o ticket do usuário é remoto?',()=>{
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockResolvedValueOnce({
            id: 1,
            name: faker.name.firstName(),
            cpf: faker.name.lastName(),
            birthday: new Date(),
            phone:  faker.name.firstName(),
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Address: [
              {
                id: 1,
                cep: faker.address.zipCode(),
                street: faker.address.streetName(),
                city: faker.address.city(),
                state: faker.address.state(),
                number: faker.address.buildingNumber(),
                neighborhood: faker.address.direction(),
                addressDetail: faker.address.streetAddress() || null,
                enrollmentId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
        })

        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockResolvedValueOnce({
            id: 1,
            status: "PAID",
            ticketTypeId: 1,
            enrollmentId: 1,
            TicketType: {
              id: 1,
              name:'abc',
              price: 1,
              isRemote: true,
              includesHotel: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        })


        const response = bookingService.newBooking(99999,99999)
        expect(response).rejects.toEqual(forbidenError())
    })
    it('Retorna status 403 se o ticket do usuário não inclui hotel?',()=>{
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockResolvedValueOnce({
            id: 1,
            name: faker.name.firstName(),
            cpf: faker.name.lastName(),
            birthday: new Date(),
            phone:  faker.name.firstName(),
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Address: [
              {
                id: 1,
                cep: faker.address.zipCode(),
                street: faker.address.streetName(),
                city: faker.address.city(),
                state: faker.address.state(),
                number: faker.address.buildingNumber(),
                neighborhood: faker.address.direction(),
                addressDetail: faker.address.streetAddress() || null,
                enrollmentId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
        })

        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockResolvedValueOnce({
            id: 1,
            status: "PAID",
            ticketTypeId: 1,
            enrollmentId: 1,
            TicketType: {
              id: 1,
              name:'abc',
              price: 1,
              isRemote: false,
              includesHotel: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = bookingService.newBooking(99999,99999)
        expect(response).rejects.toEqual(forbidenError())
    })
    it('Retorna status 403 se o ticket do usuário não foi pago?',()=>{
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockResolvedValueOnce({
            id: 1,
            name: faker.name.firstName(),
            cpf: faker.name.lastName(),
            birthday: new Date(),
            phone:  faker.name.firstName(),
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Address: [
              {
                id: 1,
                cep: faker.address.zipCode(),
                street: faker.address.streetName(),
                city: faker.address.city(),
                state: faker.address.state(),
                number: faker.address.buildingNumber(),
                neighborhood: faker.address.direction(),
                addressDetail: faker.address.streetAddress() || null,
                enrollmentId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
        })
        
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockResolvedValueOnce({
            id: 1,
            status: "RESERVED",
            ticketTypeId: 1,
            enrollmentId: 1,
            TicketType: {
              id: 1,
              name:'abc',
              price: 1,
              isRemote: true,
              includesHotel: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = bookingService.newBooking(99999,99999)
        expect(response).rejects.toEqual(forbidenError())
    })
})