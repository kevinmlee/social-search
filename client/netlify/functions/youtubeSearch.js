require("dotenv").config();
const fetch = require("node-fetch");
const endpoint = "https://www.googleapis.com/youtube";

exports.handler = async (event, context) => {
  const { searchQuery, order } = JSON.parse(event.body);
  const url = `${endpoint}/v3/search?q=${searchQuery}&maxResults=15&part=snippet&order=${order}&key=${process.env.YOUTUBE_API_KEY}`;

  // serverless API call
  const result = await fetch(url)
    .then((response) => response.json())
    .then((data) => data);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
