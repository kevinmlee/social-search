const Twitter = require("twitter-v2");

// Initialize twitter client
/*
const client = new Twitter({
  //consumer_key: process.env.TWITTER_API_KEY,
  //consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});
*/

exports.handler = async (event, context, callback) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "twitter search has been called",
    }),
  };

  /*
  const { searchQuery } = JSON.parse(event.body);

  const params = {
    query: searchQuery,
    //"-is": "retweet",
    //"-filter": "replies",
    expansions:
      "in_reply_to_user_id,referenced_tweets.id,attachments.media_keys,author_id",
    max_results: 100,
    "tweet.fields": "public_metrics,created_at",
    "media.fields": "preview_image_url,url",
    "user.fields": "profile_image_url",
  };

  try {
    return res.json({
      tweets: await client.get("tweets/search/recent", params),
    });
  } catch (e) {
    console.log(e);
    return res.json({ error: e, twitterResults: [] });
  }
  */
};
