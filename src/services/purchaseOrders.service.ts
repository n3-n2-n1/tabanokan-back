import path from "path";
import { JSONOrmService } from "./jsonorm.service";
import { PurchaseOrder } from "../types/Payment";

export class PurchaseOrdersService {
  private purchaseOrderRepository: JSONOrmService<PurchaseOrder>;

  constructor() {
    const filePath = path.join(__dirname, "../data/purchaseOrders.json");
    this.purchaseOrderRepository = new JSONOrmService<PurchaseOrder>(filePath);
  }

  async getAll() {
    return this.purchaseOrderRepository.getAll();
  }

  async getById(id: string) {
    return this.purchaseOrderRepository.read(id);
  }

  async create(product: Omit<PurchaseOrder, "id" | "status">) {
    return this.purchaseOrderRepository.create({
      ...product,
      status: "pending",
    });
  }

  async update(id: string, updates: Partial<PurchaseOrder>) {
    return this.purchaseOrderRepository.update(id, updates);
  }

  async delete(id: string) {
    return this.purchaseOrderRepository.delete(id);
  }
}
