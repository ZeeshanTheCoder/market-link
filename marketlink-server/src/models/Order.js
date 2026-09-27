import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    marketId: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true, index: true },
    items: { type: [orderItemSchema], validate: (v) => Array.isArray(v) && v.length > 0 },
    subtotal: { type: Number, min: 0, required: true },
    totalAmount: { type: Number, min: 0, required: true },
    tax: { type: Number, min: 0, default: 0 },
    pickupDate: { type: Date, required: true },
    pickupTimeSlot: { type: String, required: true },
    status: { type: String, enum: ["PLACED", "ACCEPTED", "READY", "COMPLETED", "DECLINED", "CANCELLED"], default: "PLACED", index: true },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    pickupNote: { type: String, default: "" },
    cancellationReason: { type: String, default: "" },
    acceptedAt: Date,
    readyAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ farmerId: 1, status: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
export default mongoose.model("Order", orderSchema);
