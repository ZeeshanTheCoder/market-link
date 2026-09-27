import mongoose from "mongoose";

const marketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, index: true },
    address: { type: String, required: true, trim: true },
    area: { type: String, trim: true, default: "" },
    operatingDays: [{ type: String }],
    timings: { type: String, default: "" },
    day: { type: String, default: "" },
    time: { type: String, default: "" },
    stalls: { type: Number, default: 0, min: 0 },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    mapProvider: { type: String, enum: ["OpenStreetMap", "Google Maps"], default: "OpenStreetMap" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

marketSchema.index({ name: "text", area: "text", address: "text" });
export default mongoose.model("Market", marketSchema);
