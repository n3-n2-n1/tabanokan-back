import * as fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export interface JSONOrm<T> {
  create(item: Omit<T, "id">): Promise<T>;
  read(id: string): Promise<T | undefined>;
  update(id: string, updates: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(): Promise<T[]>;
}

export class JSONOrmService<T extends { id: string }> implements JSONOrm<T> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async readJSON(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data) as T[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        await fs.writeFile(this.filePath, JSON.stringify([]));
        return [];
      }
      throw error;
    }
  }

  private async writeJSON(data: T[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(item: Omit<T, "id">): Promise<T> {
    const items = await this.readJSON();
    const newItem: T = { ...item, id: uuidv4() } as T; // Agregamos un UUID como ID
    items.push(newItem);
    await this.writeJSON(items);
    return newItem;
  }

  async read(id: string): Promise<T | undefined> {
    const items = await this.readJSON();
    return items.find((item) => item.id === id);
  }

  async update(id: string, updates: Partial<T>): Promise<void> {
    const items = await this.readJSON();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Item with id "${id}" not found`);
    }

    items[index] = { ...items[index], ...updates };
    await this.writeJSON(items);
  }

  async delete(id: string): Promise<void> {
    const items = await this.readJSON();
    const filteredItems = items.filter((item) => item.id !== id);

    if (items.length === filteredItems.length) {
      throw new Error(`Item with id "${id}" not found`);
    }

    await this.writeJSON(filteredItems);
  }

  async getAll(): Promise<T[]> {
    return await this.readJSON();
  }
}
