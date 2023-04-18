import bcrypt from 'bcrypt';
import app from "../../app/server";
import { prisma } from "../../app/database/PrismaClient";
import { beforeEachHelper } from "../helpers/setup";

const request = require('supertest');

describe('AuthController tests', () => {
    beforeAll(async () => {
        await prisma;
    })

    beforeEach(async () => {
        await beforeEachHelper();
    });

    afterEach(async () => {
    });

    it('Login', async function() {
        const password = '1234';
        const email = 'email@email.com';

        await prisma().user.create({ data: {
                email: email,
                firstName: 'Guy',
                lastName: 'Buddy',
                role: "default",
                password: bcrypt.hashSync(password, 10),
            }
        });

        const result = await request(app)
            .post('/api/auth/local')
            .send({ identifier: email, password: password})
            .set('Accept', 'application/json')
            .expect(200)

        expect(result.body.jwt).not.toBe(null);
        expect(result.body.user).not.toBe(null);
    });
});

