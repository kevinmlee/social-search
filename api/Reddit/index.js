require("dotenv").config();
const https = require("https");

const endpoint = 'https://www.reddit.com'

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery, filter } = req.body;
    const url = `${endpoint}/search.json?q=${seachQuery}&sort=${filter}`

    const request = https.get(url, (response) => {
      let data = ""

      response.on("data", (stream) => data += stream)
      response.on("end", () => res.json(JSON.parse(data)))
    })

    request.on("error", (e) => res.json(e))
  },
  searchSubreddits: async function (req, res, next) {
    const { searchQuery } = req.body;

    const url = `${endpoint}/subreddits/search.json?q=${searchQuery}&include_over_18=off`

    const request = https.get(url, (response) => {
      let data = ""

      response.on("data", (stream) => data += stream)
      response.on("end", () => res.json(JSON.parse(data)))
    })

    request.on("error", (e) => res.json(e))
  },
  getSubredditPosts: async function (req, res, next) {
    const { subreddit, filter, limit } = req.body
    const url = `${endpoint}/r/${subreddit}/${filter}/.json?limit=${limit}`

    const request = https.get(url, (response) => {
      let data = ""

      response.on("data", (stream) => data += stream)
      response.on("end", () => res.json(JSON.parse(data)))
    })

    request.on("error", (e) => res.json(e))
  },
  getHotPosts: async function (req, res, next) {
    const { limit } = req.body;
    const url =`${endpoint}/hot.json?include_over_18=off&limit=${limit}`

    const request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => data += stream)
      response.on("end", () => res.json(JSON.parse(data)))
    });

    request.on("error", (e) => res.json(e))
  }
}
