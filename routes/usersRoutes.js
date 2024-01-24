import express from "express";
import { registerUserController, loginUserController, getUserProfileController } from "../controllers/usersController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRouter = express.Router();

userRouter.post('/register', registerUserController);
userRouter.post('/login', loginUserController);
userRouter.get('/profile', isLoggedIn, getUserProfileController);

export default userRouter;