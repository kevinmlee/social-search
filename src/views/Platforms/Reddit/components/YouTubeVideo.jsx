'use client'

import React from "react"

import { decodeHtml } from '@/util'

const YouTubeVideo = ({ html }) => (
  <div data-testid="youtube-video" className="overflow-hidden rounded-lg mb-4">
    <div dangerouslySetInnerHTML={{ __html: decodeHtml(html) }} />
  </div>
)

export default YouTubeVideo