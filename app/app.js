import express from "express";
import Stripe from "stripe";
import dbConnect from "../config/dbConnect.js";
import dotenv from "dotenv";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import userRouter from "../routes/usersRoutes.js";
import productsRouter from "../routes/productsRoutes.js";
import categoriesRouter from "../routes/categoriesRoutes.js";
import brandsRouter from "../routes/brandsRoutes.js";
import reviewRouter from "../routes/reviewRoutes.js";
import orderRouter from "../routes/orderRoutes.js";
import Order from "../models/Order.js";
import cors from "cors";
import typesRouter from "../routes/typesRoutes.js";

dotenv.config();

dbConnect();
const app = express();
app.use(cors());
// stripe webhook

const stripe = new Stripe(process.env.STRIPE_KEY);
const endpointSecret = process.env.WEBHOOK_ENDPNT;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    if (event.type === "checkout.session.completed") {
      //update order object with correct details (from order controller)
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find order
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      );
      order.save();
    } else {
      return;
    }

    // // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;
    //     console.log(
    //       `PaymentIntent for ${paymentIntent.amount} was successful!`
    //     );
    //     // Then define and call a method to handle the successful payment intent.
    //     // handlePaymentIntentSucceeded(paymentIntent);
    //     break;
    //   case "payment_method.attached":
    //     const paymentMethod = event.data.object;
    //     // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //     // handlePaymentMethodAttached(paymentMethod);
    //     break;
    //   default:
    //     // Unexpected event type
    //     console.log(`Unhandled event type ${event.type}.`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//configure express by passing incoming data
app.use(express.json());

//route setup
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/types/", typesRouter);

//error middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
