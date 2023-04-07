import { uses } from '../lib/functions';
import { Router } from 'express';
import { CdnController } from "../controllers/CdnController";
import { AuthSessionMiddleware } from "../middlewares/AuthSessionMiddleware";

const cdnRouter = Router();

const cdnController = new CdnController();
const authSessionMiddleware = new AuthSessionMiddleware()

cdnRouter.get('/*',
    uses({
        context: authSessionMiddleware,
        fn: authSessionMiddleware.handle,
    }),
    uses({
        context: cdnController,
        fn: cdnController.getUrl,
    })
)

export default cdnRouter;