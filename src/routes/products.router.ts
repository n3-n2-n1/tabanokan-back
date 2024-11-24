import { Router } from "express";
import products from "../data/products.json";

const productRouter = Router();

productRouter.get("/", (req, res) => {
  res.send(products);
});
productRouter.post("/", (req, res) => {});

productRouter.get("/:id", (req, res) => {});
productRouter.put("/:id", (req, res) => {});
productRouter.delete("/:id", (req, res) => {});

export default productRouter;
