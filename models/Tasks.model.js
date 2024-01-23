const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "pending" },
  creationDate: {
    type: Date,
    default: new Date().toISOString().split("T")[0],
  },
  completionDate: { type: Date },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Task", taskSchema);
