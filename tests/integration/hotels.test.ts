import supertest from "supertest";
import app from "@/app";
import { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createUser } from "../factories";
import * as jwt from "jsonwebtoken"
import { createHotel } from "../factories/hotels-factory";


const server = supertest(app);

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe("get for /hotels", () => {
    // it("",()=>{

    // })
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    //WHEN TOKEN IS VALID
    it('should respond with empty array when there are no hotesl created', async () => {
        const token = await generateValidToken();
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.body).toEqual([]);
    });
    it('should respond with status 200 and with existing TicketTypes data', async () => {
        const token = await generateValidToken();

        //tem que criar um hotel
        const hotel = await createHotel();

        //esta fazendo uma busca dos hoteis e validando com token
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            ])
        );

    });

});

// describe("get for /hotels/:hotelId",()=>{
//     it("",()=>{

//     })
// });