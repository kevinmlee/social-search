import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import axios from "axios";

import { Box, Paper, Grid, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
import VerifiedIcon from "@mui/icons-material/Verified";

import Loader from "../../../components/Loader/Loader";
import Filter from "../../../components/Filter/Filter";

import "./Twitter.css";

export default function Twitter({ setAppState }) {
  const searchQuery = localStorage.getItem("searchQuery");
  //const [cleanedQuery, setCleanedQuery] = useState("");
  const [user, setUser] = useState({});
  const [tweetsByUserId, setTweetsByUserId] = useState([]);
  const [tweetsByRecent, setTweetsByRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    user: true,
    popular: false,
    recent: false,
  });

  useEffect(() => {
    setTimeout(() => window.AOS.refresh(), 700);
  });

  const handleFilter = (selectedOption) => {
    const tempFilters = { ...filters };
    for (const option in filters) {
      if (option === selectedOption) tempFilters[option] = true;
      else tempFilters[option] = false;
    }
    setFilters(tempFilters);
  };

  const decodeText = (string) => {
    return string
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&gt;", ">");
  };

  /*
  const oneWord = (string) => {
    var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
    if (regexp.test(string)) return false;
    else return true;
  };
  */

  const objectEmpty = (obj) => {
    return (
      obj && // 👈 null and undefined check
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  const getHighQualityAvatar = (url) => {
    return url.replace("_normal", "_400x400");
  };

  const twitterSearchByRecent = useCallback(async () => {
    setLoading(true);

    // serverless API call
    await fetch(`/netlify/functions/twitter/search`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setTweetsByRecent(data.tweets);
        setLoading(false);
      });

    /*return await axios
      .put("/twitter/search", {
        searchQuery: localStorage.getItem("searchQuery"),
      })
      .then(
        (response) => {
          setTweetsByRecent(response.data.tweets);
          setLoading(false);
        },
        (error) => console.log(error)
      );
      */
  }, []);

  const twitterSearchByUsername = useCallback(async () => {
    const query = localStorage.getItem("searchQuery");

    // if search query is a username (has @ symbol in front), remove symbol and continue to get user
    //if (oneWord(query))
    //if (query.charAt(0) === "@")
    //setCleanedQuery(query.substring(1));

    return await axios
      .put("/twitter/search/username", {
        searchQuery: query,
      })
      .then(
        async (response) => {
          if (!response.data.error || !objectEmpty(response.data)) {
            setUser(response.data.twitterResults);
            getTweetsByUserID(response.data.twitterResults.id);
          }
        },
        (error) => console.log(error)
      );
  }, []);

  const getTweetsByUserID = async (twitterId) => {
    setLoading(true);

    return await axios
      .put("/twitter/get/tweets/id", {
        userId: twitterId,
      })
      .then(
        (response) => {
          setTweetsByUserId(response.data.tweets);
          setLoading(false);
        },
        (error) => console.log(error)
      );
  };

  const sortByPopularity = (tweets) => {
    if (tweets)
      return [...tweets].sort((a, b) => {
        let aPublicMetricsCount =
          a.public_metrics.retweet_count + a.public_metrics.like_count;
        let bPublicMetricsCount =
          b.public_metrics.retweet_count + b.public_metrics.like_count;

        return aPublicMetricsCount < bPublicMetricsCount ? 1 : -1;
      });
  };

  const tweetCard = (tweet, type) => {
    let mediaUrl = "";

    if (tweet.attachments) {
      let media = {};
      let mediaKey = tweet.attachments.media_keys[0];

      if (type === "user") {
        media = tweetsByUserId["includes"]["media"].filter(
          (media) => media.media_key === mediaKey
        );
      } else if (type === "recent")
        media = tweetsByRecent["includes"]["media"].filter(
          (media) => media.media_key === mediaKey
        );

      if (media && media[0]) {
        if (media[0].hasOwnProperty("url")) mediaUrl = media[0]["url"];
        else if (media[0].hasOwnProperty("preview_image_url"))
          mediaUrl = media[0]["preview_image_url"];
      }
    }

    return (
      <Box className="post twitter" key={tweet.id} data-aos="fade-up">
        <Box className="details">
          <a
            href={"https://twitter.com/twitter/status/" + tweet.id}
            target="_blank"
            rel="noopener noreferrer"
            className="text"
          >
            <Grid className="top" sx={{ paddingTop: 2 }}>
              <Grid item sx={{ width: "60px" }}>
                <div className="avatar">
                  <img
                    src={user.profile_image_url}
                    alt={user.name + "'s profile image'"}
                  />
                </div>
              </Grid>

              <Grid item xs={10}>
                <Box className="author" sx={{ paddingBottom: 1 }}>
                  <div className="name">{user.name}</div>
                  <span className="username">@{user.username}</span>
                  <span style={{ color: "#999999" }}> · </span>
                  <Typography variant="caption" style={{ color: "#999999" }}>
                    {moment(tweet.created_at).fromNow()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              className="post-title"
              sx={{ paddingTop: 2, paddingBottom: 2 }}
            >
              <Typography variant="h5">{decodeText(tweet.text)}</Typography>
            </Box>
          </a>

          {mediaUrl && (
            <Box
              className="media"
              onClick={() => {
                setAppState({ backdropImage: mediaUrl });
                setAppState({ backdropToggle: true });
              }}
            >
              <div className="media-image">
                <img
                  className="featured-image"
                  src={mediaUrl}
                  alt={tweet.text}
                  loading="lazy"
                />
              </div>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const displayTweets = () => {
    return (
      <Box>
        {filters.user && "data" in tweetsByUserId && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {tweetsByUserId["data"]
                .slice(0, 50)
                .map((tweet) => tweetCard(tweet, "user"))}
            </Masonry>
          </Box>
        )}

        {filters.recent && "data" in tweetsByRecent && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {tweetsByRecent["data"]
                .slice(0, 50)
                .map((tweet) => tweetCard(tweet, "recent"))}
            </Masonry>
          </Box>
        )}

        {filters.popular && "data" in tweetsByRecent && (
          <Box className="topic posts">
            <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={7}>
              {sortByPopularity(tweetsByRecent["data"])
                .slice(0, 50)
                .map((tweet) => tweetCard(tweet, "recent"))}
            </Masonry>
          </Box>
        )}
      </Box>
    );
  };

  const displayUserCard = () => {
    return (
      <Paper elevation={3} className="tweet user" sx={{ marginTop: 6 }}>
        <a
          href={"https://twitter.com/" + user.username}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box sx={{ padding: 2 }}>
            <div className="d-flex align-center m-no-flex">
              <div className="avatar">
                <img
                  src={getHighQualityAvatar(user.profile_image_url)}
                  alt={user.name + "'s profile image'"}
                />
              </div>

              <Box className="username" sx={{ paddingLeft: 2 }}>
                <div className="d-flex align-center">
                  <Typography variant="h5">{user.name}</Typography>

                  {user.verified && (
                    <div className="verified">
                      <VerifiedIcon />
                    </div>
                  )}
                </div>
                <div style={{ color: "#999999" }}>@{user.username}</div>
                <Typography variant="subtitle1" sx={{ paddingTop: 1 }}>
                  {user.description}
                </Typography>
                <Box className="public-metrics" spacing={2} sx={{}}>
                  {user.public_metrics && (
                    <Typography
                      className="metric flex-container"
                      variant="overline"
                      sx={{ paddingRight: 4 }}
                      style={{ color: "#999999" }}
                    >
                      {user.public_metrics.followers_count.toLocaleString()}{" "}
                      followers
                    </Typography>
                  )}

                  {user.public_metrics && (
                    <Typography
                      className="metric flex-container"
                      variant="overline"
                      style={{ color: "#999999" }}
                    >
                      {user.public_metrics.following_count.toLocaleString()}{" "}
                      following
                    </Typography>
                  )}
                </Box>
              </Box>
            </div>
          </Box>
        </a>
      </Paper>
    );
  };

  useEffect(() => {
    if (searchQuery !== "") {
      twitterSearchByUsername();
      if (!("data" in tweetsByRecent)) twitterSearchByRecent();
    }
  }, [
    twitterSearchByUsername,
    twitterSearchByRecent,
    tweetsByRecent,
    searchQuery,
  ]);

  return (
    <Box sx={{ padding: "0 30px" }}>
      <Filter
        filters={filters}
        onSuccess={(response) => handleFilter(response)}
      />

      {loading && <Loader />}
      {!objectEmpty(user) && user && displayUserCard()}
      {displayTweets()}
    </Box>
  );
}
