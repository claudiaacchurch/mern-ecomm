import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";

//@desc create new category
//@route POST api/v1/categories
//@access Private/Admin

export const createCategoryController = asyncHandler(async(req, res) => {
    const {name, user, image, products} 
    = req.body;
    //check logged in user is admin
    const categoryExists = await Category.findOne({name});
    if (categoryExists) {
        throw new Error("Category already exists!") 
    };
    const category = await Category.create({
        //keep it regular
        name: name.toLowerCase(),
        user: req.userAuthId,
        image,
        products
    });
    res.json({
        status: "success",
        message: "Category created successfully",
        category
    });
});

//@desc find all categories
//@route GET api/v1/categories
//@access Public

export const getCategoriesController = asyncHandler(async(req, res) => {
    let categoryQuery = Category.find();
    if(req.query.name) {
        categoryQuery = categoryQuery.find({
            name: {$regex: req.query.name, $options: 'i'},
        });
    };

    const categories = await categoryQuery;

    res.json ({
        status: "success",
        results: categories.length,
        message: "Categories fetched successfully",
        categories
    });
});

//@desc find by id
//@route GET api/v1/categories/:id
//@access Public

export const getCategoryController = asyncHandler(async(req, res) => {
    let categoryQuery = Category.findById(req.params.id);
    if(!categoryQuery) {
        throw new Error("Category doesn't exist!")
    }
    const category = await categoryQuery;

    res.json ({
        status: "success",
        message: "Category fetched successfully",
        category
    });
});

//@desc update by id
//@route PUT api/v1/categories/:id
//@access Public

export const updateCategoryController = asyncHandler(async(req, res) => {
    const {name, user, image, products} = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name,
        user: req.userAuthId,
        image,
        products
    },
    {
        new: true,
    });
    res.json ({
        status: "success",
        message: "Category updated successfully",
        category
    });
});

//@desc update by id
//@route DELETE api/v1/categories/:id
//@access Public

export const deleteCategoryController = asyncHandler(async(req, res) => {
    const {name, user, image, products} = req.body;
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json ({
        status: "success",
        message: "Category deleted successfully",
        category
    });
});