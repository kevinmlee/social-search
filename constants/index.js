require("dotenv").config();

const clientID =
  process.env.NODE_ENV === "production"
    ? process.env.HUBSPOT_CLIENT_ID
    : process.env.DEV_HUBSPOT_CLIENT_ID;

const clientSecret =
  process.env.NODE_ENV === "production"
    ? process.env.HUBSPOT_CLIENT_SECRET
    : process.env.DEV_HUBSPOT_CLIENT_SECRET;

const redirectURI =
  process.env.NODE_ENV === "production"
    ? process.env.HUBSPOT_REDIRECT_URI
    : process.env.DEV_HUBSPOT_REDIRECT_URI;

const domain =
  process.env.NODE_ENV === "production"
    ? "https://app.schemahelper.com"
    : "http://localhost:3000";

const slackWebhookURL = process.env.SLACK_WEBHOOK;

// Port settings
const port = process.env.PORT || 6000;

module.exports = {
  clientID,
  clientSecret,
  domain,
  port,
  redirectURI,
  slackWebhookURL,
};
