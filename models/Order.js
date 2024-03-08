import mongoose from "mongoose";

const Schema = mongoose.Schema;

//generate random string for order number
const randomText = Math.random().toString(15).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);
const OrderSchema = new Schema(
  {
    //want to know what user is placing the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //what order does the user want to place
    orderItems: [
      {
        type: Object,
        required: true,
      },
    ],
    //get from user and push in
    shippingAddress: {
      type: Object,
      required: true,
    },
    //randomly generated
    orderNumber: {
      type: String,
      required: true,
      default: randomText + randomNumbers,
    },
    //for Stripe
    paymentStatus: {
      type: String,
      default: "Not paid.",
    },
    paymentMethod: {
      type: String,
      default: "Not specified.",
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    //for admin to update order status
    status: {
      type: String,
      default: "pending",
      //accepted values
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
