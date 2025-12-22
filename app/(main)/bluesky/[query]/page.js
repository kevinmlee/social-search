import { Suspense } from 'react'
import Bluesky from '@/views/Platforms/Bluesky/Bluesky'
import Loader from '@/components/Loader/Loader'

export default function BlueskyQueryPage() {
  return (
    <Suspense fallback={<div className="px-5 md:px-8 py-12 text-center text-gray-500"><Loader /></div>}>
      <Bluesky />
    </Suspense>
  )
}
