require("dotenv").config();
const https = require("https");

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery, order } = req.body;
    const url =
      "https://www.googleapis.com/youtube/v3/search?q=" +
      searchQuery +
      "&maxResults=15&part=snippet&order=" +
      order +
      "&key=" +
      process.env.YOUTUBE_API_KEY;

    try {
      let request = https.get(url, (response) => {
        let data = "";

        response.on("data", (stream) => {
          data += stream;
        });

        response.on("end", () => res.json(JSON.parse(data)));
      });

      request.on("error", (e) => res.json(e));
    } catch (e) {
      res.json(e);
    }
  },

  getTrendingVideos: async function (req, res, next) {
    const { region } = req.body;
    //https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopular&regionCode=IN&key=

    const url =
      "https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=15&regionCode=" +
      region +
      "&key=" +
      process.env.YOUTUBE_API_KEY;

    try {
      let request = https.get(url, (response) => {
        let data = "";

        response.on("data", (stream) => {
          data += stream;
        });

        response.on("end", () => res.json(JSON.parse(data)));
      });

      request.on("error", (e) => res.json(e));
    } catch (e) {
      res.json(e);
    }
  },
};
