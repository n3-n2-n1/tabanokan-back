import { Request, Response } from "express";
import { PaymentSchema } from "../schemas/payments.schema";
import { z } from "zod";
import { ProductsService } from "../services/products.service";
import { Preference } from "mercadopago";
import { mercadopagoClient } from "../utils/mercadoPago.utils";
import { PurchaseOrdersService } from "../services/purchaseOrders.service";

const productsService = new ProductsService();
const purchaseOrdersService = new PurchaseOrdersService();

export class PaymentController {
  static async createPreference(req: Request, res: Response): Promise<void> {
    try {
      const data = await PaymentSchema.parseAsync(req.body);
      console.log(data);

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

      const preference = await new Preference(mercadopagoClient).create({
        body: {
          items: products.map((product) => ({
            id: product.id,
            title: product.name,
            quantity: product.quantity,
            unit_price: product.price,
          })),
        },
      });

      await purchaseOrdersService.create({
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

      res.status(200).json(preference);
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
}
