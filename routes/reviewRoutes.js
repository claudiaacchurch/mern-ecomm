import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewController } from "../controllers/reviewsController.js";

const reviewRouter = express.Router();

reviewRouter.post("/:productID", isLoggedIn, createReviewController);

export default reviewRouter;