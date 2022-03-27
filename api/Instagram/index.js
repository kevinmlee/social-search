require("dotenv").config();
const https = require("https");
const request = require("request");

module.exports = {
  // get users that match search query
  topSearch: async function (req, res, next) {
    const { searchQuery, filter } = req.body;
    const url =
      "https://www.instagram.com/web/search/topsearch/?context=blended&query=" +
      searchQuery;

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => {
        data += stream;
      });

      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
  // get posts by user id
  getUser: function (req, res, next) {
    const options = {
      method: "GET",
      url: "https://" + HOSTNAME + "/cms/v3/domains/",
      headers: {
        accept: "application/json",
        authorization: "Bearer " + req.body.access_token,
      },
    };

    request(options, function (error, response, body) {
      if (error) console.log(error);

      if (response.statusCode === 200) {
        return res.json({
          status: response.statusCode,
          success: true,
          domains: JSON.parse(body),
        });
      } else {
        let error = JSON.parse(body);

        return res.json({
          status: response.statusCode,
          success: false,
        });
      }
    });
  },
};
