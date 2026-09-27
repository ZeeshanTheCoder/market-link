import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

async function refreshRating(productId, farmerId) {
  const agg = await Review.aggregate([{ $match: { productId } }, { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]);
  await Product.findByIdAndUpdate(productId, { rating: +(agg[0]?.avg || 0).toFixed(1), reviews: agg[0]?.count || 0 });
}

export const createReview = asyncHandler(async (req, res) => {
  const { orderId, productId, rating, comment } = req.body;
  const order = await Order.findOne({ _id: orderId, customerId: req.user._id, status: "COMPLETED" });
  if (!order) throw new AppError("A completed pickup order is required before reviewing.", 422);
  const item = order.items.find(i => String(i.productId) === String(productId));
  if (!item) throw new AppError("This product was not part of the completed order.", 422);
  const review = await Review.create({ customerId: req.user._id, farmerId: order.farmerId, productId, orderId, rating: Number(rating), comment: String(comment || "").trim() });
  await refreshRating(productId, order.farmerId);
  res.status(201).json({ review: await review.populate(["customerId", "productId"]) });
});

export const listProductReviews = asyncHandler(async (req,res)=>{ const reviews=await Review.find({productId:req.params.productId}).populate("customerId","name").sort({createdAt:-1}); res.json({reviews}); });
export const listFarmerReviews = asyncHandler(async (req,res)=>{ const reviews=await Review.find({farmerId:req.params.farmerId}).populate("customerId","name").populate("productId","name").sort({createdAt:-1}); res.json({reviews}); });
export const updateReview = asyncHandler(async(req,res)=>{const r=await Review.findOne({_id:req.params.id,customerId:req.user._id});if(!r)throw new AppError("Review not found",404);r.rating=Number(req.body.rating??r.rating);r.comment=String(req.body.comment??r.comment).trim();await r.save();await refreshRating(r.productId,r.farmerId);res.json({review:r});});
export const deleteReview = asyncHandler(async(req,res)=>{const q=req.user.role==="admin"?{_id:req.params.id}:{_id:req.params.id,customerId:req.user._id};const r=await Review.findOne(q);if(!r)throw new AppError("Review not found",404);const productId=r.productId;const farmerId=r.farmerId;await r.deleteOne();await refreshRating(productId,farmerId);res.json({message:"Review deleted"});});
export const replyReview = asyncHandler(async(req,res)=>{const r=await Review.findById(req.params.id);if(!r)throw new AppError("Review not found",404);if(req.user.role!=="admin"&&String(r.farmerId)!==String(req.user._id))throw new AppError("You can only reply to reviews on your products.",403);r.farmerReply=String(req.body.farmerReply||"").trim();await r.save();res.json({review:r});});

export const listAllReviews = asyncHandler(async(req,res)=>{ const reviews=await Review.find().populate("customerId","name email").populate("farmerId","name").populate("productId","name").sort({createdAt:-1}); res.json({reviews}); });
