import "dotenv/config";

import crypto from "crypto";
import express from "express";
import MercadoPagoConfig, { Payment, Preference } from "mercadopago";
import { verifySignature } from "./utils/mercadoPago.utils";
import paymentsRouter from "./routes/payments.router";

// declare module "http" {
//   interface IncomingHttpHeaders {
//     "x-signature": string;
//     "x-request-id": string;
//   }
// }

const app = express();
const PORT = process.env.PORT || 3080;

console.log(process.env.MP_ACCESS_TOKEN);

app.use(express.json());
app.use("/payments", paymentsRouter);

// app.get("/api/mercadopago/preference", async (req, res) => {
//   try {
//     const preference = await new Preference(mercadopagoClient).create({
//       body: {
//         items: [
//           {
//             id: "5830db2e-d843-435c-a113-413d8ef3944e",
//             title: "Camiseta básica",
//             quantity: 1,
//             unit_price: 24700,
//           },
//           {
//             id: "8a7a7292-92d8-4094-aa94-d8e3415d880e",
//             title: "Camisa Polo Jean",
//             quantity: 3,
//             unit_price: 32000,
//           },
//         ],
//       },
//     });

//     res.status(201).send(preference);
//     return;
//   } catch (error) {
//     console.error("Error al crear la preferencia:", error);
//     res.status(500).send("Error al crear la preferencia");
//     return;
//   }
// });

// app.get("/api/mercadopago/payments", async (req, res) => {
//   try {
//     const payments = await new Payment(mercadopagoClient).search();

//     res.status(200).send(payments);
//     return;
//   } catch (error) {
//     console.error("Error al obtener los pagos:", error);
//     res.status(500).send("Error al obtener los pagos");
//     return;
//   }
// });

// app.get("/api/mercadopago/payments/:id", async (req, res) => {
//   try {
//     const payment = await new Payment(mercadopagoClient).get({
//       id: req.params.id,
//     });

//     res.status(200).send(payment);
//     return;
//   } catch (error) {
//     console.error("Error al obtener el pago:", error);
//     res.status(500).send("Error al obtener el pago");
//     return;
//   }
// });

// app.post("/api/mercadopago/pago", async (req, res) => {
//   console.log("Nueva notificación de pago recibida:");

//   const { "x-signature": signature, "x-request-id": requestId } = req.headers;
//   const { id } = req.body;

//   const verifiedSignature = verifySignature(id, signature, requestId);
//   console.log(verifiedSignature);

//   res.status(204).send();
//   return;

//   // try {
//   //   const payment = await new Payment(mercadopagoClient).get({
//   //     id: req.body.data.id,
//   //   });

//   //   console.log(payment.net_amount);

//   //   if (payment.status === "approved") {
//   //     console.log(`Pago aprobado exitosamente con el ID ${payment.id}`);
//   //   }

//   //   res.status(204).send();
//   //   return;
//   // } catch (error) {
//   //   console.error("Error al procesar el pago:", error);
//   //   res.status(500).send("Error al procesar el pago");
//   //   return;
//   // }
// });

// app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
