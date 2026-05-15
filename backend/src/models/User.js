const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// One user → many job requests
userSchema.virtual("jobRequests", {
  ref: "JobRequest",
  localField: "_id",
  foreignField: "createdBy",
});

module.exports = mongoose.model("User", userSchema);
