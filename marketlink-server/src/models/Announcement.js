import mongoose from "mongoose";
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  audience: { type: String, enum: ["All customers", "Customers", "Farmers", "All users"], default: "All users" },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ["Draft", "Published"], default: "Published" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model("Announcement", announcementSchema);
