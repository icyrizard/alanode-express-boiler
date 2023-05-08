import { Response } from "express";
import bcrypt from 'bcrypt';
import { capitalize, jwtEncode } from "../lib/functions";
import { userTransformer } from "../transformers/UserTransformer";
import { AuthRequest } from "../types/Requests";
import { prisma } from "../database/PrismaClient";
import { BaseController } from "./BaseController";
import authRepository from "../repositories/authRepository";
import userRepository from "../repositories/userRepository";
import { EventBus } from "../services/EventBus";
import { UserRegisteredEventHandler } from "../events/handlers/UserRegisteredEventHandler";
import { UserRegisteredEvent } from "../events/impl/UserRegisteredEvent";

export class AuthController extends BaseController {
    public async ping(req: AuthRequest, res: Response) {
        authRepository.refreshSessionToken(req, res);

        await userRepository.updateLastActive(req.context, req.context.userId);

        return res.json({status: 'ok'})
    }

    public async login(req: AuthRequest, res: Response) {
        const params = this.validate(req, res, {
            identifier: ['required', 'string'],
            password: ['required', 'string'],
        });

        const user = await prisma(req.context).user.findFirst({
            where: {
                email: {
                    equals: params.identifier,
                    mode: 'insensitive',
                }
            },
            include: {
                // uncomment if multi-tenant needed.
                // tenant: true,
                profilePicture: {
                    include: {
                        conversions: true
                    }
                },
            },
        });

        if (!user) {
            return res.status(401).json({
                message: 'No user found with this email address / password combination',
            });
        }

        const hash = user.password;
        const isPasswordCorrect = await bcrypt.compare(params.password, hash);

        if (!isPasswordCorrect) {
            return res.status(404).json({
                message: 'No user found with this email address / password combination',
            });
        }

        const userUpdated = await userRepository.updateLastActive(req.context, user.id);
        const userTransformed = userTransformer().transform(userUpdated);

        const token = authRepository.createAuthorizationJwt(user);

        return res.json({
                jwt: token,
                user: userTransformed,
            }
        );
    }

    public async register(req: AuthRequest, res: Response) {
        const params = this.validate(req, res, {
            email: ['required', 'string'],
            firstName: ['required', 'string', 'minLength:2'],
            password: ['required', 'string', 'minLength:8'], // todo: regex check for max safety
            signupSecret: ['required', 'string'],
            // uncomment if multi-tenant needed.
            // tenantId: ['required', 'number'],
        });

        if (params.signupSecret !== process.env.SIGNUP_SECRET) {
            return res.status(403).json({
                message: 'Invalid signup secret',
            });
        }

        const email = params.email.toLowerCase();
        const firstName = capitalize(params.firstName);
        const lastName = capitalize(params.lastName);

        const existingUser = await prisma(req.context).user.findFirst({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return res.status(409).json({
                errors: {
                    email: 'email already taken',
                },
            });
        }

        const user = await prisma(req.context).user.create({
            data: {
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: "default",
                // uncomment if multi-tenant needed.
                // tenantId: parseInt(params.tenantId),
            }});

        bcrypt.hash(params.password, 10).then((hashed) => {
            return prisma(req.context).user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashed
                }
            })
        })

        EventBus.getInstance().emit(new UserRegisteredEvent(user, req.context));

        const token = jwtEncode({
            user: {
                id: user.id,
                role: user.role,
            }
        });

        // @ts-ignore
        const userTransformed = userTransformer().transform(user);

        return res.status(201).json({
                jwt: token,
                user: userTransformed,
            }
        );
    }
}
