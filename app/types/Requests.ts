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