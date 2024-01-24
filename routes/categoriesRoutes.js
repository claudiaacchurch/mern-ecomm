import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryController, updateCategoryController } from "../controllers/categoriesController.js";

const categoriesRouter = express.Router();

categoriesRouter.post('/', isLoggedIn, createCategoryController);
categoriesRouter.get('/', getCategoriesController);
categoriesRouter.get('/:id', getCategoryController);
categoriesRouter.put('/:id', updateCategoryController);
categoriesRouter.delete('/:id', deleteCategoryController);

export default categoriesRouter;