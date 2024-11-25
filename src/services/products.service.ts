import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import products from "../data/products.json";
import { Product } from "../../types/Product";
import path from "path";
import { JSONOrmService } from "./jsonorm.service";

const productsFilePath = path.join(__dirname, "../data/products.json");

export class ProductsService {
  private productsRepository: JSONOrmService<Product>;

  constructor() {
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
