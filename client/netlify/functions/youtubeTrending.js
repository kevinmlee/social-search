require("dotenv").config();
const fetch = require("node-fetch");
const endpoint = "https://www.googleapis.com/youtube";

exports.handler = async (event, context) => {
  const { countryCode } = JSON.parse(event.body);
  const url = `${endpoint}/v3/videos?part=snippet&chart=mostPopular&maxResults=15&key=${process.env.YOUTUBE_API_KEY}` 
    + (countryCode ? `&regionCode=${countryCode}` : '');

  // serverless API call
  const result = await fetch(url)
    .then((response) => response.json())
    .then((data) => data);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
