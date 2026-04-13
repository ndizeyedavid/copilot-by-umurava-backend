import { Schema, model } from "mongoose";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      // required: true,
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      enum: ["talent", "admin"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    talentProfileId: {
      type: String,
      ref: "Talent",
    },
  },
  { timestamps: true },
);

// userSchema.index({ email: 1 });
// userSchema.index({ googleId: 1 });

const User = model<IUser>("User", userSchema);

export default User;
