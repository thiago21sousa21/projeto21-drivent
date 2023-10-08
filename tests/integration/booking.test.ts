import supertest from 'supertest';
import app, { init } from '@/app';
import { createBooking, createHotel, createRoom, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken'





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

    })  


})