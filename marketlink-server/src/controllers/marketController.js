import Market from "../models/Market.js";
import Product from "../models/Product.js";
import FarmerProfile from "../models/FarmerProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";

export const listMarkets = asyncHandler(async (req, res) => {
  const markets = await Market.find(req.query.all === "true" ? {} : { status: "active" }).sort({ name: 1 }).lean();
  const withCounts = await Promise.all(markets.map(async (m) => ({ ...m, id: String(m._id), productCount: await Product.countDocuments({ marketId: m._id, isAvailable: true }), farmerCount: await FarmerProfile.countDocuments({ markets: m._id, approvalStatus: "approved" }) })));
  res.json({ markets: withCounts });
});

export const getMarket = asyncHandler(async (req, res) => {
  const filter = /^[0-9a-fA-F]{24}$/.test(req.params.id) ? { _id: req.params.id } : { slug: req.params.id };
  const market = await Market.findOne(filter).lean();
  if (!market) throw new AppError("Market not found", 404);
  const farmers = await FarmerProfile.find({ markets: market._id, approvalStatus: "approved" }).populate("userId", "name phone").lean();
  const products = await Product.find({ marketId: market._id, isAvailable: true }).populate("farmerId", "name").sort({ createdAt: -1 }).limit(30).lean();
  res.json({ market: { ...market, id: String(market._id) }, farmers, products });
});

export const createMarket = asyncHandler(async (req, res) => {
  const data = { ...req.body, slug: `${slugify(req.body.name)}-${Date.now().toString(36)}` };
  const market = await Market.create(data);
  res.status(201).json({ market });
});

export const updateMarket = asyncHandler(async (req, res) => {
  const market = await Market.findById(req.params.id);
  if (!market) throw new AppError("Market not found", 404);
  Object.assign(market, req.body);
  if (req.body.name) market.slug = `${slugify(req.body.name)}-${String(market._id).slice(-6)}`;
  await market.save();
  res.json({ market });
});

export const deleteMarket = asyncHandler(async (req, res) => {
  const market = await Market.findById(req.params.id);
  if (!market) throw new AppError("Market not found", 404);
  const productCount = await Product.countDocuments({ marketId: market._id });
  if (productCount) throw new AppError("Remove or reassign products before deleting this market.", 409);
  await FarmerProfile.updateMany({ markets: market._id }, { $pull: { markets: market._id } });
  await market.deleteOne();
  res.json({ message: "Market deleted" });
});
