'use client'

import React from "react"

import { decodeHtml } from '@/util'

const YouTubeVideo = ({ html }) => (
  <div className="youtube-video media mb-2">
    <div dangerouslySetInnerHTML={{ __html: decodeHtml(html) }} />
  </div>
)

export default YouTubeVideo