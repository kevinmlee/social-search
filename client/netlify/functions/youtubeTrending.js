require("dotenv").config();
const fetch = require("node-fetch");
const endpoint = "https://www.googleapis.com/youtube";

exports.handler = async (event, context) => {
  // const { searchQuery, order } = JSON.parse(event.body);
  // add "regionCode" for regionalized results: https://developers.google.com/youtube/v3/docs/videos/list
  const url = `${endpoint}/v3/videos?part=snippet&chart=mostPopular&maxResults=15&key=${process.env.YOUTUBE_API_KEY}`;

  // serverless API call
  const result = await fetch(url)
    .then((response) => response.json())
    .then((data) => data);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
