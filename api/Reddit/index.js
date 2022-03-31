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
  getSubredditPosts: async function (req, res, next) {
    const { searchQuery, filter } = req.body;
    const url =
      "https://www.reddit.com/r/" + searchQuery + "/" + filter + ".json";

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
    const url = "https://www.reddit.com/hot.json?include_over_18=false";

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
