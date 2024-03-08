import expressAsyncHandler from 'express-async-handler';
// import dotenv from 'dotenv';
// dotenv.config();
import Stripe from 'stripe';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

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
    throw new Error('Please provide your shipping address');
  }
  // Get the payload(customer, orderItems, shippingAddress, totalPrice)
  // destructure body
  const { orderItems, shippingAddress, totalPrice } = req.body;
  // Check if order is not empty
  if (orderItems.length === 0) {
    throw new Error('No order items.');
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
    const product = products?.find((product) => product?._id.toString() === item?._id.toString());
    if (product) {
      product.totalSold += item.totalQtyBuying;
      product.qtyLeft -= item.totalQtyBuying;
    }
    await product.save();
  });
  // Make payment (stripe)
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Hats',
          description: 'Best hat',
        },
        unit_amount: 10 * 100,
      },
      quantity: 2,
    }],
    // one time or subscription
    mode: 'payment',
    success_url: 'http://localhost:7000',
    cancel_url: 'http://localhost:7000',
  });
  // Payment webhook
  // Update user order
  console.log(session);
  // send url to user
  res.redirect(303, session.url);
});


