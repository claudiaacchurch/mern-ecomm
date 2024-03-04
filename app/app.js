import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from "dotenv";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import userRouter from "../routes/usersRoutes.js";
import productsRouter from "../routes/productsRoutes.js";
import categoriesRouter from "../routes/categoriesRoutes.js";
import brandsRouter from "../routes/brandsRoutes.js";
import reviewRouter from "../routes/reviewRoutes.js";
import orderRouter from "../routes/orderRoutes.js";

dotenv.config();

dbConnect();
const app = express();
//configure express by passing incoming data
app.use(express.json());

//route setup
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);

//error middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
