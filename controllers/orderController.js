import expressAsyncHandler from "express-async-handler";
import Order from "../models/Order.js";

//@desc create orders
//@route POST api/v1/orders
//@access private

export const createOrderController = expressAsyncHandler(async (req, res) => {
  res.json({
    msg: "Order Controller",
  });
});
