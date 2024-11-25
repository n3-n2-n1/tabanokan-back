import path from "path";
import { Product } from "../types/Product";
import { JSONOrmService } from "./jsonorm.service";

export class ProductsService {
  private productsRepository: JSONOrmService<Product>;

  constructor() {
    const productsFilePath = path.join(__dirname, "../data/products.json");
    this.productsRepository = new JSONOrmService<Product>(productsFilePath);
  }

  async getAll() {
    return this.productsRepository.getAll();
  }

  async getById(id: string) {
    return this.productsRepository.read(id);
  }

  async create(product: Product) {
    return this.productsRepository.create(product);
  }

  async update(id: string, updates: Partial<Product>) {
    return this.productsRepository.update(id, updates);
  }

  async delete(id: string) {
    return this.productsRepository.delete(id);
  }
}
