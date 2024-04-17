import express from "express";
import {
  registerUserController,
  loginUserController,
  getUserProfileController,
  updateShippingAddressController,
  checkUserExistsCotroller,
} from "../controllers/usersController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRouter = express.Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.get("/profile", isLoggedIn, getUserProfileController);
userRouter.put("/update/shipping", isLoggedIn, updateShippingAddressController);
userRouter.get("/check-email", checkUserExistsCotroller);

export default userRouter;
