import { Request, Response } from "express";
import { PaymentSchema } from "../schemas/payments.schema";
import { z } from "zod";

export class PaymentController {
  static async createPreference(req: Request, res: Response): Promise<void> {
    try {
      const data = await PaymentSchema.parseAsync(req.body);
      console.log(data);

      // Por ahora solo enviamos una respuesta de prueba
      res.status(200).json({
        message: "Preferencia creada correctamente (por implementar)",
      });
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
