import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

//@desc create new product
//@route POST api/v1/products
//@access Private/Admin

export const createProductsController = asyncHandler(async(req, res) => {
    const {name, description, brand, category, sizes, colors, user, images, reviews, price, totalQty} 
    = req.body;
    //check logged in user is admin
    const productExists = await Product.findOne({name});
    if (productExists) {
        throw new Error("Product already exists!") 
    };
    //find the category 
    const categoryFound = await Category.findOne({
        name: category.toLowerCase(),
    });
    if (!categoryFound) {
        throw new Error("This category doesn't exist");
    }
    //find the category 
    const brandFound = await Brand.findOne({
        name: brand.toLowerCase(),
    });
    if (!brandFound) {
        throw new Error("This brand doesn't exist");
    }
    //else create the new product
    const product = await Product.create({
        name,
        description,
        brand,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        images,
        reviews,
        price,
        totalQty,
    });
    
    //push product into category (products)
    categoryFound.products.push(product._id);
    //resave
    await categoryFound.save();
    //push product into brand (products)
    brandFound.products.push(product._id);
    await brandFound.save();

    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
});

//@desc Get all products
//@route GET api/v1/products
//@access Public

export const getProductsController = asyncHandler(async(req, res) => {
    //query is the whole response, option to transform this
    let productQuery = Product.find();
    //console.log(req.query.price);
    
    //search by name (req.query = everything after query param "?")
    if(req.query.name) {
        productQuery = productQuery.find({
            //get the name and ignore camel casing
            name: {$regex: req.query.name, $options: 'i'},
        })
    }

    //filter by brand
    if(req.query.brand) {
        productQuery = productQuery.find({
            //get the name and ignore camel casing
            brand: {$regex: req.query.brand, $options: 'i'},
        })
    }

    //filter by category
    if(req.query.category) {
        productQuery = productQuery.find({
            //get the name and ignore camel casing
            category: {$regex: req.query.category, $options: 'i'},
        })
    }

    //filter by color
    if(req.query.colors) {
        productQuery = productQuery.find({
            //get the name and ignore camel casing
            colors: {$regex: req.query.colors, $options: 'i'},
        })
    }

    //filter by sizes
    if(req.query.sizes) {
        productQuery = productQuery.find({
            //get the name and ignore camel casing
            sizes: {$regex: req.query.sizes, $options: 'i'},
        })
    }

    //filter by price range
    if(req.query.price) {
        const priceRange = req.query.price.split("-");
        productQuery = productQuery.find({
            //greater than/ less than or equal to
            price: {$gte: priceRange[0], $lte: priceRange[1]},
        })
    }

    //pagination
    //page: use page user provides or use page 1
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit- how many records per page
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    //start index
    const startIndex = (page - 1) * limit;
    //end index
    const endIndex = page * limit;
    //total products
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    //pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    //await means end the process,  no more queries to mongoose
    const products = await productQuery;

    res.json ({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products
    });
});

//@desc Get single product
//@route GET api/v1/products/:id
//@access Public

export const getProductController = asyncHandler(async(req, res) => {
    //req.params = anything after :
    const product = await Product.findById(req.params.id);
    if(!product) {
        throw new Error("Product not found.");
    } 
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product
    });
});

//@desc Update single product
//@route PUT api/v1/products/:id
//@access Public

export const updateProductController = asyncHandler(async(req, res) => {
    const {name, description, brand, category, sizes, colors, user, images, reviews, price, totalQty} 
    = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name,
        description,
        brand,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        images,
        reviews,
        price,
        totalQty,
    },
    {
        //show new variable in res
        new: true,
    });
    res.json({
        status: "success",
        message: "Product updated successfully",
        product,
    });
});

//@desc Delete single product
//@route DELETE api/v1/products/:id
//@access Public

export const deleteProductController = asyncHandler(async(req, res) => {
    //req.params = anything after :
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) {
        throw new Error("Product not found.");
    } 
    res.json({
        status: "success",
        message: "Product deleted successfully",
        product
    });
});