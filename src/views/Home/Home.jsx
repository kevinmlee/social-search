'use client'

import React, { useEffect, useState } from "react"

import { FadeUp, ScrollToTopOnLoad, LoadingSkeleton } from "@/components"
import Post from "./components/Post"
import TopicsBar from "./components/TopicsBar"

const CATEGORIES = ["top", "technology", "business", "science", "sports", "health"]

// Display names for categories
const CATEGORY_TITLES = {
  'top': 'Top News',
  'technology': 'Technology',
  'business': 'Business',
  'science': 'Science',
  'sports': 'Sports',
  'health': 'Health',
}

// Fetch a single category from the API
async function fetchCategory(category) {
  try {
    const res = await fetch(`/api/news/${category}`)

    if (!res.ok) {
      console.error(`API error for ${category}:`, res.status, res.statusText)
      return null
    }

    const json = await res.json()
    return json.articles || []
  } catch (err) {
    console.error(`Fetch error for ${category}:`, err)
    return null
  }
}

export default function Home() {
  // Track loading state and articles for each category separately
  const [categoryData, setCategoryData] = useState(() => {
    // Initialize with loading state for each category
    const initial = {}
    CATEGORIES.forEach(cat => {
      initial[cat] = { loading: true, articles: [] }
    })
    return initial
  })

  useEffect(() => {
    // Fetch each category independently (progressive loading)
    CATEGORIES.forEach(async (category) => {
      const articles = await fetchCategory(category)

      setCategoryData(prev => ({
        ...prev,
        [category]: {
          loading: false,
          articles: articles || []
        }
      }))
    })
  }, [])

  return (
    <>
      <ScrollToTopOnLoad />
      <div className="px-5 md:px-8">
        <TopicsBar topics={CATEGORIES} />

        <div>
          {CATEGORIES.map(category => (
            <div id={category} className="pb-6 md:pb-12 border-b border-[#efefef] dark:border-border-dark last:border-b-0" key={category}>
              <h4 className="font-merriweather text-primary section-title text-3xl md:text-4xl font-medium py-6 md:py-12">
                {CATEGORY_TITLES[category] || category}
              </h4>

              {categoryData[category]?.loading ? (
                <LoadingSkeleton count={4} />
              ) : (
                <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-16">
                  {categoryData[category]?.articles?.map((post, index) => (
                    <FadeUp key={`${category}-${index}`} className="break-inside-avoid mb-6 md:mb-12 border-white/15 border-b last:border-b-0 last:mb-0 md:border-b-0">
                      <Post data={post} />
                    </FadeUp>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
