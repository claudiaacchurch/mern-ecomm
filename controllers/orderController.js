import expressAsyncHandler from "express-async-handler";
//required to use .env stripe variable
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc create orders
// @route POST api/v1/orders
// @access private

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderController = expressAsyncHandler(async (req, res) => {
  // Find user by id in the request (logged in)
  const user = await User.findById(req.userAuthId);
  // Check if user has shipping address (for order)
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide your shipping address");
  }
  // Get the payload(customer, orderItems, shippingAddress, totalPrice)
  // destructure body
  const { orderItems, shippingAddress, totalPrice } = req.body;
  // Check if order is not empty
  if (orderItems.length === 0) {
    throw new Error("No order items.");
  }
  // Place order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });
  // Push into user.orders
  user.orders.push(order?._id);
  await user.save();
  // Update Product.totalSold (+1) & .totalQty (-1)
  // 1. find all products by id (mongoose terms)
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (item) => {
    const product = products?.find(
      (product) => product?._id.toString() === item?._id.toString()
    );
    if (product) {
      product.totalSold += item.totalQtyBuying;
      product.qtyLeft -= item.totalQtyBuying;
    }
    await product.save();
  });
  // Make payment (stripe)
  //convert orderItems to have same structure as stripe
  const convertedOrderItems = orderItems.map((item) => {
    return {
      price_data: {
        currency: "gbp",
        product_data: {
          name: item?.name,
          description: item?.description,
          // image: item.image,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.totalQtyBuying,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrderItems,
    metadata: {
      //pass in order id to have in webhook
      orderId: order?.id,
    },
    // one time or subscription
    mode: "payment",
    success_url: "http://localhost:7000/success",
    cancel_url: "http://localhost:7000/failure",
  });
  // Payment webhook
  // Update user order
  console.log(session);
  // send url to user
  res.redirect(303, session.url);
});

// @desc create orders
// @route GET api/v1/orders
// @access private

export const getAllOrdersController = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json({
    success: true,
    msg: "all orders",
    orders,
  });
});

// @desc get single order
// @route GET api/v1/orders/:id
// @access private

export const getOrderController = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json({
    success: true,
    msg: "order",
    order,
  });
});

// @desc update order to delivered
// @route PUT api/v1/orders/:id
// @access private

export const updateOrderController = expressAsyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    msg: "order updated",
    order,
  });
});
