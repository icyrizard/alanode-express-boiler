import { NextFunction, Response } from "express";
import { jwtDecode, jwtEncode } from "../lib/functions";
import { AuthRequest } from "../types/Requests";
import { BaseMiddleware } from "./BaseMiddleware";
import { differenceInHours } from "date-fns";

export class AuthMiddleware extends BaseMiddleware {
    public async handle(req: AuthRequest, res: Response, next: NextFunction, { permissions }) {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({
                message: 'No authentication method found.',
            });
        }

        const [_, token] = authorizationHeader.split('Bearer ');

        if (!token) {
            return res.status(401).json({
                message: 'No authentication method found.',
            });
        }

        let decodedJwt;

        try {
            decodedJwt = jwtDecode(token);
        } catch (e) {
            return res.status(401).json({
                error: 'Invalid authentication, try to re-login',
            });
        }

        req.context = {
            // add if multi-tenant needed.
            // tenantId: decodedJwt.user.tenantId,
            userId: decodedJwt.user.id,
            role: decodedJwt.user.role,
        }

        this.validateDecodedJwt(req, res, decodedJwt)
        this.assertPermissions(req, res, decodedJwt, permissions)

        next();

        this.refreshAuthToken(req, res, decodedJwt);
    }

    /**
     * Refresh token if we're within 1hour of expiration.
     *
     * @param req
     * @param res
     * @param decodedJwt
     * @private
     */
    private refreshAuthToken(req: AuthRequest, res: Response, decodedJwt) {
        const expires = new Date(decodedJwt.exp * 1000);

        if (differenceInHours(expires, new Date()) >= 1) {
            return;
        }

        const token = jwtEncode({
            user: {
                id: decodedJwt.user.id,
                role: decodedJwt.user.role,
                tenantId: decodedJwt.user.tenantId,
            }
        }, '1d', process.env.JWT_SECRET_SESSION);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);

        res.setHeader("Authorization", token);
    }

}