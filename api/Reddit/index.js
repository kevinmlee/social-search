require("dotenv").config();
const Reddit = require("reddit");

// Initialize Reddit client
const reddit = new Reddit({
  username: process.env.REDDIT_APP_USERNAME,
  password: process.env.REDDIT_APP_PASSWORD,
  appId: process.env.REDDIT_APP_ID,
  appSecret: process.env.REDDIT_APP_SECRET,
  userAgent: "MyApp/1.0.0 (http://example.com)",
});

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery } = req.body;

    /*
    const res = await reddit.post('/api/submit', {
      sr: 'WeAreTheMusicMakers',
      kind: 'link',
      resubmit: true,
      title: 'BitMidi – 100K+ Free MIDI files',
      url: 'https://bitmidi.com'
    })
     
    console.log(res)
    */

    /*
    try {
      return res.json({
        tweets: await client.get("tweets/search/recent", params),
      });
    } catch (e) {
      console.log(e);
      return res.json({ error: e, twitterResults: [] });
    }
    */
  },
};
