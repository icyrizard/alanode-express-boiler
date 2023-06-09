import { Request } from "express";
import { FileArray } from "express-fileupload";
import { ValidationErrorsType } from "aws-sdk/clients/secretsmanager";

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

export interface UserCreateBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserUpdateMeBody extends Omit<UserCreateBody, "password" | "email" > {
    newPassword?: string;
    currentPassword?: string;
}