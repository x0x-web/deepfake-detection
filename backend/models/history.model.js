import mongoose from "mongoose";

const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gradeUser",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ["REAL", "FAKE"],
      required: true,
    },
    confidence: {
      type: Number,
      default: null,
    },
    framesProcessed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast user-based queries, sorted by newest first
historySchema.index({ userId: 1, createdAt: -1 });

const History = mongoose.model("History", historySchema);

export default History;
