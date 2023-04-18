import { Router } from "express";
import userRouter from "./_userRouter";
import { authLocalRouter } from "./_authLocalRouter";

const router = Router();

router.use('/', authLocalRouter);

// authenticated users
// ===================
router.use('/', userRouter);

export default router;