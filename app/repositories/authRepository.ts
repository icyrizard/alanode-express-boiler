import { Response } from "express";
import { User } from '@prisma/client';
import { jwtDecode, jwtEncode } from "../lib/functions";
import { AuthRequest } from "../types/Requests";
/**
 * @param area
 * @param activityTypes
 * @private
 */
import { addHours, differenceInMinutes } from "date-fns";
import { JwtAuthDecoded } from "../types/Auth";

export default {
    createAuthorizationJwt(user: User, tenantId: number = null): string {
        return jwtEncode({
            user: {
                id: user.id,
                role: user.role,
                // tenantId: tenantId,
            }
        });
    },

    /**
     * Sets a new session cookie in the response.
     *
     * The result will be a 'Set-Cookie' header that's only sent to domain of env.API_DOMAIN.
     *
     * @param res
     * @param decodedJwt
     */
    setNewSessionToken(res: Response, decodedJwt: JwtAuthDecoded) {
        const sessionToken = jwtEncode({
            user: {
                id: decodedJwt.user.id,
                role: decodedJwt.user.role,
                // tenantId: decodedJwt.user?.tenantId,
            }
        }, '1h', process.env.JWT_SECRET_SESSION);

        const expiresAt = addHours(new Date(), 1);

        res.cookie("session_token", sessionToken, {
            httpOnly: false,
            secure: true,
            path: "/",
            sameSite: 'none',
            domain: process.env.API_DOMAIN,
            expires: expiresAt
        })
    },

    /**
     * Refresh the session token (used for getting cdn request which gets presignUrls for media).
     *
     * @param req
     * @param res
     * @private
     */
    refreshSessionToken(req: AuthRequest, res: Response) {
        const token = req.cookies['session_token'] ?? null;

        // should probably never happen, but it could.
        if (!token) {
            this.setNewSessionToken(res, {
                user: {
                    id: req.context.userId,
                    role: req.context.role,
                    // tenantId: req.context.tenantId,
                }
            });

            return;
        }

        let decodedJwt = null;

        try {
            decodedJwt = jwtDecode(token, process.env.JWT_SECRET_SESSION);
        } catch (e) {
            return res.status(401).json({
                message: 'Invalid authentication, try to re-login',
            });
        }

        const expires = new Date(decodedJwt.exp * 1000);

        const diff = differenceInMinutes(expires, new Date());

        // dont send if expired, or not expiring within 30 minutes.
        if (diff <= 0 || diff >= 30) {
            return;
        }

        this.setNewSessionToken(res, decodedJwt);
    }
}
