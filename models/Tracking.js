import mongoose, { Schema, models, model } from "mongoose";

const TrackingSchema = new Schema(
  {
    userId: { type: String, required: true },   // session user id
    eventName: { type: String, required: true }, // PAGE_VIEW, CLICK, ERROR
    page: { type: String },
    data: { type: Object },                     // extra info
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Tracking = models.Tracking || model("Tracking", TrackingSchema);

export default Tracking;
