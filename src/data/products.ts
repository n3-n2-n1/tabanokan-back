// src/routes/products.ts
import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Product } from "../types/Product";

const router = Router();
const productsFilePath = path.join(__dirname, "../src/data/products.json");

// Obtener todos los productos
router.get("/", (req: Request, res: Response) => {
  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer productos" });
    }
    const products: Product[] = JSON.parse(data);
    res.json(products);
  });
});

// Agregar un producto
router.post("/", (req: Request, res: Response) => {
  const newProduct: Product = req.body;

  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer productos" });
    }

    const products: Product[] = JSON.parse(data);
    products.push(newProduct);

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir el archivo:", err);
        return res.status(500).json({ error: "Error al guardar el producto" });
      }
      res.status(201).json(newProduct);
    });
  });
});

// Editar un producto
router.put("/:id", (req: Request, res: Response) => {
  const productId = req.params.id;
  const updatedProduct: Product = req.body;

  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer productos" });
    }

    const products: Product[] = JSON.parse(data);
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    products[productIndex] = updatedProduct;

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir el archivo:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar el producto" });
      }
      res.json(updatedProduct);
    });
  });
});

// Eliminar un producto
router.delete("/:id", (req: Request, res: Response) => {
  const productId = req.params.id;

  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer productos" });
    }

    const products: Product[] = JSON.parse(data);
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );

    fs.writeFile(
      productsFilePath,
      JSON.stringify(updatedProducts, null, 2),
      (err) => {
        if (err) {
          console.error("Error al escribir el archivo:", err);
          return res
            .status(500)
            .json({ error: "Error al eliminar el producto" });
        }
        res.status(204).send();
      }
    );
  });
});

export default router;
