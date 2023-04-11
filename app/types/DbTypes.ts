import {
    User,
    Media,
} from '@prisma/client';

export interface MediaWithInclude extends Media {
    conversions: Media[];
}

export interface UserWithInclude extends User {
    profilePicture: MediaWithInclude;
}

export type ResultWithCount<PrismaTableType> = [PrismaTableType, number];
