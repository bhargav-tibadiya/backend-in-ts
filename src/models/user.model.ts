// Packages
import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

// Types & Constant
import { ExpiresInType, MTUser } from "../types/models";


const UserSchema: Schema = new Schema<MTUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [10, "Age must be at least 18"],
      max: [100, "Age must be less than 100"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedToken = function () {
  const payload = {
    name: this.name,
    email: this.email,
    id: this._id,
    mobile: this.mobile
  }
  const secret = process.env.JWT_SECRET
  const config: jwt.SignOptions = { expiresIn: process.env.JWT_EXPIRE as ExpiresInType }
  return jwt.sign(payload, secret, config);
};

const User = mongoose.model<MTUser>("User", UserSchema);
export default User;
