import { Response } from "express";
import { AuthRequest } from "../types/Requests";
import { prisma } from "../database/PrismaClient";
import { userTransformer } from "../transformers/UserTransformer";
import { BaseController } from "./BaseController";
import userRepository from "../repositories/userRepository";

export class UserController extends BaseController {
    readonly rules = {
        firstName: ['required', 'string', 'maxLength:32'],
        lastName: ['required', 'string', 'maxLength:63'],
    }

    public async profile(req: AuthRequest, res: Response) {
        const user = await prisma(req.context).user.findFirstOrThrow({
            where: {
                id: req.context.userId,
            },
            include: {
                // tenant: true,
                profilePicture: {
                    include: {
                        conversions: true,
                    }
                },
            }
        });

        const userTransformed = userTransformer().transform(user);

        return res.status(200).json({
            user: userTransformed,
        });
    }

    public async findMe(req: AuthRequest, res: Response) {
        const user = await prisma(req.context).user.findFirstOrThrow({
            where: {
                id: req.context.userId,
            },
            include: {
                // tenant: true,
                profilePicture: {
                    include: {
                        conversions: true,
                    }
                },
            },
        });

        const userTransformed = userTransformer().transform(user);

        return res.status(200).json(userTransformed);
    }

    /**
     * Update user's own details
     *
     * @param req
     * @param res
     */
    public async updateMe(req: AuthRequest, res: Response) {
        const rules = {
            newPassword: ['string', 'nullable', 'strongPassword'],
            ...this.rules,
        }

        const params = this.validate(req, res, rules);

        const existingUser = await prisma(req.context).user.findFirstOrThrow({
            where: {
                id: req.context.userId,
            },
        })

        const user = await userRepository.updateMe(existingUser, params, req.context)
        const userTransformed = userTransformer().transform(user);

        return res.json(userTransformed);
    }
}
