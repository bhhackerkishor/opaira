import mongoose from "mongoose";

const { Schema } = mongoose;

const redirectSchema = new Schema(
 {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   username: { type: String, required: true, unique: true },
    qrCodeUrl: {
      type: String, // optional saved QR image url
    },
    links: {
      social: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        youtube: { type: String },
      },
      payment: {
        gpay: { type: String },
        phonepe: { type: String },
        paytm: { type: String },
      },
      custom: [
        {
          title: { type: String },
          url: { type: String },
        },
      ],
    },
    defaultRedirect: {
      type: String, // store the default redirect link
    },
  },
  { timestamps: true }
);

export default mongoose.models.Redirect ||
  mongoose.model("Redirect", redirectSchema);
