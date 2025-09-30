import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Restaurant } from "../models/restaurant.model";
import uploadImageOnCloudinary from "../utils/imageUpload";

// Helper to check restaurant existence
const checkRestaurantExists = (restaurant: any, res: Response) => {
  if (!restaurant) {
    res.status(404).json({ success: false, message: "Restaurant not found" });
    return false;
  }
  return true;
};

// Create a restaurant
export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;

    const existingRestaurant = await Restaurant.findOne({ user: req.id });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already exists for this user",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Restaurant image is required",
      });
    }

    let parsedCuisines: string[] = [];
    try {
      parsedCuisines = JSON.parse(cuisines);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid cuisines format" });
    }

    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

    const restaurant = await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      deliveryTime,
      cuisines: parsedCuisines,
      imageUrl,
    });

    return res.status(201).json({ success: true, message: "Restaurant created", restaurant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get restaurant by user
export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id }).populate("menus");
    if (!checkRestaurantExists(restaurant, res)) return;

    return res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update restaurant
export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;

    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!checkRestaurantExists(restaurant, res)) return;
    
    // TypeScript type assertion since we've verified restaurant exists
    const updatedRestaurant = restaurant!;
    updatedRestaurant.restaurantName = restaurantName;
    updatedRestaurant.city = city;
    updatedRestaurant.country = country;
    updatedRestaurant.deliveryTime = deliveryTime;

    try {
      updatedRestaurant.cuisines = JSON.parse(cuisines);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid cuisines format" });
    }

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
      updatedRestaurant.imageUrl = imageUrl;
    }

    await updatedRestaurant.save();
    return res.status(200).json({ success: true, message: "Restaurant updated", restaurant: updatedRestaurant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders for a restaurant
export const getRestaurantOrder = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!checkRestaurantExists(restaurant, res)) return;

    // TypeScript type assertion since we've verified restaurant exists
    const foundRestaurant = restaurant!;
    const orders = await Order.find({ restaurant: foundRestaurant._id })
      .populate("restaurant")
      .populate("user");

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({ success: true, status: order.status, message: "Status updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Search restaurants
export const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const searchText = req.params.searchText || "";
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = ((req.query.selectedCuisines as string) || "")
      .split(",")
      .filter(Boolean);

    const query: any = {};
    const orConditions: any[] = [];

    if (searchText) {
      orConditions.push(
        { restaurantName: { $regex: searchText, $options: "i" } },
        { city: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } }
      );
    }

    if (searchQuery) {
      orConditions.push(
        { restaurantName: { $regex: searchQuery, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } }
      );
    }

    if (orConditions.length > 0) query.$or = orConditions;
    if (selectedCuisines.length > 0) query.cuisines = { $in: selectedCuisines };

    const restaurants = await Restaurant.find(query);
    return res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get single restaurant by ID
export const getSingleRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { sort: { createdAt: -1 } },
    });

    if (!checkRestaurantExists(restaurant, res)) return;

    return res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
