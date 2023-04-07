import { uses } from '../lib/functions';
import { Router } from 'express';
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";
import { editOwnResources, getOwnResources } from "../config/Roles";

const userRouter = Router();

const controller = new UserController();
const authMiddleware = new AuthMiddleware()

userRouter.get('/profile',
    uses({
        context: authMiddleware,
        fn: authMiddleware.handle,
        permissions: [getOwnResources],
    }),
    uses({
        context: controller,
        fn: controller.profile,
    })
);

userRouter.get('/me',
    uses({
        context: authMiddleware,
        fn: authMiddleware.handle,
        permissions: [editOwnResources],
    }),
    uses({
        context: controller,
        fn: controller.findMe,
    })
)

userRouter.put('/me',
    uses({
        context: authMiddleware,
        fn: authMiddleware.handle,
        permissions: [editOwnResources],
    }),
    uses({
        context: controller,
        fn: controller.updateMe,
    })
)

export default userRouter;