import User from "../models/User.js";
import FarmerProfile from "../models/FarmerProfile.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Market from "../models/Market.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";

export const listFarmers = asyncHandler(async (req, res) => {
  const profiles = await FarmerProfile.find({ approvalStatus: "approved" }).populate("userId", "name email phone status").populate("markets", "name address day time").lean();
  const out = await Promise.all(profiles.map(async (p) => ({ ...p, id: String(p._id), name: p.userId?.name, latitude: p.latitude, longitude: p.longitude, products: await Product.countDocuments({ farmerId: p.userId?._id, isAvailable: true }) })));
  res.json({ farmers: out });
});

export const getFarmer = asyncHandler(async (req, res) => {
  const rawId = req.params.id;
  const profile = await FarmerProfile.findOne(/^[0-9a-fA-F]{24}$/.test(rawId) ? { userId: rawId } : { slug: rawId }).populate("markets");
  const userId = profile?.userId;
  const user = await User.findById(userId).select("name email phone status role");
  if (!user || !profile) throw new AppError("Farmer not found", 404);
  const products = await Product.find({ farmerId: userId, isAvailable: true }).populate("marketId", "name day time").sort({ createdAt: -1 });
  const reviews = await Review.find({ farmerId: userId }).populate("customerId", "name").populate("productId", "name").sort({ createdAt: -1 }).limit(30);
  res.json({ farmer: { user, profile }, products, reviews });
});

export const getFarmerProducts = asyncHandler(async (req, res) => {
  const farmerId = req.params.id;
  const products = await Product.find({ farmerId }).populate("marketId", "name day time").sort({ createdAt: -1 });
  res.json({ products });
});

export const updateProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "farmer") throw new AppError("Farmer access required", 403);
  const profile = await FarmerProfile.findOne({ userId: req.user._id });
  if (!profile) throw new AppError("Farmer profile not found", 404);
  const allowed = ["stallName","contactPerson","markets","operatingDays","pickupWindows","address","latitude","longitude","specialty","bio","image"];
  for (const key of allowed) if (req.body[key] !== undefined) profile[key] = req.body[key];
  await profile.save();
  res.json({ profile });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  const [products,orders,revenue,reviews] = await Promise.all([
    Product.countDocuments({ farmerId }),
    Order.countDocuments({ farmerId }),
    Order.aggregate([{ $match: { farmerId, status: { $in: ["ACCEPTED","READY","COMPLETED"] } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Review.countDocuments({ farmerId }),
  ]);
  const pending = await Order.countDocuments({ farmerId, status: "PLACED" });
  const topProducts = await Order.aggregate([{ $match: { farmerId } }, { $unwind: "$items" }, { $group: { _id: "$items.productId", sold: { $sum: "$items.qty" }, revenue: { $sum: "$items.subtotal" } } }, { $sort: { sold: -1 } }, { $limit: 5 }]);
  res.json({ stats: { products, orders, pendingOrders: pending, revenue: revenue[0]?.total || 0, reviews }, topProducts });
});
