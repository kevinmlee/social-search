'use client'

import { useState, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Filter as FilterIcon } from "lucide-react"

export default function Filter({ filters, initialFilter = 'hot' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentFilter = searchParams.get('filter') || initialFilter

  const handleFilterClick = (option) => {
    const url = new URL(window.location.href)
    url.searchParams.set('filter', option)
    router.push(`${pathname}?${url.searchParams.toString()}`)
    setOpen(false)
  }

  return (
    <div data-testid="filter" className="flex justify-end py-4">
      <div className="relative inline-block" ref={ref}>
        <div
          data-testid="filter-button"
          className="flex items-center gap-2 cursor-pointer px-4 py-2 text-black bg-primary rounded-md"
          onClick={() => setOpen(!open)}
        >
          <FilterIcon className="w-5 h-5" />
          <span className="active-filter capitalize font-medium">
            {currentFilter}
          </span>
        </div>

        <ul
          className={`absolute right-0 top-full mt-2 text-black bg-primary rounded-md shadow-lg min-w-[200px] z-10 ${open ? "block" : "hidden"}`}
        >
          {Object.keys(filters).map((option) => {
            const isActive = currentFilter === option || (!currentFilter && filters[option])
            return (
              <li
                key={option}
                onClick={() => handleFilterClick(option)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer capitalize font-medium
                  hover:bg-primary/50 first:rounded-t-md last:rounded-b-md
                `}
              >
                <span>{option}</span>
                <div className="w-4 h-4 rounded-full border-2 border-black">
                  {isActive && <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : ''} m-auto mt-0.5`}></div>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}