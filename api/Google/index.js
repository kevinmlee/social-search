require("dotenv").config();
const googleTrends = require("google-trends-api");
//const https = require("https");
//const request = require("request");

module.exports = {
  interestOverTime: async function (req, res, next) {
    const { searchQuery } = req.body;

    googleTrends
      .interestOverTime({ keyword: searchQuery })
      .then((results) => res.json(results))
      .catch((err) => res.json(err));
  },
  interestByRegion: async function (req, res, next) {
    const { searchQuery, startTime, endTime, resolution } = req.body;

    googleTrends
      .interestByRegion({
        keyword: searchQuery,
        startTime: startTime,
        endTime: endTime,
        resolution: resolution,
        //startTime: new Date("2017-02-01"),
        //endTime: new Date("2017-02-06"),
        //resolution: "CITY",
      })
      .then((results) => res.json(results))
      .catch((err) => res.json(err));
  },
  relatedTopics: async function (req, res, next) {
    const { searchQuery, startTime, endTime } = req.body;

    googleTrends
      .relatedTopics({
        keyword: searchQuery,
        startTime: startTime,
        endTime: endTime,
      })
      .then((results) => res.json(results))
      .catch((err) => res.json(err));
  },
  relatedQueries: async function (req, res, next) {
    const { searchQuery } = req.body;

    googleTrends
      .relatedQueries({
        keyword: searchQuery,
      })
      .then((results) => res.json(results))
      .catch((err) => res.json(err));
  },
};
