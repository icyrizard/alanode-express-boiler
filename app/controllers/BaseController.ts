import { Validator } from "../lib/Validator";
import { ValidatorObjectType } from "../types/Validators";
import { Request, Response } from "express";

export class BaseController {
    /**
     * Validate the request body
     *
     * @param req
     * @param res
     * @param validatorObject
     */
    validate(req: Request, res: Response, validatorObject: ValidatorObjectType) {
        const data = req.body;

        return new Validator().validate(req, res, validatorObject, data);
    }

    /**
     * Validate the query parameters
     *
     * @param req
     * @param res
     * @param validatorObject
     */
    validateQuery(req: Request, res: Response, validatorObject: ValidatorObjectType) {
        const data = req.query;

        return new Validator().validate(req, res, validatorObject, data);
    }
}
