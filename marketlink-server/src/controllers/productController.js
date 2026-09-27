import Product from "../models/Product.js";
import FarmerProfile from "../models/FarmerProfile.js";
import Market from "../models/Market.js";
import Review from "../models/Review.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";

const transform = (p) => {
  const x = p.toObject ? p.toObject() : p;
  return {
    ...x,
    id: String(x._id || x.id),
    stock: Number(x.quantityAvailable ?? x.stock ?? 0),
    farmer: x.farmerId?.name || x.farmerName || "Local Farmer",
    farmerId: x.farmerId?._id ? String(x.farmerId._id) : x.farmerId ? String(x.farmerId) : undefined,
    marketId: x.marketId?._id ? String(x.marketId._id) : x.marketId ? String(x.marketId) : undefined,
    distance: x.distance || "Local pickup",
  };
};

export const listProducts = asyncHandler(async (req, res) => {
  const { search = "", category, market, farmer, marketDay, minPrice, maxPrice, available } = req.query;
  const q = {};
  if (search.trim()) q.$text = { $search: search.trim() };
  if (category && category !== "All") q.category = category;
  if (market) q.marketId = market;
  if (farmer) q.farmerId = farmer;
  if (available !== undefined) q.isAvailable = available !== "false";
  if (minPrice !== undefined && !Number.isNaN(Number(minPrice))) q.price = { ...(q.price || {}), $gte: Number(minPrice) };
  if (maxPrice !== undefined && !Number.isNaN(Number(maxPrice))) q.price = { ...(q.price || {}), $lte: Number(maxPrice) };

  let products = await Product.find(q).populate("farmerId", "name email").populate("marketId", "name day time operatingDays address").sort({ createdAt: -1 }).lean();
  if (marketDay) products = products.filter((p) => {
    const m = p.marketId;
    return m && ((m.day || "").toLowerCase() === String(marketDay).toLowerCase() || (m.operatingDays || []).map((d) => d.toLowerCase()).includes(String(marketDay).toLowerCase()));
  });
  res.json({ products: products.map(transform), count: products.length });
});

export const getProduct = asyncHandler(async (req, res) => {
  const filter = /^[0-9a-fA-F]{24}$/.test(req.params.id) ? { _id: req.params.id } : { slug: req.params.id };
  const p = await Product.findOne(filter).populate("farmerId", "name email phone").populate("marketId");
  if (!p) throw new AppError("Product not found", 404);
  const reviews = await Review.find({ productId: p._id }).populate("customerId", "name").sort({ createdAt: -1 }).limit(30);
  res.json({ product: transform(p), reviews });
});

export const createProduct = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOne({ userId: req.user._id });
  if (!profile || profile.approvalStatus !== "approved") throw new AppError("Farmer approval is required before listing products.", 403);
  const marketId = req.body.marketId || profile.markets?.[0];
  if (!marketId) throw new AppError("Select a market for this product.", 422, { marketId: "Market is required" });
  const market = await Market.findById(marketId);
  if (!market || market.status !== "active") throw new AppError("Selected market is not available.", 422, { marketId: "Select an active market" });

  const name = String(req.body.name || "").trim();
  if (name.length < 2) throw new AppError("Product name is required.", 422, { name: "Product name is required" });
  const product = await Product.create({
    farmerId: req.user._id,
    marketId,
    name,
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    category: req.body.category,
    description: req.body.description || "",
    price: Number(req.body.price),
    unit: req.body.unit || "/kg",
    quantityAvailable: Number(req.body.quantityAvailable ?? req.body.stock ?? 0),
    image: req.body.image || "",
    isAvailable: req.body.isAvailable !== false,
    weeklyTemplate: Boolean(req.body.weeklyTemplate),
    useCase: req.body.useCase || "daily",
    productType: req.body.productType || "Fresh Produce",
    harvestStatus: req.body.harvestStatus || "Fresh",
    harvestDate: req.body.harvestDate || undefined,
    deliveryType: "Market pickup",
    minOrder: Number(req.body.minOrder || 1),
    bulkPrice: Number(req.body.bulkPrice || 0),
    badge: req.body.badge || "Fresh",
    organic: Boolean(req.body.organic),
  });
  await FarmerProfile.updateOne({ userId: req.user._id }, { $inc: { productCount: 1 } });
  res.status(201).json({ product: transform(await product.populate(["farmerId", "marketId"])) });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  if (req.user.role !== "admin" && String(product.farmerId) !== String(req.user._id)) throw new AppError("You can only modify your own products.", 403);
  const allowed = ["name","category","description","price","unit","quantityAvailable","image","isAvailable","weeklyTemplate","useCase","productType","harvestStatus","harvestDate","minOrder","bulkPrice","badge","organic","marketId"];
  for (const key of allowed) if (req.body[key] !== undefined) product[key] = ["price","quantityAvailable","minOrder","bulkPrice"].includes(key) ? Number(req.body[key]) : req.body[key];
  await product.save();
  res.json({ product: transform(await product.populate(["farmerId", "marketId"])) });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  if (req.user.role !== "admin" && String(product.farmerId) !== String(req.user._id)) throw new AppError("You can only remove your own products.", 403);
  await product.deleteOne();
  await FarmerProfile.updateOne({ userId: product.farmerId }, { $inc: { productCount: -1 } });
  res.json({ message: "Product deleted" });
});

export const moderateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isAvailable: Boolean(req.body.isAvailable) }, { new: true }).populate("farmerId", "name").populate("marketId");
  if (!product) throw new AppError("Product not found", 404);
  res.json({ product: transform(product) });
});
