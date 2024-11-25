import path from "path";
import { JSONOrmService } from "./jsonorm.service";
import { MerchantOrder } from "../types/MerchantOrder";

export class MerchantOrdersService {
  private merchantOrderRepository: JSONOrmService<MerchantOrder>;

  constructor() {
    const filePath = path.join(__dirname, "../data/merchantOrders.json");
    this.merchantOrderRepository = new JSONOrmService<MerchantOrder>(filePath);
  }

  async getAll() {
    return this.merchantOrderRepository.getAll();
  }

  async getById(id: string) {
    return this.merchantOrderRepository.read(id);
  }

  async create(product: Omit<MerchantOrder, "id" | "status">) {
    return this.merchantOrderRepository.create({
      ...product,
      status: "pending",
    });
  }

  async update(id: string, updates: Partial<MerchantOrder>) {
    return this.merchantOrderRepository.update(id, updates);
  }

  async delete(id: string) {
    return this.merchantOrderRepository.delete(id);
  }
}
