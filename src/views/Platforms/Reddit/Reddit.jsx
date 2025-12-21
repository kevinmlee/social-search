import Post from './Post'
import Filter from '../../../components/Filter/Filter'

const endpoint = "https://www.reddit.com"

export default async function Reddit({ params, searchParams }) {
  const query = params?.query || ''
  const filter = searchParams?.filter || 'hot' // default filter

  let posts = []

  if (!query) {
    // General hot posts
    const res = await fetch(`${endpoint}/hot.json?include_over_18=off&limit=50`, { cache: 'no-store' })
    const data = await res.json()
    posts = data.data.children
  } else {
    // Search posts by query
    const sortType = filter === 'recent' ? 'new' : 'hot'
    const res = await fetch(`${endpoint}/search.json?q=${query}&sort=${sortType}&limit=50`, { cache: 'no-store' })
    const data = await res.json()
    posts = data.data.children
  }

  return (
    <div className="px-5 md:px-8">
      <Filter filters={{ hot: filter === 'hot', recent: filter === 'recent' }} />

      <div className="topic posts">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {posts.map(post => (
            <Post data={post} key={post?.data?.id} />
          ))}
        </div>
      </div>
    </div>
  )
}