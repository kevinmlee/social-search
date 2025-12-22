import { Suspense } from 'react'
import Reddit from '@/views/Platforms/Reddit/Reddit'

export default function RedditQueryPage() {
  return (
    <Suspense fallback={<div className="px-5 md:px-8 py-12 text-center text-gray-500">Loading...</div>}>
      <Reddit />
    </Suspense>
  )
}
