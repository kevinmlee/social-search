const { domain, port } = require("./constants");
const nodemailer = require("nodemailer");

// Routes
const TWITTER = require("./api/Twitter");
// const HUBSPOT = require("./api/HubSpot");
// const MONGO = require("./api/MongoDB");

/* Database & API */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

//const STRIPE_API = require("./api/stripe-functions.js");
const crypto = require("crypto");

mongoose.set("useFindAndModify", false);

/////////////////////////////////////////////
// Settings
/////////////////////////////////////////////

// Initialize express
const app = express();

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use(logger("dev"));
app.use(cors());
app.options("*", cors());

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the React app
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });

  app.use(express.static("client/build"));
  //app.get("/*", function (req, res) {

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "/client/public")));
  //app.get("/*", function (req, res) {
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
  });
}

/////////////////////////////////////////////
// Twitter
/////////////////////////////////////////////

// Authentication & verification

app.all("/twitter/search", TWITTER.search);
app.all("/twitter/search/username", TWITTER.searchByUsername);
app.all("/twitter/get/tweets/id", TWITTER.getTweetsByUserId);

/////////////////////////////////////////////
// Database API Routes
/////////////////////////////////////////////

// Authentication & verification
/*
app.all("/api/auth", MONGO.auth);
app.all("/api/support/auth", MONGO.supportPinAuth);
app.post("/api/user/verify", MONGO.verifyUser);
app.all("/api/user/resendVerifyEmail", MONGO.resendVerifyEmail);
app.all("/api/user/sendRecoveryEmail", MONGO.sendRecoveryEmail);
app.all("/api/user/recovery", MONGO.recoverAccount);
app.all("/api/user/updatePassword", MONGO.updateUserPassword);

// User
app.post("/api/user/create", MONGO.createUser);
app.all("/api/get/user", MONGO.getUser);
app.get("/api/get/allUsers", MONGO.getAllUsers);
app.all("/api/user/update", MONGO.updateUser);
app.all("/api/user/remove", MONGO.removeUser);

// Domains
app.all("/api/get/domain", MONGO.getDomain);
app.all("/api/get/memberDomains/", MONGO.getMemberDomains);
*/

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////

// this is our MongoDB database
const dbRoute = process.env.MONGODB;

// connects our back end code with the database
/*
mongoose.connect(dbRoute, { useUnifiedTopology: true, useNewUrlParser: true });

let db = mongoose.connection;
db.once("open", () => console.log("Connection established to MongoDB"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));
*/

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
} else {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/public/index.html"));
  });
}

/*
 *  Start server and listen
 */
app.listen(port);
console.log(`Social Search listening on ${port}`);
