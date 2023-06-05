const mongoose = require("mongoose");
const { Schema } = mongoose;

const members = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone_number: { type: String, unique: true },
  // image: String,
  signup_date: { type: Date, default: Date.now },
  project_ids: [{ type: Schema.Types.ObjectId, ref: "projects" }],
  state: { type: String, default: "1", enum: ["0", "1"] },
});

module.exports = mongoose.model("members", members);
