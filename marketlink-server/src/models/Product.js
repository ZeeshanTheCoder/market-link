import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    marketId: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, index: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true, default: "/kg" },
    quantityAvailable: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    weeklyTemplate: { type: Boolean, default: false },
    useCase: { type: String, enum: ["daily", "farm", "bulk", "market"], default: "daily" },
    productType: { type: String, default: "Fresh Produce" },
    harvestStatus: { type: String, default: "Fresh" },
    harvestDate: { type: Date },
    deliveryType: { type: String, default: "Market pickup" },
    minOrder: { type: Number, min: 1, default: 1 },
    bulkPrice: { type: Number, min: 0, default: 0 },
    badge: { type: String, default: "Fresh" },
    organic: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    soldCount: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", category: "text", description: "text", productType: "text" });
productSchema.index({ farmerId: 1, isAvailable: 1 });
export default mongoose.model("Product", productSchema);
