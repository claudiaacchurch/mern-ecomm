import Type from "../models/Type.js";
import asyncHandler from "express-async-handler";
import { capitaliseFirstLetter } from "../middlewares/utils.js";

//@desc create new type
//@route POST api/v1/types
//@access Private/Admin

export const createTypeController = asyncHandler(async (req, res) => {
  const { name, user, image, products } = req.body;
  //check logged in user is admin
  const typeExists = await Type.findOne({ name });
  if (typeExists) {
    throw new Error("Type already exists!");
  }
  const type = await Type.create({
    //keep it regular
    name: capitaliseFirstLetter(name),
    user: req.userAuthId,
    image,
    products,
  });
  res.json({
    status: "success",
    message: "Type created successfully",
    type,
  });
});

//@desc find all types
//@route GET api/v1/types
//@access Public

export const getTypesController = asyncHandler(async (req, res) => {
  let typeQuery = Type.find();
  if (req.query.name) {
    typeQuery = typeQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  const types = await typeQuery;

  res.json({
    status: "success",
    results: types.length,
    message: "Types fetched successfully",
    types,
  });
});

//@desc find by id
//@route GET api/v1/types/:id
//@access Public

export const getTypeController = asyncHandler(async (req, res) => {
  let typeQuery = Type.findById(req.params.id).populate("products");
  if (!typeQuery) {
    throw new Error("Type doesn't exist!");
  }
  const type = await typeQuery;

  res.json({
    status: "success",
    message: "Type fetched successfully",
    type,
  });
});

//@desc update by id
//@route PUT api/v1/types/:id
//@access Public

export const updateTypeController = asyncHandler(async (req, res) => {
  const { name, user, image, products } = req.body;
  const type = await Type.findByIdAndUpdate(
    req.params.id,
    {
      name,
      user: req.userAuthId,
      image,
      products,
    },
    {
      new: true,
    }
  );
  res.json({
    type,
  });
});

//@desc update by id
//@route DELETE api/v1/types/:id
//@access Public

export const deleteTypeController = asyncHandler(async (req, res) => {
  const { name, user, image, products } = req.body;
  const type = await Type.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Type deleted successfully",
    type,
  });
});
