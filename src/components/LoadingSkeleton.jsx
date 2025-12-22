export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-16">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="break-inside-avoid mb-6 md:mb-12 animate-pulse"
        >
          {/* Image placeholder */}
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />

          {/* Title placeholder */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />

          {/* Meta info placeholder */}
          <div className="flex gap-2 mb-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
