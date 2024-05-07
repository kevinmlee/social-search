const Parser = require('rss-parser')
const parser = new Parser()

exports.handler = async (event, context) => {
  const { subreddit } = JSON.parse(event.body)

  try {
    // Fetch Reddit RSS feed
    const feed = await parser.parseURL(`https://www.reddit.com/r/${subreddit}.rss`)
    
    // Extract relevant information (e.g., post titles and URLs)
    /*
    const posts = feed.items.map(item => ({
      author: item.author,
      content: item.content,
      date: item.pubDate,
      link: item.link,
      title: item.title
    }));
    */

    // Return the posts as JSON
    return {
      statusCode: 200,
      body: JSON.stringify(feed)
    };
  } catch (error) {
    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Reddit posts' })
    }
  }
}