import mongoose, { Schema, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const UserProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String ,unique:true,required:true},
    gender: { type: String },
    country: { type: String },
    nativeLanguage: { type: String },
    learningLanguage: { type: String, default: "English" },
    level: { type: String },
    goal: { type: String },
    xp: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    
    timezone: { type: String },

  },
  { timestamps: true }
);

const UserProfile = models.UserProfile || mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
