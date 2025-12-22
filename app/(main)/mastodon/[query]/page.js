import { Suspense } from 'react'
import Mastodon from '@/views/Platforms/Mastodon/Mastodon'

export default function MastodonQueryPage() {
  return (
    <Suspense fallback={<div className="px-5 md:px-8 py-12 text-center text-gray-500">Loading...</div>}>
      <Mastodon />
    </Suspense>
  )
}
