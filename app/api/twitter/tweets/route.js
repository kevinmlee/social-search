import { NextResponse } from 'next/server'
import Twitter from 'twitter-v2'

const client = new Twitter({
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
})

export async function POST(request) {
  const { searchQuery } = await request.json()

  const searchTweetsParams = {
    query: searchQuery,
    expansions:
      'in_reply_to_user_id,referenced_tweets.id,attachments.media_keys,author_id',
    max_results: 100,
    'tweet.fields': 'public_metrics,created_at',
    'media.fields': 'preview_image_url,url',
    'user.fields': 'profile_image_url',
  }

  const userTweetsParams = {
    expansions: 'attachments.media_keys,author_id',
    'tweet.fields': 'public_metrics,created_at',
    'media.fields': 'preview_image_url,url',
    'user.fields': 'profile_image_url',
    exclude: 'replies,retweets',
    max_results: 20,
  }

  const userParams = {
    'user.fields':
      'public_metrics,profile_image_url,verified,description,location,created_at',
    expansions: 'pinned_tweet_id',
  }

  try {
    const user = await client.get('users/by/username/' + searchQuery, userParams)
    const userId = user.data.id

    const result = {
      userTweets: await client.get('users/' + userId + '/tweets', userTweetsParams),
      searchResults: await client.get('tweets/search/recent', searchTweetsParams),
      user: user,
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
