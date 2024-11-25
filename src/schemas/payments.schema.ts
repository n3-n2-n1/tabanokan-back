import { z } from "zod";

// Esquema del campo "shipping"
const ShippingSchema = z.object({
  province: z.string().min(1, "La provincia es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  street: z.string().min(1, "La calle es requerida"),
  streetNumber: z.string().min(1, "El número de la calle es requerido"),
  floor: z.string().optional(), // Campo opcional
  apartment: z.string().optional(), // Campo opcional
  postalCode: z.string().min(1, "El código postal es requerido"),
});

// Esquema del campo "products"
const ProductSchema = z.object({
  id: z.string().uuid("El ID del producto debe ser un UUID válido"),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
});

// Esquema principal del body
export const PaymentSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("El correo electrónico no es válido"),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, "El teléfono debe contener entre 7 y 15 dígitos"),
  shipping: ShippingSchema,
  products: z
    .array(ProductSchema)
    .nonempty("Debes enviar al menos un producto"),
});
