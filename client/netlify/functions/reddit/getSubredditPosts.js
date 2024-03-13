require("dotenv").config()
const axios = require('axios')
const endpoint = 'https://www.reddit.com'

exports.handler = async (event, context) => {
  const { subreddit, filter, limit } = JSON.parse(event.body)

  let response

  try {
    response = await axios.get(`${endpoint}/r/${subreddit}/${filter}.json`, {
      params: {
        limit: limit
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(response)
    }
  }
}
