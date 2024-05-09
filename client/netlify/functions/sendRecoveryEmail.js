const { MongoClient } = require('mongodb')
const bcrypt = require("bcrypt")
const saltRounds = 10;
const nodemailer = require("nodemailer");
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

exports.handler = async (event, context) => {
  const { username } = JSON.parse(event.body)
  const usernameLowercase = username ? username.toLowerCase() : ""
  const client = new MongoClient(process.env.MONGODB)
  const newVerificationToken = bcrypt
    .hashSync(username + Date.now(), saltRounds)
    .replace(/\//g, "_");

  const mailOptions = {
    from: "no-reply@getcurrently.com",
    to: usernameLowercase, // client email address
    subject: "Currently: Account Verification",
    text:
      "This email was sent because someone is attempting to recover this account.\n\n" +
      "If this was you, please verify your account by clicking the link below: \nhttps://" +
      event.headers.host +
      "/new-password/" +
      newVerificationToken +
      ".\n\nIf this wasn't initiated by you, you can ignore this email.",
  };

  transporter.sendMail(mailOptions, function (err) {
    if (err) console.log(err.message);
    else console.log("A verification email has been sent to " + usernameLowercase + ".");
  });

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('users');

    // Retrieve the document to update
    const filter = { username: usernameLowercase };
    const update = { $set: { verificationToken: newVerificationToken } }; // Specify the update operation
    const options = { returnOriginal: false }; // Set options, if needed

    // Perform findOneAndUpdate operation
    const updatedDocument = await collection.findOneAndUpdate(filter, update, options);

    console.log('updatedDocument', updatedDocument)

    return {
      statusCode: 200,
      body: JSON.stringify({ updatedDocument }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  } finally {
    await client.close();
  }
};