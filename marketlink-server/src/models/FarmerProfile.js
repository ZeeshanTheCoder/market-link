import mongoose from "mongoose";

const pickupWindowSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const farmerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    stallName: { type: String, required: [true, "Stall name is required"], trim: true, maxlength: 100 },
    contactPerson: { type: String, trim: true, default: "" },
    slug: { type: String, trim: true, index: true },
    specialty: { type: String, trim: true, default: "Local farm produce" },
    bio: { type: String, trim: true, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    productCount: { type: Number, min: 0, default: 0 },
    image: { type: String, default: "" },
    markets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Market" }],
    operatingDays: [{ type: String }],
    pickupWindows: [pickupWindowSchema],
    orderCutoffHours: { type: Number, min: 0, max: 168, default: 4 },
    address: { type: String, trim: true, default: "" },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
  },
  { timestamps: true }
);

farmerProfileSchema.index({ approvalStatus: 1 });
farmerProfileSchema.index({ stallName: "text" });

export default mongoose.model("FarmerProfile", farmerProfileSchema);
