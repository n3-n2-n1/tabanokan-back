import { Router } from "express";
import { PaymentController } from "../controllers/payments.controller";

const paymentsRouter = Router();

paymentsRouter.post("/", PaymentController.createPreference);

export default paymentsRouter;
