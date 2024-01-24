import express from "express";
import { createProductsController, deleteProductController, getProductController, getProductsController, updateProductController } from "../controllers/productsController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const productRouter = express.Router();

productRouter.post('/', isLoggedIn, createProductsController);
productRouter.get('/', getProductsController);
productRouter.get('/:id', getProductController);
productRouter.delete('/:id', deleteProductController);
productRouter.put('/:id', updateProductController);

export default productRouter;