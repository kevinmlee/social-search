require("dotenv").config()
const axios = require('axios');
const endpoint = 'https://www.reddit.com'

exports.handler = async (event, context) => {
  const { subreddit, filter, limit } = JSON.parse(event.body)
  const url = `${endpoint}/r/${subreddit}/${filter}.json`

  const result = await axios.get(url, {
    params: {
      limit: limit
    }
  }).then((response) => response.data)
    .catch(error => console.log(error))

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}
