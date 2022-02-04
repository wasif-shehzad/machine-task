const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let filesSchema = new Schema({
  file_name: { type: String },
  original_file_name: { type: String },
  type: { type: String },
  size: { type: String },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  allowed_users: [{ type: Schema.Types.ObjectID, ref: "Users" }],
  isDeleted: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Files", filesSchema);
