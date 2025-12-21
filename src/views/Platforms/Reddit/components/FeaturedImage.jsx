import Image from 'next/image'
import React from "react"

const FeaturedImage = ({ postData }) => (
  <div id="media">
    <Image
      id="featured-image"
      src={postData.data.preview.images[0].source.url.replaceAll("&amp;", "&")}
      alt={postData.data.title}
      width={postData.data.preview.images[0].source.width}
      height={postData.data.preview.images[0].source.height}
      loading="lazy"
    />
  </div>
)

export default FeaturedImage