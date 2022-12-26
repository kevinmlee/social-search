import React, { useState, useRef, useEffect } from "react";
import { Box, Radio } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import "./Filter.css";

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
    <Box id="filterRow">
      <Box className="filter">
        <div
          className="active-display"
          onClick={() => setFilter(!filter)}
          ref={ref}
        >
          <span className="active-filter">Filter</span>
          <FilterAltIcon />
        </div>

        <ul className={"filter-options " + (filter ? "active" : "")}>
          {Object.keys(filters).map((option) => (
            <li
              key={option}
              data-filter={option}
              onClick={(e) => handleFilter(e)}
            >
              {option}
              <Radio size="small" checked={options[option]} />
            </li>
          ))}
        </ul>
      </Box>
    </Box>
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
