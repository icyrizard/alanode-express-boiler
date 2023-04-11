/**
 * @param area
 * @param activityTypes
 * @private
 */
import { prisma } from "../database/PrismaClient";
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ValidationError } from "../exceptions/ValidationError";
import { getQueryFilter } from "../lib/functions";
import { ApiContext, UserUpdateBody, UserUpdateMeBody } from "../types/Requests";
import { FilterMapType } from "../types/Filter";
import { ResultWithCount, UserWithInclude } from "../types/DbTypes";
import { ParsedQs } from "qs";

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
    updateLastActive(userId: number, context: ApiContext): Promise<UserWithInclude> {
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

    async findOne(context: ApiContext, userId: number): Promise<UserWithInclude> {
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

    findAll: async function (context: ApiContext, page: number, limit: number, query: ParsedQs): Promise<ResultWithCount<UserWithInclude[]>> {
        let {where} = getQueryFilter(FilterMap, query);

        let include = {
            profilePicture: {
                include: {
                    conversions: true
                }
            },
        }

        const count = await prisma(context).user.count({where});
        const users = await prisma(context).user.findMany({
            skip: (page - 1) * limit,
            take: limit,
            include: {
                ...include,
            },
            where,
        })

        return [users, count];
    },

    /**
     * @param user
     * @param body
     * @param context
     */
    async updateMe(context: ApiContext, user: User, body: UserUpdateMeBody): Promise<UserWithInclude> {
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

    /**
     * Note: This is meant as an admin update.
     *
     * @param context
     * @param user
     * @param body
     */
    async update(context: ApiContext, user: User, body: UserUpdateBody): Promise<UserWithInclude> {
        const userData = {} as Prisma.UserCreateInput;

        userData.email = body.email;
        userData.firstName = body.firstName;
        userData.lastName = body.lastName;

        if (body.newPassword) {
            userData.password = bcrypt.hashSync(body.newPassword, 10);
        }

        return prisma(context).user.update({
            where: {
                id: user.id,
            },
            data: userData,
            include: {
                profilePicture: {
                    include: {
                        conversions: true,
                    }
                }
            }
        });
    }
}