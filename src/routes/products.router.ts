import { Router } from "express";
import products from "../data/products.json";
import { ProductsService } from "../services/products.service";

const productRouter = Router();
const productsService = new ProductsService();

productRouter.get("/", async (req, res) => {
  res.send(await productsService.getAll());
});

productRouter.get("/:id", async (req, res) => {
  res.send(await productsService.getById(req.params.id));
});

export default productRouter;
