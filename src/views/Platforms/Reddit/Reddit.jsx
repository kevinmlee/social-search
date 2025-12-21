import Post from './Post'
import Filter from '../../../components/Filter/Filter'
import { FadeUp } from '@/components'

const endpoint = "https://www.reddit.com"

export default async function Reddit({ params, searchParams }) {
  const query = params?.query || ''
  const filter = searchParams?.filter || 'hot' // default filter

  let posts = []

  if (!query) {
    // General hot posts
    const res = await fetch(`${endpoint}/hot.json?include_over_18=off&limit=50`, {
      next: { revalidate: 300 }, // cache for 5 minutes
    })
    const data = await res.json()
    posts = data.data.children
  } else {
    // Search posts by query
    const sortType = filter === 'recent' ? 'new' : 'hot'
    const res = await fetch(`${endpoint}/search.json?q=${query}&sort=${sortType}&limit=50`,     {
      next: { revalidate: 300 }, // cache for 5 minutes
    })
    const data = await res.json()
    posts = data.data.children
  }

  return (
    <div className="px-5 md:px-8">
      <Filter filters={{ hot: filter === 'hot', recent: filter === 'recent' }} />

      <div className="topic posts">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-16">
          {posts.map(post => (
            <FadeUp key={post?.data?.id} className="break-inside-avoid mb-12 border-white/15 border-b last:border-b-0 md:border-b-0">
              <Post data={post} />
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  )
}