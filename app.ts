// src/app.ts
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { Product } from "./types/Product";

const app = express();
// src/app.ts
const productsFilePath = path.resolve(__dirname, "src/data", "products.json");

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Rutas para obtener todos los productos
app.get("/products", (req, res) => {
  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer productos" });
    }
    const products: Product[] = JSON.parse(data);
    res.json(products);
  });
});

// Ruta para agregar un producto
app.post("/products", (req, res) => {
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

// Ruta para editar un producto
app.put("/products/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProduct: Product = req.body;

  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer productos" });
    }

    const products: Product[] = JSON.parse(data);
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    products[productIndex] = updatedProduct;

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir el archivo:", err);
        return res.status(500).json({ error: "Error al actualizar el producto" });
      }
      res.json(updatedProduct);
    });
  });
});

// Ruta para eliminar un producto
app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer productos" });
    }

    const products: Product[] = JSON.parse(data);
    const updatedProducts = products.filter((product) => product.id !== productId);

    fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir el archivo:", err);
        return res.status(500).json({ error: "Error al eliminar el producto" });
      }
      res.status(204).send();
    });
  });
});

// Exporta la instancia de `app`
export default app;
