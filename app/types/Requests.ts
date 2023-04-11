import { Request } from "express";
import { FileArray } from "express-fileupload";

export type ApiContext = {
    credentials?: any;
    userId?: number;
    role?: string;
    tenantId?: number;
}

export interface AuthRequest extends Request {
    context: ApiContext,
    files?: FileArray | null | undefined;
}

export interface BodyType {
    [key: string]: any;
}

export interface UserCreateBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserUpdateMeBody extends Omit<UserCreateBody, "password" > {
    newPassword?: string;
    currentPassword?: string;
}