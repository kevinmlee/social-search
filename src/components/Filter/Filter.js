'use client'

import React, { useState, useRef, useEffect } from "react"
import { Filter as FilterIcon } from "lucide-react"

export default function Filter({ filters, onSuccess }) {
  const [filter, setFilter] = useState(false);
  const ref = useRef();
  const [options, setOptions] = useState(filters);

  useOutsideClick(ref, () => setFilter(false));

  const handleFilter = (e) => {
    const selectedFilter = e.currentTarget.getAttribute("data-filter");
    onSuccess(selectedFilter); // send selected filter back up

    let tempOptions = options;
    for (const option in tempOptions) {
      if (option === selectedFilter) tempOptions[option] = true;
      else tempOptions[option] = false;
    }
    setOptions(tempOptions);
  };

  return (
    <div id="filterRow" className="py-4">
      <div className="filter relative">
        <div
          className="active-display flex items-center gap-2 cursor-pointer px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setFilter(!filter)}
          ref={ref}
        >
          <span className="active-filter capitalize font-medium text-black dark:text-white">Filter</span>
          <FilterIcon className="w-5 h-5" />
        </div>

        <ul className={`filter-options absolute top-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg min-w-[200px] z-10 ${filter ? "block" : "hidden"}`}>
          {Object.keys(filters).map((option) => (
            <li
              key={option}
              data-filter={option}
              onClick={(e) => handleFilter(e)}
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 capitalize text-black dark:text-white first:rounded-t-md last:rounded-b-md"
            >
              {option}
              <div className={`w-4 h-4 rounded-full border-2 ${options[option] ? 'border-accent bg-accent' : 'border-gray-400'}`}>
                {options[option] && <div className="w-2 h-2 rounded-full bg-white m-auto mt-0.5"></div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const useOutsideClick = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) callback();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });
};
