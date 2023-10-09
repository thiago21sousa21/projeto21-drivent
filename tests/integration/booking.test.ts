import supertest from 'supertest';
import app, { init } from '@/app';
import { createBooking, createHotel, createRoom, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken'
import { number } from 'joi';





beforeAll(async()=>{
    await init();
})
beforeEach(async()=>{
    cleanDb();
})

const server = supertest(app);
describe('get booking',()=>{


    describe('when is not autorized',()=>{


        it('should return 401 Unauthorized if no token is given', async () => {
            const booking = await server.get('/booking')
            expect(booking.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if given token is not valid', async () => {
            const token = faker.lorem.word();        
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if there is no session for given token', async () => {
            const userWithoutSession = await createUser();
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

    })

    describe('when is authorized',()=>{

        
        it ('should return status 404 for not find booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user)
            const {status, body} = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(status).toBe(404)
        })
    
        it('should return status 200 with the booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            // Create a new Booking
            const newHotel = await createHotel()
            const newRoom = await createRoom(newHotel.id)
            const newBooking = await createBooking(user.id, newRoom.id);
            const {status, body} = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(status).toBe(200)
            //expect(body).toEqual()
        })

    })  


})

describe('post booking',()=>{


    describe('when is not autorized',()=>{


        it('should return 401 Unauthorized if no token is given', async () => {
            const booking = await server.post('/booking')
            expect(booking.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if given token is not valid', async () => {
            const token = faker.lorem.word();        
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if there is no session for given token', async () => {
            const userWithoutSession = await createUser();
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

    })

    describe('when is authorized',()=>{

        
        it ('should return status 404 for roomId does not exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user)
            const {status, body} = await server.post('/booking')
                .set('Authorization', `Bearer ${token}`)
                .send({roomId:999999});
            expect(status).toBe(404)
        })
    
        it('should return status 403. Are not places in the room ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user)

            //create hotel with room

            const newHotel = await createHotel()
            const newRoom = await createRoom(newHotel.id, 1)
            const newBooking = await createBooking(user.id, newRoom.id);

            const user2 = await createUser();
            const token2 = await generateValidToken(user)
            
            const second = await server.post('/booking')
                .set('Authorization', `Bearer ${token2}`)
                .send({roomId:newRoom.id});
            //create the secont user and trying to use a room
          

            expect(second.status).toBe(403)
        })

        it('should return status 200. sucess in choice the room ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user)

            const newHotel = await createHotel()
            const newRoom = await createRoom(newHotel.id, 1)
            
            const {status, body} = await server.post('/booking')
                .set('Authorization', `Bearer ${token}`)
                .send({roomId:newRoom.id});

            expect(status).toBe(200)
            expect(body).toEqual({bookingId:expect.any(Number)})
        })

    })  


})

describe('PUT /booking/:bookingId ⇒ Trocar uma reserva',()=>{


    describe('when is not autorized',()=>{


        it('should return 401 Unauthorized if no token is given', async () => {
            const booking = await server.put('/booking/:bookingId')
            expect(booking.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if given token is not valid', async () => {
            const token = faker.lorem.word();        
            const response = await server.post('/booking/:bookingId').set('Authorization', `Bearer ${token}`);        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if there is no session for given token', async () => {
            const userWithoutSession = await createUser();
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        
            const response = await server.post('/booking/:bookingId').set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

    })

    describe('when is authorized',()=>{

        
        it ('should return status 404 for bookingId does not exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user)

           const bookingId:number = undefined;

           const {status} = await server.put(`/booking/${bookingId}`)
                .set('Authorization', `Bearer ${token}`)

           expect(status).toBe(httpStatus.NOT_FOUND)

        })

        it ('should return status 404 for roomId does not exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user)

           const bookingId:number = undefined;

           const {status} = await server.put(`/booking/${bookingId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({roomId: undefined})

           expect(status).toBe(httpStatus.NOT_FOUND)

        })
    
        it('should return status 403. Are not places in the room ', async () => {
            const user = await createUser();
            const user2 = await createUser();

            const token = await generateValidToken(user)
            const token2 = await generateValidToken(user)
            //create hotel with room

            const newHotel = await createHotel()
            const newRoom = await createRoom(newHotel.id, 1)
            const newRoom2 = await createRoom(newHotel.id, 1)

            const newBooking = await createBooking(user.id, newRoom.id);
            const newBooking2 =  await createBooking(user2.id, newRoom2.id);
            
            const second = await server.put(`/booking/${newBooking2.id}`)
                .set('Authorization', `Bearer ${token2}`)
                .send({roomId:newRoom.id});
            //create the secont user and trying to use a room          

            expect(second.status).toBe(403);

        })

        it('should return status 200. sucess in change the room ', async () => {
            const user = await createUser();
            const user2 = await createUser();

            const token = await generateValidToken(user)
            const token2 = await generateValidToken(user)
            //create hotel with room

            const newHotel = await createHotel()
            const newRoom = await createRoom(newHotel.id, 2)
            const newRoom2 = await createRoom(newHotel.id, 1)

            const newBooking = await createBooking(user.id, newRoom.id);
            const newBooking2 =  await createBooking(user2.id, newRoom2.id);
            
            const second = await server.put(`/booking/${newBooking2.id}`)
                .set('Authorization', `Bearer ${token2}`)
                .send({roomId:newRoom.id});
            //create the secont user and trying to use a room          

            expect(second.status).toBe(200);
            expect(second.body).toEqual({bookingId:newBooking2.id})
            
        })

    })  


})