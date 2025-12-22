import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(utc)

const Post = ({ data }) => {
  const post = data?.post || data
  const author = post?.author
  const record = post?.record
  const embed = post?.embed

  // Construct the post URL
  const postUrl = author?.handle && post?.uri
    ? `https://bsky.app/profile/${author.handle}/post/${post.uri.split('/').pop()}`
    : '#'

  return (
    <div data-testid="post" className="pb-6 md:pb-0">
      <a href={postUrl} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:text-primary transition-colors duration-200">
        <div data-testid="details">
          {/* Display embedded images */}
          {embed?.images && embed.images.length > 0 && (
            <div className="mb-3 relative w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: `${embed.images[0].aspectRatio?.width || 16} / ${embed.images[0].aspectRatio?.height || 9}` }}>
              <img
                src={embed.images[0].thumb || embed.images[0].fullsize}
                alt={embed.images[0].alt || "Post image"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Display embedded external content */}
          {embed?.external && embed.external.thumb && (
            <div className="mb-3 relative w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '16 / 9' }}>
              <img
                src={embed.external.thumb}
                alt={embed.external.title || "External content"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div data-testid="text">
            <div data-testid="author-details" className="mb-2">
              <div className="text-sm font-medium text-black dark:text-primary">
                {author?.displayName || author?.handle || 'Unknown'}
              </div>
              {author?.handle && (
                <div className="text-xs text-black/70 dark:text-[#999999]">
                  @{author.handle}
                </div>
              )}
            </div>

            <div className="mb-2">
              <span className="text-xs text-black/70 dark:text-[#999999]">
                {record?.createdAt ? dayjs(record.createdAt).fromNow() : ''}
              </span>
            </div>

            {record?.text && (
              <div data-testid="post-text">
                <p className="font-merriweather text-base line-clamp-3" title={record.text}>
                  {record.text}
                </p>
              </div>
            )}

            {post?.likeCount !== undefined && (
              <div className="mt-2 text-xs text-black/70 dark:text-[#999999]">
                {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
                {post?.repostCount > 0 && ` · ${post.repostCount} ${post.repostCount === 1 ? 'repost' : 'reposts'}`}
                {post?.replyCount > 0 && ` · ${post.replyCount} ${post.replyCount === 1 ? 'reply' : 'replies'}`}
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post
