import { Router } from 'express';
import { AuthController } from "../controllers/AuthController";
import { uses } from "../lib/functions";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const authLocalRouter = Router();

const authController = new AuthController();
const authMiddleware = new AuthMiddleware()

authLocalRouter.post('/auth/local/register', uses({
        context: authController,
        fn: authController.register
    })
);

authLocalRouter.post('/auth/local', uses({
        context: authController,
        fn: authController.login,
    })
);

authLocalRouter.post('/ping',
    uses({
        context: authMiddleware,
        fn: authMiddleware.handle,
    }),
    uses({
        context: authController,
        fn: authController.ping,
    })
);

export { authLocalRouter };