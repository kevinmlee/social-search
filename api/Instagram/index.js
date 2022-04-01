require("dotenv").config();
const Insta = require("scraper-instagram");
const InstaClient = new Insta();
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

  searchHashtag: async function (req, res, next) {
    const { hashtag } = req.body;

    InstaClient.searchHashtag(hashtag).then((hashtags) =>
      res.json(JSON.parse(hashtags)).catch((err) => res.json(err))
    );
  },

  getProfile: async function (req, res, next) {
    const { username } = req.body;
    InstaClient.getProfile(username).then((profile) =>
      res.json(JSON.parse(profile)).catch((err) => res.json(err))
    );
  },

  getProfilePosts: async function (req, res, next) {
    const { username } = req.body;
    InstaClient.getProfilePosts(username, maxCount, pageId).then((posts) =>
      res.json(JSON.parse(posts)).catch((err) => res.json(err))
    );
  },

  getHashtag: async function (req, res, next) {
    const { hashtag } = req.body;
    InstaClient.getHashtag(hashtag).then((hashtag) =>
      res.json(JSON.parse(hashtag)).catch((err) => res.json(err))
    );
  },

  getHashtagPosts: async function (req, res, next) {
    const { hashtag } = req.body;
    InstaClient.getHashtagPosts(hashtag, maxCount, pageId).then((posts) =>
      res.json(JSON.parse(posts)).catch((err) => res.json(err))
    );
  },

  getPost: async function (req, res, next) {
    const { shortcode } = req.body;
    InstaClient.getPost(shortcode).then((post) =>
      res.json(JSON.parse(post)).catch((err) => res.json(err))
    );
  },
};
