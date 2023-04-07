import { Router } from "express";
import { userRouter } from "./_userRouter";

const router = Router();

// authenticated users
// ===================
//users
router.use('/', userRouter);

export default router;