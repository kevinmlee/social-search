require("dotenv").config()
const axios = require('axios')
const endpoint = 'https://www.reddit.com'

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery, filter } = req.body

    try {
      const response = await axios.get(`${endpoint}/search.json`, {
        params: {
          sort: filter,
          q: searchQuery,
        }
      })

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },
  searchSubreddits: async function (req, res, next) {
    const { searchQuery } = req.body

    try {
      const response = await axios.get(`${endpoint}/subreddits/search.json`, {
        params: {
          include_over_18: 'off',
          q: searchQuery,
        }
      })

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },
  getSubredditPosts: async function (req, res, next) {
    const { subreddit, filter, limit } = req.body

    try {
      const response = await axios.get(`${endpoint}/r/${subreddit}/${filter}.json`, {
        params: {
          limit: limit,
        }
      })

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },
  getHotPosts: async function (req, res, next) {
    const { limit } = req.body;

    try {
      const response = await axios.get(`${endpoint}/hot.json`, {
        params: {
          include_over_18: 'off',
          limit: limit,
        }
      })

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
};
