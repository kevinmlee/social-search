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
    } catch (e) {
      res.json(e);
    }
    //request.on("error", (e) => res.json(e));
  },
};
