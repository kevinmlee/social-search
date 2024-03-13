require("dotenv").config()
const fetch = require("node-fetch")
const endpoint = 'https://www.reddit.com'

exports.handler = async (event, context) => {
  const { subreddit, filter, limit } = JSON.parse(event.body)
  const url = `${endpoint}/r/${subreddit}/${filter}.json?limit=${limit}`
  const result = await fetch(url).then((response) => response.json())

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}
