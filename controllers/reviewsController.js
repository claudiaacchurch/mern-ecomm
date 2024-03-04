import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

//@desc create new review
//@route POST api/v1/reviews
//@access Private/Admin

export const createReviewController = asyncHandler(async(req, res) => {
    const {product, message, rating} = req.body;
    //product to review - destruct ID out of request
    const { productID } = req.params;
    //populate with reviews for hasReviewed
    const productFound = await Product.findById(productID).populate('reviews');
    if(!productFound) {
        throw new Error("Product not found.");
    }
    //check if user already reviewed this product
    const hasReviewed = productFound?.reviews?.find((review) => {
        // check product found, its associated reviews, check if the review.user (userID) is the same userID creating the new review
        return review?.user.toString() === req?.userAuthId?.toString();
    });

    if(hasReviewed) {
        throw new Error("You've already reviewed this product");
    };
    

    //create review 
    const review = await Review.create({
        message,
        rating,
        product: productFound.id,
        user: req.userAuthId,
    });
    //push into product found
    productFound.reviews.push(review?._id);
    await productFound.save();
    res.status(201).json({
        success: true,
        message: "Review created successfully",
    });
});