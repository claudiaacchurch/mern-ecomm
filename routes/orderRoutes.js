import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createOrderController,
  getAllOrdersController,
  getOrderController,
  updateOrderController,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderController);
//limited to admin
orderRouter.get("/", isLoggedIn, getAllOrdersController);
orderRouter.get("/:id", isLoggedIn, getOrderController);
orderRouter.put("/:id", isLoggedIn, updateOrderController);

export default orderRouter;
