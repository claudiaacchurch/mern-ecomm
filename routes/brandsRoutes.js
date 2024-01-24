import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createBrandController, deleteBrandController, getBrandController, getBrandsController, updateBrandController } from "../controllers/brandController.js";

const brandsRouter = express.Router();

brandsRouter.post('/', isLoggedIn, createBrandController);
brandsRouter.get('/', getBrandsController);
brandsRouter.get('/:id', getBrandController);
brandsRouter.put('/:id', isLoggedIn, updateBrandController);
brandsRouter.delete('/:id', deleteBrandController);

export default brandsRouter;