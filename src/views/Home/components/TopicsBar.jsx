'use client'

import React from "react"

const TopicsBar = ({ topics }) => (
  <ul className="hidden lg:flex sticky top-[85px] bg-white dark:bg-bg-dark flex space-x-10 overflow-x-auto text-lg font-medium capitalize justify-center cursor-pointer py-4 border-b border-[#efefef] dark:border-border-dark">
    {topics.map(topic => (
      <li
        key={"key-" + topic}
        className="topic hover:text-primary transition-colors duration-200"
        onClick={() => {
          const element = document.getElementById(topic);
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - 180;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }}
      >
        {topic}
      </li>
    ))}
  </ul>
)

export default TopicsBar

