// Una orden de compra puede tener estados segun el estatus de la transacción
// La orden de compra fue creada y está pendiente de pago (status: "pending")
// La orden de compra fue pagada y está pendiente de enviar (status: "approved")
// La orden de compra fue enviada y está pendiente de recibir (status: "sent")

export interface PurchaseOrder {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  shipping: {
    province: string;
    city: string;
    street: string;
    streetNumber: string;
    floor?: string;
    apartment?: string;
    postalCode: string;
  };
  products: {
    id: string;
    quantity: number;
  };
  netAmount: number;
  status: "pending" | "approved" | "sent";
}
