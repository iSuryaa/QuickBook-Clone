import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import businessesRouter from "./businesses";
import bookingsRouter from "./bookings";
import customerRouter from "./customer";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(businessesRouter);
router.use(bookingsRouter);
router.use(customerRouter);

export default router;
