const mongoose = require("mongoose");

const STATUS_VALUES = ["Open", "In Progress", "Closed"];

const jobRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    contactName: { type: String, trim: true, default: "" },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "contactEmail must be a valid email address",
      ],
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
  },
  { timestamps: true, collection: "jobRequests" }
);

jobRequestSchema.index({ title: "text", description: "text" });
jobRequestSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("JobRequest", jobRequestSchema);
module.exports.STATUS_VALUES = STATUS_VALUES;
