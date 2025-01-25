/*
--> NOTES <--
MTUser : MODEL TYPE USER
*/


// Packages
import { Document } from "mongoose";


// --> USER.MODEL
export interface MTUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  isActive: boolean;
  role: "User" | "Admin";
  createdAt: Date;
  updatedAt: Date;
}