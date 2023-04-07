/**
 * @param area
 * @param activityTypes
 * @private
 */
import { prisma } from "../database/PrismaClient";
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ValidationError } from "../exceptions/ValidationError";
import { capitalize, getQueryFilter } from "../lib/functions";
import { ApiContext, AuthRequest } from "../types/Requests";
import { FilterMapType } from "../types/Filter";

const FilterMap: FilterMapType = {
    email: {
        topic: 'email',
        operator: 'contains',
        mode: 'insensitive',
    },
    firstName: {
        topic: 'firstName',
        operator: 'contains',
        mode: 'insensitive',
    },
    lastName: {
        topic: 'lastName',
        operator: 'contains',
        mode: 'insensitive',
    },
    role: {
        topic: 'role',
        operator: 'equals',
        mode: 'insensitive',
    },
}

export default {
    updateLastActive(userId, context: ApiContext) {
        return prisma(context).user.update({
            where: {
                id: userId,
            },
            data: {
                lastActiveAt: new Date(),
            },
            include: {
                // uncomment if multi-tenant
                // tenant: true,
                profilePicture: {
                    include: {
                        conversions: true,
                    }
                },
            },
        });
    },

    async findOne(context: ApiContext, userId: number) {
        return await prisma(context).user.findFirstOrThrow({
            where: {id: userId},
            include: {
                // uncomment if multi-tenant
                // tenant: true,
                profilePicture: {
                    include: {
                        conversions: true,
                    }
                }
            },
        })
    },

    async findAll(context: ApiContext, page, limit, query) {
        let {where} = getQueryFilter(FilterMap, query);

        let include = {
            tenant: true,
            worker: true,
            profilePicture: {
                include: {
                    conversions: true
                }
            },
        }

        return prisma().$transaction(async () => {
            const count = await prisma(context).user.count({where});
            const users = await prisma(context).user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    ...include,
                },
                where,
            })

            return [users, count, page, limit];
        }) as any;
    },

    async updateMe(user: User, body, context: ApiContext) {
        const userData = {} as Prisma.UserUncheckedCreateInput;

        userData.firstName = body.firstName;
        userData.lastName = body.lastName;

        if (body.newPassword) {
            const hash = user.password;
            const isPasswordCorrect = await bcrypt.compare(body.currentPassword, hash);

            if (!isPasswordCorrect) {
                throw new ValidationError({
                    'currentPassword': ['Incorrect password'],
                })
            }

            userData.password = bcrypt.hashSync(body.newPassword, 10);
        }

        return prisma(context).user.update({
            where: {id: user.id},
            data: userData,
            include: {
                profilePicture: {
                    include: {
                        conversions: true,
                    }
                }
            }
        });
    },

    async update(user, body, context: ApiContext) {
        const userData = {} as Prisma.UserCreateInput;

        userData.email = body.email;
        userData.firstName = body.firstName;
        userData.lastName = body.lastName;
        userData.role = body.role;

        if (body.newPassword) {
            userData.password = bcrypt.hashSync(body.newPassword, 10);
        }

        return prisma(context).user.update({
            where: {id: parseInt(user.id)},
            data: userData,
        });
    }
}