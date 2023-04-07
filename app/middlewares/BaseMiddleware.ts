import { intersection, isEmpty } from 'lodash';
import { AuthRequest } from "../types/Requests";
import { Response } from "express";
import { container } from "../lib/container";
import Roles from "../config/Roles";

export class BaseMiddleware {
    /**
     * Authorize jwt. Check if use
     *
     * @param req
     * @param res
     * @param decodedJwt
     * @protected
     */
    protected validateDecodedJwt(req: AuthRequest, res: Response, decodedJwt) {
        const userId = decodedJwt.user.id;

        if (!userId) {
            return res.status(401).json({
                message: '3 Invalid authentication, try to re-login.',
            });
        }

        const tenantId = decodedJwt.user.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                message: '4 Invalid authentication, try to re-login.',
            });
        }

        return res;
    }

    /**
     * Assert permissions - use the role in the jwt
     *
     * @param req
     * @param res
     * @param decoded
     * @param permissions
     * @protected
     */
    protected assertPermissions(req: AuthRequest, res: Response, decoded, permissions) {
        if (permissions) {
            const role = decoded.user.role || null;
            const userPermissions = Roles[role];

            const intersected = intersection(permissions, userPermissions)

            if (isEmpty(intersected)) {
                return res.status(403).json({
                    message: 'You do not have enough permissions.',
                });
            }
        }
    }

    protected setPrisma
}