// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our database's data structure
const DataSchema = new Schema(
  {
    userId: { type: Number },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    isVerified: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: { type: String },
    registrationDate: { type: Date, required: true, default: Date.now },
    avatar: { type: String },
    avatarFilename: { type: String },
    supportPin: { type: String },
    accountType: { type: String },
    domains: [
      {
        active: Boolean,
        name: String,
        domainURL: String,
        domainID: Number,
        portalID: Number,
        accessToken: String,
        refreshToken: String,
        totalPages: Number,
        totalPagesWithSchemas: Number,
        pagesMissingSchema: Number,
        publishedPages: [Number],
        pagesWithSchema: [],
        pagesWithoutSchema: [],
        schemasUsed: {},
      },
    ],
    activity: [
      {
        date: String,
        changes: Number,
      },
    ],
    subscription: String,
    members: [
      {
        firstName: String,
        lastName: String,
        username: String,
        team: String,
        role: String,
        domains: [],
      },
    ],
    settings: {
      percentage: Boolean,
      fahrenheit: Boolean,
    },
    schemaTemplates: [],
    globalVariables: {
      articleFeaturedImage: String,
      articlePublisher: String,
      articlePublisherLogoURL: String,

      companyName: String,
      companyWebsite: String,
      companyPhoneNumber: String,
      companyHours: [],

      faqs: [],

      address: {
        streetAddress: String,
        postalCode: String,
        addressLocality: String,
        addressRegion: String,
        addressCountry: String,
        latitude: Number,
        longitude: Number,
      },
    },
    tempAccessToken: { type: String },
    tempRefreshToken: { type: String },
  },
  { collection: "schema" } // name of collection
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);
