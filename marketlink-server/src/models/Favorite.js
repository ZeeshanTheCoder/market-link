import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  },
  { timestamps: true }
);
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true, partialFilterExpression: { productId: { $type: "objectId" } } });
export default mongoose.model("Favorite", favoriteSchema);
