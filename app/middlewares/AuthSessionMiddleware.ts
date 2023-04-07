import { NextFunction, Response } from "express";
import { jwtDecode } from "../lib/functions";
import { AuthRequest } from "../types/Requests";
import { BaseMiddleware } from "./BaseMiddleware";

export class AuthSessionMiddleware extends BaseMiddleware {
    public async handle(req: AuthRequest, res: Response, next: NextFunction, { permissions }) {
        const token = req.cookies['session_token'] ?? null;

        if (!token) {
            return res.status(401).json({
                message: 'No authentication method found.',
            });
        }

        let decodedJwt = null;

        try {
            decodedJwt = jwtDecode(token, process.env.JWT_SECRET_SESSION);
        } catch (e) {
            return res.status(401).json({
                message: 'Invalid authentication, try to re-login',
            });
        }

        this.validateDecodedJwt(req, res, decodedJwt)
        this.assertPermissions(req, res, decodedJwt, permissions)

        next();
    }
}