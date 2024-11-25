import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.post("/", async (req, res) => {
  console.log("Creando nueva preferencia de pago");

  try {
    console.log(req.body);

    res.status(201).send(req.body);
    return;
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).send("Error al crear la preferencia");
    return;
  }
});

export default paymentsRouter;
