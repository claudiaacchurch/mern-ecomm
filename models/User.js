import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    wishlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WishList',
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postcode: {
        type: String,
      },
      country: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

// compile schema to model
const User = mongoose.model('User', UserSchema);

export default User;
