import { Request, Response } from "express";
import { PaymentSchema } from "../schemas/payments.schema";
import { z } from "zod";
import { ProductsService } from "../services/products.service";
import { Payment, Preference } from "mercadopago";
import { mercadopagoClient, verifySignature } from "../utils/mercadoPago.utils";
import { MerchantOrdersService } from "../services/merchantOrders.service";

declare module "http" {
  interface IncomingHttpHeaders {
    "x-signature": string;
    "x-request-id": string;
  }
}

const productsService = new ProductsService();
const merchantOrderService = new MerchantOrdersService();

export class PaymentController {
  static async createPreference(req: Request, res: Response): Promise<void> {
    try {
      const data = await PaymentSchema.parseAsync(req.body);
      console.log(data);

      // Para cada ID que nos hayan mandado, buscamos el producto en la base de datos y lo devolvemos con el precio total (precio unitario * cantidad)
      const products = await Promise.all(
        data.products.map(async ({ id, quantity }) => {
          const product = await productsService.getById(id);

          if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
          }

          return {
            ...product,
            quantity: quantity,
            total: quantity * product?.price,
          };
        })
      );

      // Creamos la orden de compra
      const merchantOrder = await merchantOrderService.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        shipping: data.shipping,
        products: products,
        netAmount: products.reduce(
          (total, product) => total + product.total,
          0
        ),
      });

      // Creamos la preferencia para generar el pago
      const preference = await new Preference(mercadopagoClient).create({
        body: {
          // Excluimos pagos en efectivo
          payment_methods: {
            excluded_payment_types: [{ id: "ticket" }],
            installments: 1,
            default_installments: 1,
          },

          // Añadimos los items
          items: products.map((product) => ({
            id: product.id,
            title: product.name,
            quantity: product.quantity,
            unit_price: product.price,
          })),

          // Añadimos la ID de la orden de compra
          metadata: {
            merchant_order_id: merchantOrder.id,
          },
        },
      });

      res.status(200).json(preference.init_point);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Error al validar los datos:", error);
        res.status(400).json({ message: "Error de validación de datos" });
        return;
      }

      console.error("Error al crear la preferencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { "x-signature": signature, "x-request-id": requestId } =
        req.headers;

      const { id } = req.body;
      const { id: paymentId } = req.body.data;

      // TODO: Revisar esto para asegurar de que el hook sea accionado por MercadoPago
      // const verifySignatureResult = verifySignature(id, signature, requestId);

      const payment = await new Payment(mercadopagoClient).get({
        id: paymentId,
      });

      if (
        payment.status === "approved" &&
        payment.operation_type === "regular_payment" &&
        payment.metadata.merchant_order_id
      ) {
        console.log(
          `Pago aprobado para la orden de compra: ${payment.metadata.merchant_order_id}`
        );

        await merchantOrderService.update(payment.metadata.merchant_order_id, {
          status: "approved",
        });

        // TODO: Enviar email de confirmación de pago al cliente
        // TODO: Enviar email de confirmación de pedido a la tienda
      }

      res.status(200).send();
      return;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      res.status(500).send("Error al procesar el pago");
      return;
    }
  }
}
