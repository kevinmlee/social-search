require("dotenv").config();
const https = require("https");

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery, filter } = req.body;
    const url =
      "https://www.reddit.com/search.json?q=" + searchQuery + "&sort=" + filter;

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => {
        data += stream;
      });

      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
  searchSubreddits: async function (req, res, next) {
    const { searchQuery } = req.body;

    const url =
      "https://www.reddit.com/subreddits/search.json?q=" +
      searchQuery +
      "&include_over_18=off";

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => {
        data += stream;
      });

      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
  getSubredditPosts: async function (req, res, next) {
    const { subreddit, filter, limit } = req.body;
    const url =
      "https://www.reddit.com/r/" +
      subreddit +
      "/" +
      filter +
      ".json?limit=" +
      limit;

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => {
        data += stream;
      });

      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
  getHotPosts: async function (req, res, next) {
    const { limit } = req.body;
    const url =
      "https://www.reddit.com/hot.json?include_over_18=off&limit=" + limit;

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => {
        data += stream;
      });

      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
};
