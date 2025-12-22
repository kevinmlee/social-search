import { Suspense } from 'react'
import Bluesky from '@/views/Platforms/Bluesky/Bluesky'

export default function BlueskyPage() {
  return (
    <Suspense fallback={<div className="px-5 md:px-8 py-12 text-center text-gray-500">Loading...</div>}>
      <Bluesky />
    </Suspense>
  )
}
