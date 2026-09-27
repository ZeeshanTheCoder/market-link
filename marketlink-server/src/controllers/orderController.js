import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import FarmerProfile from "../models/FarmerProfile.js";
import Market from "../models/Market.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { notify } from "../utils/notify.js";
import User from "../models/User.js";

const TAX_RATE = 0.05;
const visible = (o) => {
  const x = o.toObject ? o.toObject() : o;
  return { ...x, id: String(x._id), customerId: String(x.customerId), farmerId: String(x.farmerId), marketId: String(x.marketId), total: Number(x.totalAmount), pickupDate: x.pickupDate ? new Date(x.pickupDate).toISOString().slice(0,10) : null };
};

async function verifyPickup(marketId, pickupDate, slot) {
  const market = await Market.findById(marketId);
  if (!market || market.status !== "active") throw new AppError("Selected market is not available.", 422);
  if (!pickupDate || !slot) throw new AppError("Pickup date and time slot are required.", 422, { pickupDate: "Required", pickupTimeSlot: "Required" });
}

export const createOrder = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length) throw new AppError("Your cart is empty.", 422);
  const ids = items.map(i => i.productId);
  if (ids.some(id => !mongoose.isValidObjectId(id))) throw new AppError("One or more products are invalid.", 422);
  const products = await Product.find({ _id: { $in: ids }, isAvailable: true }).populate("farmerId", "name");
  if (products.length !== ids.length) throw new AppError("One or more products are unavailable.", 409);
  const farmerIds = new Set(products.map(p => String(p.farmerId._id || p.farmerId)));
  const marketIds = new Set(products.map(p => String(p.marketId)));
  if (farmerIds.size !== 1 || marketIds.size !== 1) throw new AppError("For now, an order must contain products from one farmer and one market.", 422);

  const marketId = products[0].marketId;
  await verifyPickup(marketId, req.body.pickupDate, req.body.pickupTimeSlot);
  let subtotal = 0;
  const orderItems = [];
  for (const raw of items) {
    const product = products.find(p => String(p._id) === String(raw.productId));
    const qty = Math.max(1, Number(raw.qty || 1));
    if (qty < Number(product.minOrder || 1)) throw new AppError(`${product.name} has a minimum order of ${product.minOrder}.`, 422);
    if (qty > product.quantityAvailable) throw new AppError(`${product.name} only has ${product.quantityAvailable} available.`, 409);
    const price = qty >= Number(product.minOrder || 999999) && Number(product.bulkPrice || 0) > 0 ? Number(product.bulkPrice) : Number(product.price);
    const line = +(price * qty).toFixed(2);
    subtotal += line;
    orderItems.push({ productId: product._id, name: product.name, qty, unitPrice: price, subtotal: line });
  }
  subtotal = +subtotal.toFixed(2);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const totalAmount = +(subtotal + tax).toFixed(2);

  const order = await Order.create({
    customerId: req.user._id,
    farmerId: products[0].farmerId._id || products[0].farmerId,
    marketId,
    items: orderItems,
    subtotal,
    totalAmount,
    tax,
    pickupDate: req.body.pickupDate,
    pickupTimeSlot: req.body.pickupTimeSlot,
    customerName: req.body.customerName || req.user.name,
    customerPhone: req.body.customerPhone || req.user.phone,
    pickupNote: req.body.pickupNote || req.body.address || "",
    status: "PLACED",
  });

  await Promise.all(products.map((p, idx) => Product.updateOne({ _id: p._id }, { $inc: { quantityAvailable: -orderItems[idx].qty, soldCount: orderItems[idx].qty }, $set: { isAvailable: p.quantityAvailable - orderItems[idx].qty > 0 } })));
  await notify(req.user._id, "Order placed", `Your order ${order._id.toString().slice(-8)} has been placed for market pickup.`, "order", `/customer/orders/${order._id}`);
  await notify(order.farmerId, "New pre-order", `${req.user.name} placed a pickup order.`, "order", `/farmer/orders/${order._id}`);
  const admins=await User.find({role:"admin",status:"active"}).select("_id");
  await Promise.all(admins.map(a=>notify(a._id,"New marketplace order",`A new order ${order._id.toString().slice(-8)} was placed by ${req.user.name}.`,"order","/admin/reports")));
  res.status(201).json({ order: visible(order) });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).populate("farmerId", "name").populate("marketId", "name day time address").sort({ createdAt: -1 });
  res.json({ orders: orders.map(visible) });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("farmerId", "name phone").populate("marketId").populate("customerId", "name email phone");
  if (!order) throw new AppError("Order not found", 404);
  const allowed = [String(order.customerId._id || order.customerId), String(order.farmerId._id || order.farmerId), req.user.role === "admin" ? String(req.user._id) : "never"];
  if (!allowed.includes(String(req.user._id))) throw new AppError("You do not have access to this order.", 403);
  res.json({ order: visible(order) });
});

export const updateCustomerOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customerId: req.user._id });
  if (!order) throw new AppError("Order not found", 404);
  if (!["PLACED"].includes(order.status)) throw new AppError("This order can no longer be modified.", 409);
  const profile = await FarmerProfile.findOne({ userId: order.farmerId });
  const cutoff = Number(profile?.orderCutoffHours ?? 4);
  if (order.pickupDate && Date.now() >= new Date(order.pickupDate).getTime() - cutoff * 60 * 60 * 1000) throw new AppError(`Order changes close ${cutoff} hours before pickup.`, 409);
  if (req.body.pickupDate) order.pickupDate = req.body.pickupDate;
  if (req.body.pickupTimeSlot) order.pickupTimeSlot = req.body.pickupTimeSlot;
  if (req.body.pickupNote !== undefined) order.pickupNote = req.body.pickupNote;
  await order.save();
  res.json({ order: visible(order) });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const query = req.user.role === "customer" ? { _id: req.params.id, customerId: req.user._id } : { _id: req.params.id, farmerId: req.user._id };
  const order = await Order.findOne(query);
  if (!order) throw new AppError("Order not found", 404);
  if (!["PLACED","ACCEPTED"].includes(order.status)) throw new AppError("This order is no longer eligible for cancellation.", 409);
  const profile = await FarmerProfile.findOne({ userId: order.farmerId });
  const cutoff = Number(profile?.orderCutoffHours ?? 4);
  if (order.pickupDate && Date.now() >= new Date(order.pickupDate).getTime() - cutoff * 60 * 60 * 1000) throw new AppError(`Cancellation closes ${cutoff} hours before pickup.`, 409);
  order.status = "CANCELLED";
  order.cancelledAt = new Date();
  order.cancellationReason = req.body.reason || "Cancelled by user";
  await order.save();
  await restoreStock(order);
  const notifyUser = req.user.role === "customer" ? order.farmerId : order.customerId;
  await notify(notifyUser, "Order cancelled", `Order ${order._id.toString().slice(-8)} was cancelled.`, "order");
  const admins=await User.find({role:"admin",status:"active"}).select("_id");
  await Promise.all(admins.map(a=>notify(a._id,"Order cancelled",`Order ${order._id.toString().slice(-8)} was cancelled.`,"order","/admin/reports")));
  res.json({ order: visible(order) });
});

async function restoreStock(order) {
  await Promise.all(order.items.map(async item => {
    const p = await Product.findById(item.productId);
    if (p) { p.quantityAvailable += item.qty; p.isAvailable = true; await p.save(); }
  }));
}

async function transition(id, farmerId, status) {
  const order = await Order.findOne({ _id: id, farmerId });
  if (!order) throw new AppError("Order not found", 404);
  const allowed = { ACCEPTED: ["PLACED"], DECLINED: ["PLACED"], READY: ["ACCEPTED"], COMPLETED: ["READY"] };
  if (!(allowed[status] || []).includes(order.status)) throw new AppError(`Cannot move order from ${order.status} to ${status}.`, 409);
  order.status = status;
  if (status === "ACCEPTED") order.acceptedAt = new Date();
  if (status === "READY") order.readyAt = new Date();
  if (status === "COMPLETED") order.completedAt = new Date();
  await order.save();
  const text = { ACCEPTED: "accepted", DECLINED: "declined", READY: "ready for pickup", COMPLETED: "completed" }[status];
  await notify(order.customerId, `Order ${text}`, `Your order ${order._id.toString().slice(-8)} is now ${text}.`, "order", `/customer/orders/${order._id}`);
  const admins=await User.find({role:"admin",status:"active"}).select("_id");
  await Promise.all(admins.map(a=>notify(a._id,`Order ${text}`,`Order ${order._id.toString().slice(-8)} is now ${text}.`,"order","/admin/reports")));
  return order;
}

export const farmerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ farmerId: req.user._id }).populate("customerId", "name phone email").populate("marketId", "name day time address").sort({ createdAt: -1 });
  res.json({ orders: orders.map(visible) });
});
export const acceptOrder = asyncHandler(async (req, res) => res.json({ order: visible(await transition(req.params.id, req.user._id, "ACCEPTED")) }));
export const declineOrder = asyncHandler(async (req, res) => { const o=await transition(req.params.id,req.user._id,"DECLINED"); await restoreStock(o); res.json({order:visible(o)}); });
export const readyOrder = asyncHandler(async (req, res) => res.json({ order: visible(await transition(req.params.id, req.user._id, "READY")) }));
export const completeOrder = asyncHandler(async (req, res) => res.json({ order: visible(await transition(req.params.id, req.user._id, "COMPLETED")) }));

export const customerDashboard = asyncHandler(async (req, res) => {
  const [orders,totalSpent,favorites] = await Promise.all([
    Order.countDocuments({ customerId: req.user._id }),
    Order.aggregate([{ $match: { customerId: req.user._id, status: { $nin: ["CANCELLED","DECLINED"] } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    (await import("../models/Favorite.js")).default.countDocuments({ userId: req.user._id }),
  ]);
  const recent = await Order.find({ customerId: req.user._id }).populate("marketId", "name").sort({createdAt:-1}).limit(5);
  res.json({ stats: { orders, totalSpent: totalSpent[0]?.total || 0, favorites }, recentOrders: recent.map(visible) });
});
