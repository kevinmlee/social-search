const axios = require("axios")
const endpoint = "https://prickly-umbrella-toad.cyclic.app"

module.exports = {
  search: async function (payload) {
    return axios
      .post(`/reddit/search`, payload)
      .then(
        (response) => response.data.data,
        (error) => error
      )
  },
  searchSubreddits: async function (payload) {
    return axios
      .post(`/reddit/search/subreddits`, payload)
      .then(
        (response) => response.data.data,
        (error) => error
      )
  },

  getSubredditPosts: async function (payload) {
    return axios
      .post(`/reddit/get/subreddit/posts`, payload)
      .then(
        (response) => response.data.data,
        (error) => error
      )
  },

  getHotPosts: async function (payload) {
    return axios
      .post(`/reddit/get/hot/posts`, payload)
      .then(
        (response) => response.data.data,
        (error) => error
      )
  }
}