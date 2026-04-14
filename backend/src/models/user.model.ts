import { Schema, model } from "mongoose";
import { IUser } from "../types/user.types";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
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

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password") || !this.password) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare password
// userSchema.methods.comparePassword = async function (password: string) {
//   if (!this.password) return false;
//   return await bcrypt.compare(password, this.password);
// };

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

const User = model<IUser>("User", userSchema);

export default User;
