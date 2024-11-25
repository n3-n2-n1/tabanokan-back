import "dotenv/config";

import express from "express";
import paymentsRouter from "./routes/payments.router";

const app = express();
const PORT = process.env.PORT || 3080;

console.log(process.env.MP_ACCESS_TOKEN);

app.use(express.json());
app.use("/payments", paymentsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
