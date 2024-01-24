import Brand from "../models/Brand.js";
import asyncHandler from "express-async-handler";

//@desc create new brand
//@route POST api/v1/brands
//@access Private/Admin

export const createBrandController = asyncHandler(async(req, res) => {
    const {name, user, products} 
    = req.body;
    //check logged in user is admin
    const brandExists = await Brand.findOne({name});
    if (brandExists) {
        throw new Error("Brand already exists!") 
    };
    const brand = await Brand.create({
        //keep it regular
        name: name.toLowerCase(),
        user: req.userAuthId,
        products
    });
    res.json({
        status: "success",
        message: "Brand created successfully",
        brand
    });
});

//@desc find all brands
//@route GET api/v1/brands
//@access Public

export const getBrandsController = asyncHandler(async(req, res) => {
    let brandQuery = Brand.find();
    if(req.query.name) {
        brandQuery = brandQuery.find({
            name: {$regex: req.query.name, $options: 'i'},
        });
    };

    const brands = await brandQuery;

    res.json ({
        status: "success",
        results: brands.length,
        message: "Brands fetched successfully",
        brands
    });
});

//@desc find by id
//@route GET api/v1/brands/:id
//@access Public

export const getBrandController = asyncHandler(async(req, res) => {
    let brandQuery = Brand.findById(req.params.id);
    if(!brandQuery) {
        throw new Error("Brand doesn't exist!")
    }
    const brand = await brandQuery;

    res.json ({
        status: "success",
        message: "Brand fetched successfully",
        brand
    });
});

//@desc update by id
//@route PUT api/v1/brands/:id
//@access Public

export const updateBrandController = asyncHandler(async(req, res) => {
    const {name, user, products} = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name,
        user: req.userAuthId,
        products
    },
    {
        new: true,
    });
    res.json ({
        status: "success",
        message: "Brand updated successfully",
        brand
    });
});

//@desc update by id
//@route DELETE api/v1/brands/:id
//@access Public

export const deleteBrandController = asyncHandler(async(req, res) => {
    const {name, user, products} = req.body;
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json ({
        status: "success",
        message: "Brand deleted successfully",
        brand
    });
});