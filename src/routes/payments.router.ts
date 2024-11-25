import { Router } from "express";
import { PaymentController } from "../controllers/payments.controller";

const paymentsRouter = Router();

paymentsRouter.post("/", PaymentController.createPreference);
paymentsRouter.post("/webhook", PaymentController.handleWebhook);

export default paymentsRouter;
