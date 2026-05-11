import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    predictionsUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);


const User = mongoose.model("gradeUser",userSchema)

export default User