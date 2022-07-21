// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our database's data structure
const DataSchema = new Schema(
  {
    userId: { type: Number },
    registrationDate: { type: Date, required: true, default: Date.now },
    username: { type: String, required: true, unique: true },
    accountType: { type: String },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    settings: {
      homeTopics: [],
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  // name of collection in MongoDB
  { collection: "users" }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);
