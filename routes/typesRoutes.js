import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createTypeController,
  deleteTypeController,
  getTypeController,
  getTypesController,
  updateTypeController,
} from "../controllers/productTypesController.js";

const typesRouter = express.Router();

typesRouter.post("/", isLoggedIn, createTypeController);
typesRouter.get("/", getTypesController);
typesRouter.get("/:id", getTypeController);
typesRouter.put("/:id", updateTypeController);
typesRouter.delete("/:id", deleteTypeController);

export default typesRouter;
