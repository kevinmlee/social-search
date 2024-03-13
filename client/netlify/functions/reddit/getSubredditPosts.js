require("dotenv").config()
const endpoint = 'https://www.reddit.com'

exports.handler = async (event, context) => {
  const { subreddit, filter, limit } = JSON.parse(event.body)

  const url = `${endpoint}/r/${subreddit}/${filter}.json?limit=${limit}`;

  // serverless API call
  const result = await fetch(url)
    .then((response) => response.json())
    .then((data) => data);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}
