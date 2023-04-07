import StorageDriver from "../services/StorageDriver";
import { AuthRequest } from "../types/Requests";
import { BaseController } from "./BaseController";
import { Response } from "express";

export class CdnController extends BaseController {
    private storage: StorageDriver;

    constructor() {
        super();

        this.storage = new StorageDriver();
    }

    public async getUrl(req: AuthRequest, res: Response) {
        const path = req.params[0];

        const cdnPath = await this.storage.getPath(path);

        return res.redirect(cdnPath);
    }
}