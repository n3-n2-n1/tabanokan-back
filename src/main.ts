import "dotenv/config";

import express from "express";
import cors from "cors";

import paymentsRouter from "./routes/payments.router";
import productsRouter from "./routes/products.router";

const app = express();
const PORT = process.env.PORT || 3080;

console.log(process.env.MP_ACCESS_TOKEN);

app.use(express.json());
app.use(cors({ origin: 'tabanokan.store' }))

app.use("/products", productsRouter);
app.use("/payments", paymentsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
