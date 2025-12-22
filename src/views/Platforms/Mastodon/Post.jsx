import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(utc)

const Post = ({ data }) => {
  const post = data || {}

  // Construct the post URL
  const postUrl = post?.url || '#'

  // Get media attachments
  const mediaAttachments = post?.media_attachments || []
  const firstMedia = mediaAttachments[0]

  // Remove HTML tags from content
  const stripHtml = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
  }

  return (
    <div data-testid="post" className="pb-6 md:pb-0">
      <a href={postUrl} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:text-primary transition-colors duration-200">
        <div data-testid="details">
          {/* Display media if available */}
          {firstMedia && firstMedia.type === 'image' && (
            <div className="mb-3 relative w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '16 / 9' }}>
              <img
                src={firstMedia.preview_url || firstMedia.url}
                alt={firstMedia.description || "Mastodon post media"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div data-testid="text">
            <div data-testid="author-details" className="mb-2">
              <div className="text-sm font-medium text-black dark:text-primary">
                {post?.account?.display_name || post?.account?.username || 'Unknown'}
              </div>
              {post?.account?.acct && (
                <div className="text-xs text-black/70 dark:text-[#999999]">
                  @{post.account.acct}
                </div>
              )}
            </div>

            <div className="mb-2">
              <span className="text-xs text-black/70 dark:text-[#999999]">
                {post?.created_at ? dayjs(post.created_at).fromNow() : ''}
              </span>
            </div>

            {post?.content && (
              <div data-testid="post-text">
                <p className="font-merriweather text-base">
                  {stripHtml(post.content)}
                </p>
              </div>
            )}

            <div className="mt-2 text-xs text-black/70 dark:text-[#999999]">
              {post?.favourites_count !== undefined && (
                <span>
                  {post.favourites_count} {post.favourites_count === 1 ? 'favorite' : 'favorites'}
                </span>
              )}
              {post?.reblogs_count !== undefined && post.reblogs_count > 0 && (
                <span> · {post.reblogs_count} {post.reblogs_count === 1 ? 'boost' : 'boosts'}</span>
              )}
              {post?.replies_count !== undefined && post.replies_count > 0 && (
                <span> · {post.replies_count} {post.replies_count === 1 ? 'reply' : 'replies'}</span>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Post
