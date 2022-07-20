require("dotenv").config();
//const { clientID, clientSecret, redirectURI } = require("../../constants");
const Data = require("../../data");
const nodemailer = require("nodemailer");

/* Encryption */
const bcrypt = require("bcrypt");
const saltRounds = 10;

/*
 * Mailer
 */
// Send the email
/*
const transporter = nodemailer.createTransport({
  //port: 587,
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    //user: process.env.SENDGRID_USERNAME,
    //pass: process.env.SENDGRID_PASSWORD
  },
});
*/

/*
 * Exports. Requests to MongoDB live here.
 */
module.exports = {
  ////////////////////////////////////////
  // Authentication & Verification
  ////////////////////////////////////////

  // Sign in
  auth: function (req, res, next) {
    const { usernameToCheck, passwordToCheck } = req.body;
    const usernameLowercase = usernameToCheck.toLowerCase();
    //console.log("Received request for authentication for", usernameLowercase);

    Data.findOne({ username: usernameLowercase }, async (err, data) => {
      // if theres an error, user doesn't exists in database
      if (err) return res.json({ success: false, error: err });

      if (data) {
        bcrypt.compare(
          passwordToCheck,
          data.password,
          function (err, response) {
            if (err) console.log(err);

            if (response) {
              return res.json({
                success: true,
                message: "Success. Passwords match.",
              });
            } else {
              return res.json({
                success: false,
                message: "Passwords do not match. Please try again.",
              });
            }
          }
        );
      } else return res.json({ success: false, data: data });
    });
  },

  // Support PIN sign in
  supportPinAuth: function (req, res, next) {
    const { usernameToCheck, pinToCheck } = req.body;
    const usernameLowercase = usernameToCheck.toLowerCase();

    Data.findOne({ username: usernameLowercase }, async (err, data) => {
      // if theres an error, user doesn't exists in database
      if (err) return res.json({ success: false, error: err });

      if (data) {
        if (pinToCheck === data.supportPin) {
          return res.json({
            success: true,
            message: "Support PIN accepted.",
          });
        } else {
          return res.json({
            success: false,
            message:
              "Support PIN does not match the account. Please try again.",
          });
        }
      }
    });
  },

  // Send recovery email
  sendRecoveryEmail: function (req, res, next) {
    const { user } = req.body;
    const newVerificationToken = bcrypt
      .hashSync(user + Date.now(), saltRounds)
      .replace(/\//g, "_");

    var mailOptions = {
      from: "no-reply@getcurrently.com",
      to: user, // client email address
      subject: "Currently: Account Verification",
      text:
        "This email was sent because someone is attempting to recover this account.\n\n" +
        "If this was you, please verify your account by clicking the link below: \nhttps://" +
        req.headers.host +
        "/new-password/" +
        newVerificationToken +
        ".\n\nIf this wasn't initiated by you, you can ignore this email.",
    };

    transporter.sendMail(mailOptions, function (err) {
      if (err) console.log(err.message);
      else console.log("A verification email has been sent to " + user + ".");
    });

    Data.findOneAndUpdate(
      { username: user },
      { verificationToken: newVerificationToken },
      (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
      }
    );
  },

  // Resend verification email
  resendVerifyEmail: function (req, res, next) {
    const { user } = req.body;
    const newVerificationToken = bcrypt
      .hashSync(user + Date.now(), saltRounds)
      .replace(/\//g, "_");

    var mailOptions = {
      from: "no-reply@getcurrently.com",
      to: user, // client email address
      subject: "Currently: Account Verification",
      text:
        "Please verify your account by clicking the link below: \nhttps://" +
        req.headers.host +
        "/confirmation/" +
        newVerificationToken +
        ".\n",
    };

    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.log(err.message);
        //return res.status(500).send({ msg: err.message });
      }
      //res.status(200).send("A verification email has been sent to " + data.username + ".");
      console.log("A verification email has been sent to " + user + ".");
    });

    Data.findOneAndUpdate(
      { username: user },
      { verificationToken: newVerificationToken },
      (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
      }
    );
  },

  // Verify user after user clicks verification link
  verifyUser: function (req, res, next) {
    const { verificationTokenToCompare } = req.body;

    const update = { isVerified: true, verificationToken: "" };
    const filter = { verificationToken: verificationTokenToCompare };

    Data.findOneAndUpdate(filter, update, { new: true }, (err, doc) => {
      if (err) return res.json({ success: false, error: err });
      else {
        console.log(doc);
        return res.json({ success: true });
      }
    });

    // Send the email
    /*
      var transporter = nodemailer.createTransport({
        //port: 587,
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          //user: process.env.SENDGRID_USERNAME,
          //pass: process.env.SENDGRID_PASSWORD
          user: "no-reply@schemahelper.com",
          //pass: "%2AaKY<D",
          pass: "Salted123!",
        },
      });
      */

    /*
      if (data) {
        var mailOptions = {
          from: "no-reply@getcurrently.com",
          to: data.username, // client email address
          subject: "Currently: Verification Confirmed",
          text:
            "Thank you for verifying your account!\n\n" +
            "Visit: http://socialmediasearch.herokuapp.com to sign in and get started.",
        };
    
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            console.log(err.message);
          }
        });
      }
      */
  },

  // Recover account based on verificationToken
  recoverAccount: function (req, res, next) {
    const { token, password } = req.body;

    bcrypt.hash(password, saltRounds, function (err, hash) {
      Data.findOneAndUpdate(
        { verificationToken: token },
        { password: hash, verificationToken: "" },
        (err) => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true });
        }
      );
    });
  },

  ////////////////////////////////////////
  // Users
  ////////////////////////////////////////

  // Create new user
  createUser: function (req, res, next) {
    const { username, password, firstName, lastName, avatar } = req.body;

    let verificationToken = bcrypt
      .hashSync(username + Date.now(), saltRounds)
      .replace(/\//g, "_");
    let data = new Data();
    let newUserId;

    // count users in database
    Data.countDocuments({}, function (err, c) {
      newUserId = c;
    });

    bcrypt.hash(password, saltRounds, function (err, hash) {
      data.userId = newUserId;
      data.username = username;
      data.password = hash;
      data.firstName = firstName;
      data.lastName = lastName;
      data.verificationToken = verificationToken;
      data.subscription = "Free";
      data.avatar = avatar;

      /*
      var mailOptions = {
        from: "no-reply@schemahelper.com",
        to: data.username, // client email address
        subject: "Currently: Account Verification",
        text:
          "Thank you for registering!\n\n" +
          "Please verify your account by clicking the link below: \nhttps://" +
          req.headers.host +
          "/confirmation/" +
          data.verificationToken +
          ".\n",
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.log(err.message);
          //return res.status(500).send({ msg: err.message });
        }
        //res.status(200).send("A verification email has been sent to " + data.username + ".");
        console.log(
          "A verification email has been sent to " + data.username + "."
        );
      });
      */

      // push the data to the database
      data.save((err, data) => {
        if (err) return res.json({ error: err });
        return res.json({ success: true, data: data });
      });
    });
  },

  // Get user data by email
  getUser: function (req, res, next) {
    const { username } = req.body;
    const usernameLowercase = username ? username.toLowerCase() : "";

    Data.findOne({ username: usernameLowercase }, async (err, data) => {
      if (err) return res.json({ error: err });
      if (data) return res.json({ data: data });
      else return res.json({ data: data });
    });
  },

  // Get all data in the database
  getAllUsers: function (req, res, next) {
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
  },

  // Update user
  updateUser: function (req, res, next) {
    const { username, domainURLToUpdate, member, update } = req.body;

    if (domainURLToUpdate && username) {
      Data.findOneAndUpdate(
        {
          username: username,
          domains: { $elemMatch: { domainURL: domainURLToUpdate } },
        },
        update,
        (err) => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true });
        }
      );
    } else {
      Data.findOneAndUpdate({ username: username }, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
      });
    }
  },

  // Remove user
  removeUser: function (req, res, next) {
    Data.deleteOne({ username: req.body.username }, (err) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  },

  // Update user password
  updateUserPassword: function (req, res, next) {
    const { username, currentPassword, newPassword } = req.body;

    Data.findOne({ username: username }, async (err, data) => {
      // if the user exists, compare the current password with what we have in the database
      if (data) {
        bcrypt.compare(
          currentPassword,
          data.password,
          function (err, response) {
            if (err) console.log(err);

            // if the passwords match, continue updating to new password
            if (response) {
              bcrypt.hash(newPassword, saltRounds, function (err, hash) {
                Data.findOneAndUpdate(
                  { username: username },
                  { password: hash },
                  (err) => {
                    if (err) return res.json({ success: false, error: err });
                    return res.json({ success: true });
                  }
                );
              });
            } else {
              return res.json({
                success: false,
                message: "Please double check your current password.",
              });
            }
          }
        );
      } else return res.json({ success: false, data: data });
    });
  },

  ////////////////////////////////////////
  // Domains
  ////////////////////////////////////////

  // Get domain data by email and domain
  getDomain: function (req, res, next) {
    const { usernameToCheck, domainToCheck } = req.body;

    Data.findOne(
      { username: usernameToCheck, domainURL: domainToCheck },
      async (err, data) => {
        // if theres an error, user doesn't exists in database
        if (err) return res.json({ success: false, error: err });

        // if user exists, send success
        if (data) return res.json({ success: true, data: data });
        else return res.json({ success: false, data: data });
      }
    );
  },
  // Get domains that the user has access to from other users
  getMemberDomains: function (req, res, next) {
    const { username } = req.body;

    Data.find(
      { members: { $elemMatch: { username: username } } },
      async (err, data) => {
        // if theres an error, user doesn't exists in database
        if (err) return res.json({ success: false, error: err });

        // if user exists, send success
        if (data) {
          let accounts = [];

          data.forEach((account) => {
            accounts.push(account);
          });

          return res.json({ success: true, data: accounts });
        } else return res.json({ success: false, data: data });
      }
    );
  },
};
