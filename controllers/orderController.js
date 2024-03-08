import expressAsyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

//@desc create orders
//@route POST api/v1/orders
//@access private

export const createOrderController = expressAsyncHandler(async (req, res) => {
  //Find user by id in the request (logged in)
  const user = await User.findById(req.userAuthId);
  //Get the payload(customer, orderItems, shippingAddress, totalPrice)
  //destructure body
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //Check if order is not empty
  if (orderItems.length == 0) {
    throw new Error("No order items.");
  }
  //Place order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });
  //Push into user.orders
  user.orders.push(order?._id);
  await user.save();
  //Update Product.totalSold (+1) & .totalQty (-1)
  // 1. find all products by id (mongoose terms)
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (item) => {
    const product = products?.find((product) => {
      return product?._id.toString() === item?._id.toString();
    });
    if (product) {
      product.totalSold += item.totalQtyBuying;
      product.qtyLeft -= item.totalQtyBuying;
    }
    await product.save();
  });
  //Make payment (stripe)
  //Payment webhook
  //Update user order
  res.json({
    success: true,
    message: "Order created",
    order,
    user,
  });
});
