/* eslint-disable */

const mongoose = require("mongoose");

const { Schema } = mongoose;

const requireNumber = { type: Number, require: true };
const defaultRequireDate = {
  type: Date,
  default: Date.now,
  require: true,
};

const logEntrySchema = new Schema(
  {
    description: String,
    comments: String,
    image: String,
    hidden: Boolean,
    title: { type: String, require: true },
    latitude: {
      ...requireNumber,
      min: -90,
      max: 90,
    },
    longitude: {
      ...requireNumber,
      min: -180,
      max: 180,
    },
    create_at: defaultRequireDate,
    update_at: defaultRequireDate,
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    visitedDate: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const LogEntry = mongoose.model("LogEntry", logEntrySchema);

module.exports = LogEntry;
